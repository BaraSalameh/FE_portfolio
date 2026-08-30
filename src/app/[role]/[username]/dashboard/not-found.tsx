import Link from 'next/link';
import { Main, Paragraph } from '@/components';

export default function DashboardNotFound() {
    return (
        <Main>
            <div className="mx-auto max-w-lg space-y-4 text-center">
                <h1 className="text-2xl font-bold">Portfolio not found</h1>
                <Paragraph>The requested dashboard role or portfolio does not exist.</Paragraph>
                <Link className="underline" href="/">Return home</Link>
            </div>
        </Main>
    );
}
