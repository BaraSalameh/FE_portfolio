import { WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";
import {  MessageCircleHeart, User, SubtitlesIcon, Mail } from "lucide-react";
import { useMessageDelete } from "./useMessageDelete";
import { useSignMessage } from "./useSignMessage";
import { contactMessageListQuery } from "../api";

export const useContactMessageWidget = (): WidgetCardProps => {

    const { loading, lstMessages, rowCount } = useAppSelector(state => state.contactMessage);

    const handleMessageDelete = useMessageDelete();
    const handleSignMessage = useSignMessage();

    return {
        isLoading: loading,
        items: lstMessages,
        list: [
            { leftKey: 'name', size: 'lg', icon: User },
            { leftKey: 'email', icon: Mail },
            { leftKey: 'subject', icon: SubtitlesIcon },
        ],
        details: [
            { leftKey: 'name', size: 'lg', icon: User },
            { leftKey: 'email', icon: Mail },
            { leftKey: 'subject', icon: SubtitlesIcon },
            { leftKey: 'message', icon: MessageCircleHeart },
        ],
        del: { subTitle: 'Delete Message', message: 'Are you sure?', onDelete: handleMessageDelete },
        pagination: {
            maxLength: rowCount,
            fetchAction: contactMessageListQuery,
            styles: {
                size: 'xl',
                space: 'md'
            }
        },
        onModalAction: handleSignMessage
    }
}