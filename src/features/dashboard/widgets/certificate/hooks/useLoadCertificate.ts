'use client';

import { useMemo } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { CertificateResponse } from "../types.certificate";

export const useLoadCertificate = (subCertificateFromStore?: CertificateResponse) => {
    const { lstCertificates } = useAppSelector(state => state.certificate.certificate);
    return useMemo(() => {
        const { certificate } = subCertificateFromStore ?? {};

        const certificateFromEdit = optionsCreator({list: certificate });
        const certificateFromStore = optionsCreator({list: lstCertificates});
        return mergeOptions(certificateFromEdit, certificateFromStore);
    }, [ subCertificateFromStore, lstCertificates ]);
}
