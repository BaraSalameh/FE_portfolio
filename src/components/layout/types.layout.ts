import { 
    ContainerVariantProps,
    SubFooterVariantProps,
    MainVariantProps,
    HeaderVariantProps,
    ContentContainerVariantProps
} from "@/styles";
import { FCProps } from "../types.components";

export interface ContainerProps extends ContainerVariantProps, FCProps {}

export interface HeaderProps extends HeaderVariantProps, FCProps {}

export interface MainProps extends MainVariantProps, FCProps {}

export interface SubFooterProps extends SubFooterVariantProps, FCProps {}

export interface ContentContainerProps extends ContentContainerVariantProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}