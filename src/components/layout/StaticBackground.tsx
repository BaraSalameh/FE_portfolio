import React from "react";
import { Main } from "@/components";

export const StaticBackground = () => {
    return (
        <React.Fragment>
            <div className='px-7 sm:px-10 lg:px-15 pt-3 space-y-1 w-full'>
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[15%] h-4 rounded" />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[25%] h-3 rounded" />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[10%] h-2 rounded" />
                <hr className="mb-3"/>
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-full  h-2 rounded" />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[50%] h-2 rounded" />
                <br />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-full  h-2 rounded" />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[50%] h-2 rounded" />
                <br />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-full  h-2 rounded" />
                <div className="animate-pulse bg-light-primary dark:bg-dark-primary w-[50%] h-2 rounded" />
                <br />
            </div>
        <Main>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-3 w-full">
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
            </div>
        </Main>
        </React.Fragment>
    );
};

export const StaticBackgroundV2 = () => {
    return ( 
        <Main>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-3 w-full">
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
                <div className="break-inside-avoid animate-pulse bg-light-component dark:bg-dark-component w-full h-90 rounded" />
            </div>
        </Main>
    );
};