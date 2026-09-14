'use client';

import Image from 'next/image';
import { ImagePlus, Paperclip, Trash2 } from 'lucide-react';
import React from 'react';
import { Controller, FieldPath, FieldValues, type Control } from 'react-hook-form';
import { ActionDialog } from '@/design-system';

type ControlledMediaUploadProps<T extends FieldValues> = {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    description?: string;
    media?: Record<string, string>[];
    uploader?: React.ReactNode;
};

const mediaUrl = (media: Record<string, string>) => media.url ?? media.imageUrl ?? media.mediaUrl ?? media.secureUrl;

export function ControlledMediaUpload<T extends FieldValues>({ control, name, label, description, media = [], uploader }: ControlledMediaUploadProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                const values = Array.isArray(field.value) ? field.value as string[] : field.value ? [field.value as string] : [];
                const attachments = values.map((value) => ({
                    value,
                    preview: value.startsWith('http') ? value : mediaUrl(media.find(item => item.id === value) ?? {}),
                }));

                const uploaderWithAction = React.isValidElement<{ onAction?: (value: string) => void }>(uploader)
                    ? React.cloneElement(uploader, {
                        onAction: (value: string) => field.onChange([...values, value]),
                    })
                    : uploader;

                return (
                    <section className="space-y-3 rounded-2xl border border-line bg-canvas-subtle/60 p-4" aria-labelledby={`${name}-label`}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h3 id={`${name}-label`} className="flex items-center gap-2 text-sm font-semibold text-ink"><Paperclip className="size-4 text-accent" aria-hidden="true" />{label}</h3>
                                {description ? <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p> : null}
                            </div>
                            <ActionDialog as="create" title={attachments.length ? 'Add another' : 'Attach media'} subTitle="Attach certificate media" icon={ImagePlus} triggerClassName="border border-line bg-surface px-3 py-2 hover:border-accent">
                                {uploaderWithAction}
                            </ActionDialog>
                        </div>

                        {attachments.length ? (
                            <ul className="grid gap-3 sm:grid-cols-2">
                                {attachments.map((attachment, index) => (
                                    <li key={`${attachment.value}-${index}`} className="group relative overflow-hidden rounded-xl border border-line bg-surface">
                                        {attachment.preview ? (
                                            <div className="relative aspect-[4/3] bg-canvas-subtle">
                                                <Image src={attachment.preview} alt={`Certificate attachment ${index + 1}`} fill unoptimized className="object-contain p-2" />
                                            </div>
                                        ) : (
                                            <div className="flex aspect-[4/3] items-center justify-center gap-2 text-xs text-ink-muted"><Paperclip className="size-4" aria-hidden="true" />Saved attachment {index + 1}</div>
                                        )}
                                        <button type="button" onClick={() => field.onChange(values.filter((_, valueIndex) => valueIndex !== index))} className="absolute right-2 top-2 grid size-9 place-items-center rounded-lg border border-line bg-surface/95 text-danger shadow-sm transition hover:bg-danger/10" aria-label={`Remove certificate attachment ${index + 1}`}>
                                            <Trash2 className="size-4" aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-muted">No media attached yet.</div>}
                        {fieldState.error ? <p role="alert" className="text-xs text-danger">{fieldState.error.message}</p> : null}
                    </section>
                );
            }}
        />
    );
}
