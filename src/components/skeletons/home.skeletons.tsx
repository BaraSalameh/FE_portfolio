import { button } from "@/styles";
import { cn } from "../utils";

export const ButtonSkeleton = () => {
    return (
        <div className={cn(button(), 'w-fit animate-pulse')}>
            <div className="rounded-full bg-gray-300 w-6 h-6" />
            <div className="h-4 bg-light-primary dark:bg-dark-primary rounded w-32 mb-1" />
        </div>
    );
}