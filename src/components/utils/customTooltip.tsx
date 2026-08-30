import { Paragraph } from "../ui/Paragraph";
import type { TooltipProps } from "recharts";

export const customTooltip = ({ active, payload, label }: TooltipProps<number | string, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-sub-component dark:bg-dark-sub-component p-4 rounded-2xl">
                {payload.map((item, index)  => (
                    <Paragraph className='text-sm' key={index}>
                        {label ?? item.name}: {item.value}
                    </Paragraph>
                ))}
            </div>
        );
    }
    return null;
};
