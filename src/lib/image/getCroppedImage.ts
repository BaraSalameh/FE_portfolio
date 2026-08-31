import type { Area } from 'react-easy-crop';

const loadImage = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.crossOrigin = 'anonymous';
    image.src = url;
});

export const getCroppedImage = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not available');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    context.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Failed to create cropped image')), 'image/jpeg');
    });
};
