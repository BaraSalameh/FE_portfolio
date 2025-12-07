import { ResendPage } from "@/features";
import { Suspense } from "react";

const ResendPageWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResendPage />
        </Suspense>
    );
}

export default ResendPageWrapper;