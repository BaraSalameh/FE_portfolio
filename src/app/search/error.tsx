'use client';
 
import { Button, Container, Main, Paragraph, ResponsiveIcon } from '@/components';
import { GoHomeLink } from '@/components/GoHomeLink';
import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
 
const Error = ({ error, reset }: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Container className='h-screen'>
            <Main className='h-full'>
                <Paragraph className="text-2xl">
                    Something went wrong!
                </Paragraph>
                <div className="flex gap-2">
                    <GoHomeLink />
                    <Button onClick={reset}>
                        <ResponsiveIcon icon={RefreshCcw}/>
                        Try again
                    </Button>
                </div>
            </Main>
        </Container>
    );
}

export default Error;