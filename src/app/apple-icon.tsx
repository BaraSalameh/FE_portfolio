import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    alignItems: 'center',
                    background: '#5037c9',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <svg width="132" height="132" viewBox="0 0 64 64" fill="none">
                    <g stroke="#faf7ef" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5">
                        <path d="m32 12-5.1 15.5a7 7 0 0 1-4.4 4.4L7 37l15.5 5.1a7 7 0 0 1 4.4 4.4L32 62l5.1-15.5a7 7 0 0 1 4.4-4.4L57 37l-15.5-5.1a7 7 0 0 1-4.4-4.4L32 12Z" transform="translate(0 -5) scale(.86) translate(5 5)" />
                        <path d="M14 10v8M10 14h8M51 46v8M47 50h8" />
                    </g>
                </svg>
            </div>
        ),
        size,
    );
}
