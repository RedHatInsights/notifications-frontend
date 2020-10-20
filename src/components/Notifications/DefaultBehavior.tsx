import * as React from 'react';
import { global_spacer_md, global_spacer_sm, global_spacer_lg, global_palette_black_300, c_skeleton_BackgroundColor } from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { NotificationType, DefaultNotificationBehavior } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { cssRaw, style } from 'typestyle';
import { ActionComponent } from './ActionComponent';
import { Button, ButtonVariant, Flex, FlexItem, Skeleton } from '@patternfly/react-core';

export interface DefaultBehaviorProps extends OuiaComponentProps {
    defaultBehavior?: DefaultNotificationBehavior;
    onEdit: () => void;
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
    paddingTop: global_spacer_lg.var,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: global_spacer_sm.var,
            paddingBottom: global_spacer_sm.var,
            paddingLeft: global_spacer_md.var,
            paddingRight: global_spacer_md.var
        }
    }
});

const titleClassName = style({
    fontWeight: 600
});

export const DefaultBehavior: React.FunctionComponent<DefaultBehaviorProps> = (props) => {
    return (
        <div { ...getOuiaProps('Notifications/DefaultBehavior', props) } className={ contentClassName } >
            <Flex
                justifyContent={ { default: 'justifyContentSpaceBetween' } }
            >
                <FlexItem><div className={ titleClassName }>Default behavior</div></FlexItem>
                <FlexItem><Button onClick={ props.onEdit } variant={ ButtonVariant.link }>Edit</Button></FlexItem>
            </Flex>
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
                                <td><Skeleton width="200px"/></td>
                                <td><Skeleton width="200px"/></td>
                            </tr>
                            <tr>
                                <td><Skeleton width="200px"/></td>
                                <td><Skeleton width="200px"/></td>
                            </tr>
                            <tr>
                                <td><Skeleton width="200px"/></td>
                                <td><Skeleton width="200px"/></td>
                            </tr>
                        </>
                    ) : props.defaultBehavior === undefined ? (
                        <span>Error while loading the default behavior. </span>
                    ) : (
                        props.defaultBehavior?.actions.map((a, index) => {
                            return (
                                <tr key={ index }>
                                    <td><ActionComponent isDefault={ false } action={ a }/></td>
                                    <td>{ a.type === NotificationType.INTEGRATION ? a.integration.name : a.recipient.join(', ') }</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

