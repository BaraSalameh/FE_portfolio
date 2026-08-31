import { ActionLink } from '@/design-system';
import { ArrowLeft, Check, MailCheck } from 'lucide-react';
import { paths } from "@/lib/pathHelper";

const Page = () => {
    return (
        <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
            <section className="w-full max-w-[34rem] rounded-[1.75rem] border border-line bg-surface p-6 shadow-xl shadow-black/5 sm:p-9">
                <div className="grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-strong">
                    <MailCheck className="size-6" aria-hidden="true" />
                </div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-accent">One more step</p>
                <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Check your email</h1>
                <p className="mt-4 leading-7 text-ink-muted">We sent a confirmation link to your email address. Open it to verify your account and continue building.</p>
                <div className="mt-7 rounded-2xl border border-line bg-canvas-subtle p-5">
                    <p className="text-sm font-bold">If it hasn&apos;t arrived:</p>
                    <ul className="mt-3 space-y-2.5 text-sm text-ink-muted">
                        {['Check your spam or junk folder', 'Confirm that you used the right email address', 'Sign in to request another confirmation email'].map((item) => (
                            <li key={item} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" /> {item}</li>
                        ))}
                    </ul>
                </div>
                <p className="mt-5 text-xs leading-5 text-ink-muted">The confirmation link remains valid for 15 minutes. You can safely close this page.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <ActionLink href={paths.root.auth.login.path()} className="flex-1">Return to sign in</ActionLink>
                    <ActionLink href={paths.root.path()} intent="secondary" className="flex-1"><ArrowLeft className="size-4" aria-hidden="true" /> Home</ActionLink>
                </div>
            </section>
        </main>
    );
}

export default Page;
