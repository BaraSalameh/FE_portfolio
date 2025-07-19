'use client';

import React, { useState } from "react"
import { cn } from "../utils";
import { contentContainer, contentContainerLabel } from "@/styles";
import {  Expand, Minus, Plus } from "lucide-react";
import { ContentContainerProps } from "./types.layout";
import { Paragraph, ResponsiveIcon } from "@/components";

export const ContentContainer = ({
    border,
    rounded,
    paddingX,
    paddingY,
    space,
    className,
    title,
    children
}: ContentContainerProps) => {

    const [isOpen, setIsOprn ] = useState(false);

    return (
        <div className={cn(contentContainer({ border, rounded, paddingX, paddingY, space }), className)}>
            {title &&
                <Paragraph
                    onClick={() => setIsOprn(!isOpen)}
                    className={cn(contentContainerLabel())}
                >
                    <ResponsiveIcon icon={isOpen ? Minus : Plus}/>
                    {title}
                </Paragraph>
            }
            {isOpen
            ?   children
            :   <Paragraph onClick={() => setIsOprn(!isOpen)}>
                    <ResponsiveIcon icon={Expand}/>
                    Expand
                </Paragraph>
            }
        </div>
    )
}