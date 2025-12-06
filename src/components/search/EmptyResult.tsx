import { LucideUserX2 } from "lucide-react";
import { Paragraph, ResponsiveIcon } from "../ui";

export const EmptyResult = () =>
    <div className="w-full md:min-w-fit md:max-w-2/3 rounded-lg bg-light-component dark:bg-dark-component p-6">
        <Paragraph position='center'>
            <ResponsiveIcon icon={LucideUserX2} />
            No Users Found!
        </Paragraph>
    </div>