'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { FormInput } from './FormInput';
import { ImageUploaderProps } from './types.forms';
import { getCroppedImage } from '@/lib/image/getCroppedImage';

export const ImageUploader = ({ preset, onAction, onClose }: ImageUploaderProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0 });

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setImageSrc(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        const cropped = await getCroppedImage(imageSrc, croppedAreaPixels);

        const formData = new FormData();
        formData.append('file', cropped);
        formData.append('upload_preset', preset);

        const res = await fetch('https://api.cloudinary.com/v1_1/dxebzmnn9/image/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        onAction?.(data.secure_url);
        onClose?.();
    };

    return (
        <div className="space-y-4">
            {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
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

            {imageSrc && (
                <button
                    onClick={handleUpload}
                    type="button"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong"
                >
                    Upload
                </button>
                
            )}
        </div>
    );
};
