import { Paragraph } from "../ui/Paragraph";

export const customTooltip = ({ active, payload, label } : any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-light-sub-component dark:bg-dark-sub-component p-4 rounded-2xl">
                {payload.map((item: any, index: any)  => (
                    <Paragraph size='sm' key={index}>
                        {label ?? item.name}: {item.value}
                    </Paragraph>
                ))}
            </div>
        );
    }
    return null;
};