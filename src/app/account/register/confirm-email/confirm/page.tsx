import { Suspense } from "react";
import ConfirmedPage from "./ConfirmedPage";

const ConfirmPageWrapper = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmedPage />
        </Suspense>
    );
}

export default ConfirmPageWrapper;