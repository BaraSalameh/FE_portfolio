import React from "react"
import { Paragraph } from "./Paragraph";
import { cn } from "../utils";
import { ContentContainerProps } from "./types";
import { contentContainer, contentContainerLabel } from "@/styles";

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
    return (
        <div className={cn(contentContainer({ border, rounded, paddingX, paddingY, space }), className)}>
            {title &&
                <Paragraph className={cn(contentContainerLabel())}>
                    {title}
                </Paragraph>
            }
            {children}
        </div>
    )
}