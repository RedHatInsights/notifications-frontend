import * as Yup from 'yup';

import { NotificationType } from '../../types/Notification';

const ActionIntegration = Yup.object({
    type: Yup.mixed().oneOf([ NotificationType.INTEGRATION ]).required(),
    integration: Yup.object({
        id: Yup.string().required()
    }).required(),
    integrationId: Yup.string().min(1)
});

const ActionNotify = Yup.object({
    type: Yup.mixed().oneOf([ NotificationType.EMAIL_SUBSCRIPTION /*, NotificationType.DRAWER */ ]).required(),
    recipient: Yup.array(Yup.string()).min(0),
    integrationId: Yup.string().min(0)
});

type ActionsType = Yup.TypeOf<typeof ActionIntegration> | Yup.TypeOf<typeof ActionNotify>;

export const ActionsArray = Yup.array(Yup.lazy(obj => {
    if ((obj as any).hasOwnProperty('type')) {
        if ((obj as any).type === NotificationType.INTEGRATION) {
            return ActionIntegration;
        }
    }

    return ActionNotify;
})).test('no-repeated', '${path} can\'t contain repeated actions', (value: Array<ActionsType>  | undefined, context) => {
    const errors: Array<ReturnType<Yup.TestContext['createError']>> = [];

    let foundEmail = false;
    const integrationIds: Array<string> = [];

    if (!value) {
        return true;
    }

    for (let i = 0; i < value.length; ++i) {
        const action = value[i];
        const integrationId = action.integrationId;
        if (action.type === NotificationType.EMAIL_SUBSCRIPTION) {
            if (foundEmail) {
                errors.push(context.createError({
                    message: 'Only 1 send email action is allowed',
                    path: `actions.${i}`
                }));
            }

            foundEmail = true;
        } else if (integrationId) {
            if (integrationIds.includes(integrationId)) {
                errors.push(context.createError({
                    message: 'Integration already used in the group, please select other',
                    path: `actions.${i}`
                }));
            } else {
                integrationIds.push(integrationId);
            }
        }
    }

    if (errors.length === 0) {
        return true;
    }

    return {
        ...context.createError(),
        inner: errors
    };
});

export const WithActions = Yup.object({
    actions: ActionsArray
});

export const BehaviorGroupSchema = Yup.object({
    displayName: Yup.string().required('You must specify a name for the behavior group'),
    actions: ActionsArray
});
