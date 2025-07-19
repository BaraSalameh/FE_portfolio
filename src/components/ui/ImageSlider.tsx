'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ImageSliderProps } from './types.ui';

export const ImageSlider = ({imageList}: ImageSliderProps) => {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {imageList.map((src, index) => (
                    <div className="min-w-full h-[200px] sm:h-[350px] relative" key={index}>
                        <Image src={src} alt={`Slide ${index + 1}`} layout='fill' objectFit="fill" priority />
                    </div>
                ))}
            </div>

            {imageList.length > 1 &&
            <>
            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black cursor-pointer"
                onClick={prevSlide}
            >
                &#10094;
            </button>
            <button
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black cursor-pointer"
                onClick={nextSlide}
            >
                &#10095;
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {imageList.map((_, index) => (
                    <button
                        key={index}
                        className={`h-2 w-2 rounded-full ${index === current ? 'bg-white' : 'bg-white/50'}`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
            </>
            }
        </div>
    );
}