'use client'
import { ContactUs, Examples, Home, MoreDetails } from '@/features';
import React from 'react';

const Index = () => {
    return (
        <React.Fragment>
            <Home />
            <MoreDetails />
            <Examples />
            <ContactUs />
        </React.Fragment>
    );
}

export default Index;