'use client';

import { widgetCard } from '@/styles';
import { cn } from '@/components/utils';
import { Paragraph, List } from '../ui';
import { useState } from 'react';
import { WidgetList, WidgetCharts, WidgetModal } from '.';
import React from 'react';
import { ArrowUpDown, GripVertical } from 'lucide-react';
import { WidgetCardProps } from './types.widgets';
import { Loading, Main, Header, CUDModal, ResponsiveIcon } from '@/components';

export const WidgetCard = ({
    isLoading,
    header,
    items,
    list,
    pie,
    bar,
    radar,
    create,
    update,
    del,
    details,
    onModalAction,
    onSort,
    pagination,
    className
}: WidgetCardProps) => {

    var isInitialWidgetCard: boolean = false;

    if ((!Array.isArray(items) || items.length === 0 || (!header && !list && !pie && !bar)) && create) {
        isInitialWidgetCard = true;
    } else if (!Array.isArray(items) || items.length === 0 || (!header && !list && !pie && !bar)) return null;

    const [sortable, setSortable] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState(false);
    const [item, setItem] = useState<Record<string, any> | undefined>();
    
    const handleModal = (item: Record<string, any>) => {
        setOpenModal(true); 
        setItem(item);
    };
    const clickable = (update || del || details) ? handleModal : undefined;

    return (
        isInitialWidgetCard
        ?  
        <React.Fragment>
            <section className={cn(widgetCard(), className)}>
                <Loading isLoading={isLoading} fullScreen={false} />
                <Header itemsX="between" paddingX="xs" paddingY="xs">
                    <Paragraph size="lg" space="xs">
                        {header?.icon && <ResponsiveIcon icon={header.icon} />}
                        {header?.title}
                    </Paragraph>
                    <CUDModal
                        isLoading={isLoading}
                        title={create?.title}
                        subTitle={create?.subTitle}
                        icon={create?.icon}
                    >
                        {create?.form}
                    </CUDModal>
                </Header>
            </section>
        </React.Fragment>
        :
        <React.Fragment>
            <section className={cn(widgetCard(), className)}>
                <Loading isLoading={isLoading} fullScreen={false} />
                {header && (header.icon || header.title) && (
                    <Header itemsX="between" paddingX="xs" paddingY="xs">
                        <Paragraph size="lg" space="xs">
                            {header.icon && <ResponsiveIcon icon={header.icon} />}
                            {header.title}
                        </Paragraph>
                        {(create || onSort) &&
                            <div className='flex gap-3'>
                                {onSort &&
                                    <Paragraph onClick={() => setSortable(!sortable)}>
                                        <ResponsiveIcon icon={sortable ? ArrowUpDown : GripVertical} />
                                    </Paragraph>
                                        
                                }
                                {create && (
                                    <CUDModal
                                        isLoading={isLoading}
                                        title={create.title}
                                        subTitle={create.subTitle}
                                        icon={create?.icon}
                                    >
                                        {create.form}
                                    </CUDModal>
                                )}
                            </div>
                        }
                    </Header>
                )}

                {(pie || bar || radar) && (
                    <Main paddingX="none" paddingY="md">
                        <WidgetCharts items={items} pie={pie} bar={bar} radar={radar} />
                    </Main>
                )}

                {list && (
                    <Main paddingX="none" paddingY="none">
                        <List size="md" as="none" className="w-full">
                            <WidgetList
                                items={items}
                                list={list}
                                onItemClick={clickable}
                                sort={{sortable, onSort}}
                                pagination={pagination}
                            />
                        </List>
                    </Main>
                )}
            </section>

            <WidgetModal
                key={item?.id || item}
                isLoading={isLoading}
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                item={item}
                update={update}
                del={del}
                details={details}
                onAction={onModalAction}
                className={className}
            />
        </React.Fragment>
    )
};