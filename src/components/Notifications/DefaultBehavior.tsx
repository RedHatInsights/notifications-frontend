import { Button, ButtonVariant, Skeleton } from '@patternfly/react-core';
import {
    c_skeleton_BackgroundColor, global_FontSize_sm, global_palette_black_300, global_spacer_md, global_spacer_xs
} from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { cssRaw, style } from 'typestyle';

import { DefaultNotificationBehavior } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { ActionComponent } from './ActionComponent';
import { Recipient } from './Recipient';

export interface DefaultBehaviorProps extends OuiaComponentProps {
    defaultBehavior?: DefaultNotificationBehavior;
    onEdit?: () => void;
    loading: boolean;
}

cssRaw(`
    table.withDark300Skeleton .pf-c-skeleton {
        ${c_skeleton_BackgroundColor.name}: ${global_palette_black_300.var} 
    }
`);

const contentClassName = style({
    backgroundColor: '#f0f0f0',
    paddingTop: global_spacer_md.var,
    paddingBottom: global_spacer_md.var,
    paddingLeft: global_spacer_md.var,
    paddingRight: global_spacer_md.var
});

const tableClassName = style({
    paddingTop: global_spacer_md.var,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: global_spacer_xs.var,
            paddingBottom: global_spacer_xs.var,
            paddingLeft: global_spacer_md.var,
            paddingRight: global_spacer_md.var,
            fontSize: global_FontSize_sm.var
        },
        '& td:first-child, & th:first-child': {
            paddingLeft: 0
        },
        '& thead:first-child th': {
            paddingTop: 0
        }
    }
});

const titleClassName = style({
    fontWeight: 600
});

export const DefaultBehavior: React.FunctionComponent<DefaultBehaviorProps> = (props) => {
    return (
        <div { ...getOuiaProps('Notifications/DefaultBehavior', props) } className={ contentClassName } >
            <div className={ titleClassName }>
                Default behavior <Button onClick={ props.onEdit } isDisabled={ !props.onEdit } variant={ ButtonVariant.link }>Edit defaults</Button>
            </div>
            <div>Default behavior applies to all notifications in a bundle. You can override this default for any specific event type.</div>
            <table className={ `${tableClassName} withDark300Skeleton` }>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Recipient</th>
                    </tr>
                </thead>
                <tbody>
                    { props.loading ? (
                        <>
                            <tr>
                                <td><Skeleton width="200px" /></td>
                                <td><Skeleton width="200px" /></td>
                            </tr>
                            <tr>
                                <td><Skeleton width="200px" /></td>
                                <td><Skeleton width="200px" /></td>
                            </tr>
                            <tr>
                                <td><Skeleton width="200px" /></td>
                                <td><Skeleton width="200px" /></td>
                            </tr>
                        </>
                    ) : props.defaultBehavior === undefined ? (
                        <tr><td>Error while loading the default behavior. </td></tr>
                    ) : (
                        props.defaultBehavior?.actions.map((a, index) => {
                            return (
                                <tr key={ index }>
                                    <td><ActionComponent isDefault={ false } action={ a } /></td>
                                    <td> <Recipient action={ a } hasOutline /></td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
