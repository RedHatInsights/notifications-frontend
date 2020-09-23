import * as React from 'react';
import { OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { Action, ActionType } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { style } from 'typestyle';
import { ActionComponent } from './ActionComponent';
import { Button, ButtonVariant, Flex, FlexItem } from '@patternfly/react-core';

export interface DefaultBehaviorProps extends OuiaComponentProps {
    actions: Array<Action>;
    onEdit: () => void;
}

const contentClassName = style({
    backgroundColor: '#f0f0f0',
    paddingTop: Spacer.MD,
    paddingBottom: Spacer.MD,
    paddingLeft: Spacer.MD,
    paddingRight: Spacer.MD
});

const tableClassName = style({
    paddingTop: Spacer.LG,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: Spacer.SM,
            paddingBottom: Spacer.SM,
            paddingLeft: Spacer.MD,
            paddingRight: Spacer.MD
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
            <table className={ tableClassName }>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Recipient</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.actions.map((a, index) => {
                            return (
                                <tr key={ index }>
                                    <td><ActionComponent action={ a }/></td>
                                    <td>{ a.type === ActionType.INTEGRATION ? 'N/A' : a.recipient.join(', ') }</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};
