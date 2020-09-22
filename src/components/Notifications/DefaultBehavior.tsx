import * as React from 'react';
import { OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { Action, ActionType } from '../../types/Notification';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { style } from 'typestyle';
import { ActionComponent } from './ActionComponent';

export interface DefaultBehaviorProps extends OuiaComponentProps {
    actions: Array<Action>;
}

const tableClassName = style({
    paddingTop: Spacer.LG,
    paddingBottom: Spacer.LG,
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
        <div { ...getOuiaProps('Notifications/DefaultBehavior', props) } >
            <div className={ titleClassName }>Default behavior</div>
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
