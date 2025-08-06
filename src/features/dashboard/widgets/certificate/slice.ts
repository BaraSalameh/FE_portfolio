import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { CertificateState } from './types.certificate';
import { addEditCertificate, certificateListQuery, deleteCertificate, lkp_CertificateListQuery } from './apis';
import { userSkillListQuery } from '../skill';

const initialState : CertificateState = {
    lstCertificates: [],
    certificate: {
        lstCertificates: [],
        certificatesRowCount: 0,
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const certificateSlice = createSlice({
    name: 'certificate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstCertificates = action.payload.lstCertificates;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstCertificates = action.payload.lstCertificates;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            state.lstCertificates = state.lstCertificates.map(cert => {
                const matchingSkills = action.payload
                    .filter(us => us.certificate?.id === cert.id)
                    .map(us => us.skill);

                return {
                    ...cert,
                    lstSkills: matchingSkills,
                };
            });
        })

        .addCase(certificateListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(certificateListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstCertificates = action.payload;
        })
        .addCase(certificateListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        
        .addCase(lkp_CertificateListQuery.pending, (state) => {
            state.certificate.loading = true;
            state.certificate.error = null;
        })
        .addCase(lkp_CertificateListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.certificate.lstCertificates = items;
            } else {
                state.certificate.lstCertificates =  [...state.certificate.lstCertificates, ...items];
            }
            state.certificate.loading = false;
            state.certificate.certificatesRowCount = rowCount;
        })
        .addCase(lkp_CertificateListQuery.rejected, (state, action) => {
            state.certificate.loading = false;
            state.certificate.error = action.payload as string;
        })
        
        .addCase(addEditCertificate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditCertificate.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addEditCertificate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteCertificate.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteCertificate.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteCertificate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default certificateSlice.reducer;
