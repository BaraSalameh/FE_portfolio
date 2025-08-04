import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Award, Clock, GraduationCap, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { checkWidgetPreferences } from "@/lib/utils";
import {widget_preferences} from "@/lib/utils";
import { useHandleCertificateDelete } from "./useHandleCertificateDelete";
import { useDebouncedSortCertificate } from "./useDebouncedSortCertificate";
import { CertificateForm } from "../forms";

export const useCertificateWidget = (): WidgetCardProps => {
 
    const { loading: certificateLoading, lstCertificates } = useAppSelector(state => state.certificate);
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
        items: lstCertificates,
        header: { title: 'Certificate', icon: Award },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'certificate.name', size: 'lg' }
        ],
        details: [
            { leftKey: 'certificate.name', size: 'lg' },
            { leftKey: 'credintialID', icon: Link },
            { leftKey: 'credintialUrl', icon: SearchCodeIcon , isLink: true},
            { leftKey: 'lstSkills.name', icon: WandSparklesIcon, itemIcon: 'lstSkills.iconUrl' },
            { leftKey: 'issueDate', between: '-', rightKey: 'expirationDate', icon: Clock, isTime: true }
        ],
        create: { subTitle: 'Add Certificate', form: <CertificateForm />},
        update: { subTitle: 'Update Certificate', form: <CertificateForm /> },
        del: { subTitle: 'Delete certificate', message: 'Are you sure?', onDelete: handleCertificateDelete },
        onSort: debouncedSortCertificate
    }
}