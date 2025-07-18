"use client";

import { BlurBackground, Button, Paragraph, ResponsiveIcon } from "@/components"
import { Search } from "lucide-react"
import React from "react";
import { useState } from "react";
import { SearchBarForm } from "..";

 export const SearchBarPage = () => {

    const [searchOpen, setSearchOpen] = useState(false);
    
        const handleFocus = () => {
            setSearchOpen(true);
        };
    
        const handleClose = () => {
            setSearchOpen(false);
        };
        
    return (
        <React.Fragment>
            {searchOpen && (
                <BlurBackground intent='sm' onClick={handleClose}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="z-10 sm:w-full max-w-md"
                    >
                        <SearchBarForm />
                    </div>
                </BlurBackground>
            )}
            <Button size="lg" rounded="full" onClick={handleFocus}>
                <ResponsiveIcon icon={Search} />
                <Paragraph>Start searching</Paragraph>
            </Button>
        </React.Fragment>
    )
}