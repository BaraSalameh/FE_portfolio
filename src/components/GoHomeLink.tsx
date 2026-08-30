import { Home } from "lucide-react";
import { Button } from "./forms";
import { ResponsiveIcon } from "./ui";
import { paths } from "@/lib/pathHelper";

export const GoHomeLink = () =>
    <Button url={paths.root.path()} >
        <ResponsiveIcon icon={Home} />
        Home
    </Button>