'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Trash2 } from 'lucide-react';
import { FormInput } from './FormInput';
import { ImageUploaderProps } from './types.forms';
import { getCroppedImage } from '@/lib/image/getCroppedImage';

export const ImageUploader = ({ preset, onAction, uploadImage, onRemove, onClose }: ImageUploaderProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels || isSaving) return;
        if (!onAction) {
            setError('This image cannot be saved right now. Please try again.');
            return;
        }
        setIsSaving(true);
        setError(null);

        try {
            const cropped = await getCroppedImage(imageSrc, croppedAreaPixels);
            let imageUrl: string;
            if (uploadImage) {
                imageUrl = await uploadImage(cropped);
            } else {
                const formData = new FormData();
                formData.append('file', cropped);
                formData.append('upload_preset', preset);

                const res = await fetch('https://api.cloudinary.com/v1_1/dxebzmnn9/image/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await res.json() as { secure_url?: string; error?: { message?: string } };
                if (!res.ok || !data.secure_url) {
                    throw new Error(data.error?.message ?? 'Could not upload the image.');
                }
                imageUrl = data.secure_url;
            }

            await onAction(imageUrl);
            onClose?.();
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Could not save the image.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!onRemove || isSaving) return;
        setIsSaving(true);
        setError(null);

        try {
            await onRemove();
            onClose?.();
        } catch (removeError) {
            setError(removeError instanceof Error ? removeError.message : 'Could not remove the image.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <FormInput label='Choose File' type='file' accept='image/*' onChange={handleFileChange} className='cursor-pointer' />

            {imageSrc && (
                <div className="relative w-full h-96">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={preset === 'Profile_Picture' ? 1 : preset === 'Cover_Photo' ? 3/1 : 1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>
            )}

            {imageSrc && (
                <input
                    type='range'
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={e => setZoom(parseFloat(e.target.value))}
                    className='w-full'
                />
            )}

            {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}

            {imageSrc && (
                <button
                    onClick={handleUpload}
                    type="button"
                    disabled={isSaving}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? 'Saving photo…' : 'Save photo'}
                </button>
                
            )}

            {onRemove ? (
                <button
                    onClick={handleRemove}
                    type="button"
                    disabled={isSaving}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-5 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Trash2 className="size-4" aria-hidden="true" />
                    {isSaving ? 'Removing photo…' : 'Remove photo'}
                </button>
            ) : null}
        </div>
    );
};
