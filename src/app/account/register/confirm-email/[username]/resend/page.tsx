import { Suspense } from "react";
import ResendPage from "./ResendPage";

const ResendPageWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResendPage />
        </Suspense>
    );
}

export default ResendPageWrapper;