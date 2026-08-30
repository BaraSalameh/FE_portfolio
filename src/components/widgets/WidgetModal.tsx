"use client";

import { X } from 'lucide-react';
import { cn } from '@/components/utils';
import { widgetCard } from '@/styles';
import React, { useEffect } from 'react';
import { Header, Main, CUDModal, BlurBackground, ResponsiveIcon, List } from '@/components';
import { WidgetList } from './WidgetList';
import { WidgetModalProps } from './types.widgets';

export const WidgetModal = ({ isLoading, isOpen, onClose, onAction, item, update, del, details, className }: WidgetModalProps) => {
    const itemId = item && 'id' in item ? String(item.id) : undefined;

    useEffect(() => {
        if (isOpen && itemId) onAction?.(itemId);
    }, [isOpen, itemId, onAction]);

    if (!isOpen) return null;
    
    return (
        <BlurBackground intent='sm' className='p-5'>
            <div className={cn(widgetCard({}), className)}>
                <Header itemsX='between' paddingX="xs" paddingY="xs">
                    <div className='flex gap-3'>
                        {update && (
                            <CUDModal isLoading={isLoading} as='update' title={update.title} subTitle={update.subTitle}>
                                {React.isValidElement(update.form)
                                    ?   React.cloneElement(update.form as React.ReactElement<{ onClose: () => void; id: string }>, {
                                            onClose,
                                            id: itemId,
                                        })
                                    :   update.form
                                }
                            </CUDModal>
                        )}
                        {del && (
                            <CUDModal isLoading={isLoading} as='delete' title={del.title} subTitle={del.subTitle} onAction={del.onDelete} onClose={onClose} idToDelete={itemId}>
                                {del.message}
                            </CUDModal>
                        )}
                    </div>
                    <ResponsiveIcon icon={X} onClick={onClose} className='cursor-pointer' />
                </Header>
                {details &&
                    <Main paddingX="none" paddingY="none">
                        <List as="none" className="w-full">
                            <WidgetList items={[item ?? {}]} list={details}  />
                        </List>
                    </Main>
                }
            </div>
        </BlurBackground>
    );
};
