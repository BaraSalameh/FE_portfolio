import { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { Award, Clock, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { checkWidgetPreferences } from "@/lib/utils";
import {widget_preferences} from "@/lib/utils";
import { useHandleCertificateDelete } from "./useHandleCertificateDelete";
import { useDebouncedSortCertificate } from "./useDebouncedSortCertificate";
import { CertificateForm } from "../forms";

export const useCertificateWidget = (): WidgetCardProps => {
 
    const { loading: certificateLoading, error, lstCertificates } = useAppSelector(state => state.certificate);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const handleCertificateDelete = useHandleCertificateDelete();
    const debouncedSortCertificate = useDebouncedSortCertificate();

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_certificate_bar_chart)
    ?   { groupBy: 'certificate.name'}
    :   {};

    const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_certificate_pie_chart)
    ?   { groupBy: 'certificate.name'}
    :   {};

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_certificate_radar_chart)
    ?   { groupBy: 'certificate.name'}
    :   {};
    
    return {
        isLoading: certificateLoading,
        error,
        items: lstCertificates,
        header: { title: 'Certificates', icon: Award, description: 'Credentials and professional achievements' },
        emptyState: { title: 'No certificates added', description: 'Add a credential to showcase verified learning and achievements.' },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'certificate.name', size: 'lg' }
        ],
        details: [
            { leftKey: 'certificate.name', size: 'lg' },
            { leftKey: 'credintialID', icon: Link },
            { leftKey: 'credintialUrl', icon: SearchCodeIcon, isLink: true, label: 'View credential' },
            { leftKey: 'lstSkills.name', icon: WandSparklesIcon, itemIcon: 'lstSkills.iconUrl' },
            { leftKey: 'issueDate', between: '-', rightKey: 'expirationDate', icon: Clock, isTime: true }
        ],
        create: { title: 'Add', subTitle: 'Add certificate', form: <CertificateForm />},
        update: { subTitle: 'Update Certificate', form: <CertificateForm /> },
        del: { subTitle: 'Delete certificate', message: 'Are you sure?', onDelete: handleCertificateDelete },
        onSort: debouncedSortCertificate
    }
}
