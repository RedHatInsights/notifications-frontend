import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { getOuiaProps } from '../utils/getOuiaProps';

export const ouia = <P extends any>(Component: React.FunctionComponent<P>, type: string): React.FunctionComponent<OuiaComponentProps & P> => {

    const Wrapped: React.FunctionComponent<OuiaComponentProps & P> = props => {
        return (
            <div { ...getOuiaProps(type, props) }>
                <Component { ...props } />
            </div>
        );
    };

    Wrapped.displayName = `Ouia(${Component.displayName ?? Component.name})`;

    return Wrapped;
};
