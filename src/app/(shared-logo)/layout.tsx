import { BrandMark, PageContainer, ThemeSwitch } from '@/design-system';

export default function AccountLayout({children}: Readonly<{children: React.ReactNode;}>) {

    return (
        <div className="flex min-h-svh flex-col bg-canvas text-ink">
            <header className="border-b border-line bg-canvas/90 backdrop-blur-xl">
                <PageContainer className="flex h-16 items-center justify-between sm:h-[4.5rem]">
                    <BrandMark />
                    <ThemeSwitch />
                </PageContainer>
            </header>
            {children}
        </div>
    );
};
