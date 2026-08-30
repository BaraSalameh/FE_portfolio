'use client';

import { Main, Paragraph } from '@/components';
import ButtonClient from '@/components/ui/ButtonClient';

export default function DashboardError({ reset }: { reset: () => void }) {
    return (
        <Main>
            <div className="mx-auto max-w-lg space-y-4 text-center">
                <Paragraph>We could not load this portfolio. Please try again.</Paragraph>
                <ButtonClient onClick={reset}>Try again</ButtonClient>
            </div>
        </Main>
    );
}
