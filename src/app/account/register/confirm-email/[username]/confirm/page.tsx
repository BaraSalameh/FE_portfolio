import { ConfirmedPage } from "@/features";
import { Suspense } from "react";

const ConfirmPageWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmedPage />
        </Suspense>
    );
}

export default ConfirmPageWrapper;