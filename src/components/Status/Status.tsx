import { global_spacer_sm } from '@patternfly/react-tokens';
import React from 'react';
import { style } from 'typestyle';

const smallMarginLeft = style({
    marginLeft: global_spacer_sm.var
});

interface StatusProps {
    text: string;
}

export const Status: React.FunctionComponent<StatusProps> = (props) => (
    <span>
        { props.children }
        <span className={ smallMarginLeft }>{ props.text }</span>
    </span>
);
