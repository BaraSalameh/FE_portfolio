'use client';

import { Edit, LucideTrash2, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../forms';
import { cn } from '../utils';
import { widgetCard } from '@/styles/widget';
import { CUDProps } from './types.modals';
import { BlurBackground, Header, Main, Paragraph, ResponsiveIcon } from '@/components';

export const CUDModal = ({
    isLoading,
    idToDelete,
    onAction,
    onClose,
    as = 'create',
    title,
    subTitle = title,
    children,
    icon,
    className
}: CUDProps) => {

    const [openModal, setOpenModal] = useState(false);
    const currentIcon =
        icon ? (
            <ResponsiveIcon icon={icon} />
        ) : as === 'create' ? (
            <ResponsiveIcon />
        ) : as === 'update' ? (
            <ResponsiveIcon icon={Edit} />
        ) : (
            <ResponsiveIcon icon={LucideTrash2} />
        );
    
    return (
        <>
        <Paragraph onClick={() => setOpenModal(true)}>
            {currentIcon}
            {title ? title : null}
        </Paragraph>
  
        {openModal && (
            <BlurBackground intent='sm'>
                <div className={ cn(widgetCard({ scroll: true }), className) }>
                    <Header itemsX="between" paddingX="xs" paddingY="xs">
                        {subTitle && <Paragraph size="md">{subTitle}</Paragraph>}
                        <ResponsiveIcon icon={X} onClick={() => setOpenModal(false)} />
                    </Header>
                    <hr />
                    <Main paddingX='sm' paddingY='sm' space='sm'>
                        {as !== 'delete'
                            ?   React.isValidElement(children)
                                    ?   React.cloneElement(children as React.ReactElement<{ onClose: () => void }>, {
                                            onClose: (children as any).props.onClose ?? (() => setOpenModal(false))
                                        })
                                    :   children
                            :   <>
                                <Paragraph size="md">{children}</Paragraph>
                                <Button
                                    onClick={async () => {
                                        if (onAction && idToDelete) {
                                            await onAction(idToDelete);
                                            onClose ? onClose() : setOpenModal(false);
                                            
                                        }
                                    }}
                                    rounded="full"
                                    size="lg"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    <ResponsiveIcon icon={Trash2} />
                                    <Paragraph>{isLoading ? 'Deleting...' : 'Delete'}</Paragraph>
                                </Button>
                                </>
                            }
                    </Main>
                </div>
            </BlurBackground>
        )}
        </>
    );
};
