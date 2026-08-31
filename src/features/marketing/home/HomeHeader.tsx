import { ActionLink, BrandMark, PageContainer, ThemeSwitch } from '@/design-system';
import { paths } from '@/lib/pathHelper';

export function HomeHeader() {
    return (
        <header className="border-b border-line/80 bg-canvas/85 backdrop-blur-xl">
            <PageContainer className="flex h-16 items-center justify-between sm:h-[4.5rem]">
                <BrandMark />
                <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Primary navigation">
                    <ActionLink href={paths.root.search.path()} intent="quiet" size="sm" className="max-sm:hidden">
                        Explore
                    </ActionLink>
                    <ActionLink href={paths.root.auth.login.path()} intent="quiet" size="sm" className="whitespace-nowrap max-sm:px-3">
                        Sign in
                    </ActionLink>
                    <ActionLink href={paths.root.auth.register.path()} size="sm" className="max-sm:hidden">
                        Start building
                    </ActionLink>
                    <ThemeSwitch />
                </nav>
            </PageContainer>
        </header>
    );
}
