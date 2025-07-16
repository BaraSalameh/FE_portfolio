import React, { useState } from "react"
import { Paragraph } from "./Paragraph";
import { cn } from "../utils";
import { ContentContainerProps } from "./types";
import { contentContainer, contentContainerLabel } from "@/styles";
import { ResponsiveIcon } from "./ResponsiveIcon";
import {  Expand, Minus, Plus } from "lucide-react";

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