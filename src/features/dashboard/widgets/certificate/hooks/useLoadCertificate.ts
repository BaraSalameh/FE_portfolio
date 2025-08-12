import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";
import { CertificateResponse } from "../types.certificate";

export const useLoadCertificate = (subCertificateFromStore?: CertificateResponse) => {
    const { lstCertificates } = useAppSelector(state => state.certificate.certificate);
    const [ certificateOptions, setCertificateOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const { certificate } = subCertificateFromStore ?? {};

        const certificateFromEdit = optionsCreator({list: certificate });
        const certificateFromStore = optionsCreator({list: lstCertificates});
        setCertificateOptions(mergeOptions(certificateFromEdit, certificateFromStore));
    }, [ subCertificateFromStore, lstCertificates ]);

    return certificateOptions;
}