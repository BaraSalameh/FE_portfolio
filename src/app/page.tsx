'use client'
import React from 'react';
import Home from "./pages/Home";
import MoreDetails from "./pages/MoreDetails";
import Examples from './pages/Examples';
import ContactUs from './pages/ContactUs';

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