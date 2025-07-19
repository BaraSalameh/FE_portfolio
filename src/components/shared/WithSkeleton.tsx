import React from 'react';
import { WithSkeletonProps } from './types.shared';
import { Loading } from './Loading';

export const WithSkeleton = ({ isLoading, skeleton, children }: WithSkeletonProps) =>
    isLoading
    ?   <React.Fragment>
            <Loading isLoading={isLoading} />
            {skeleton}
        </React.Fragment>
    :   <React.Fragment>{children}</React.Fragment>
