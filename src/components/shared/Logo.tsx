import Image from "next/image";

export const Logo = () =>
    <Image
        src='/portfolio-logo.svg'
        alt="portfolio logo"
        width={300}
        height={80}
        priority
    />