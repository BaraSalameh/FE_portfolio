import { Home } from "lucide-react";
import { Button } from "./forms";
import { ResponsiveIcon } from "./ui";

export const GoHomeLink = () =>
    <Button url='/' >
        <ResponsiveIcon icon={Home} />
        Home
    </Button>