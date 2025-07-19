import { BlurBackgroundVariantProps } from "@/styles";
import { FCProps } from "../types.components";

export interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
    isLoading?: boolean;
    className?: string;
}

export interface WithSkeletonProps {
    isLoading: boolean;
    skeleton: React.ReactNode;
    children: React.ReactNode;
}

export interface BlurBackgroundProps extends BlurBackgroundVariantProps, FCProps {
    onClick?: () => void;
}