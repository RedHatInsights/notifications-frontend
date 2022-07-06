import { act, renderHook } from '@testing-library/react-hooks';
import fetchMock from 'fetch-mock';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../../test/AppWrapper';
import { IntegrationType } from '../../../../types/Integration';
import { NotificationType } from '../../../../types/Notification';
import { NotificationUserRecipient } from '../../../../types/Recipient';
import { SaveBehaviorGroupOperation, useSaveBehaviorGroup } from '../useSaveBehaviorGroup';

const RESPONSE_SUCCESS_UPDATED_BG = {
    headers: {
        'Content-Type': 'application/json'
    },
    status: 200,
    body: true
} as Readonly<any>;

describe('src/pages/Notifications/Form/useSaveBehaviorGroup', () => {

    beforeEach(appWrapperSetup);
    afterEach(appWrapperCleanup);

    it('Not saving initially', () => {
        const { result } = renderHook(() => useSaveBehaviorGroup());
        expect(result.current.isSaving).toBe(false);
    });

    it('Starts saving', async () => {
        const { result } = renderHook(() => useSaveBehaviorGroup({
            actions: [],
            bundleId: 'my-bundle-id',
            id: 'bg-id',
            bundleName: 'bundle Name',
            displayName: 'My bg name old'
        }), {
            wrapper: getConfiguredAppWrapper()
        });

        let resolver;
        fetchMock.put('/api/notifications/v1.0/notifications/behaviorGroups/bg-id', () => {
            return new Promise(resolve => {
                resolver = resolve;
            });
        });

        await act(async () => {
            result.current.save({
                actions: [],
                events: [],
                bundleId: 'my-bundle-id',
                id: 'bg-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(result.current.isSaving).toBe(true);
        await act(async () => {
            resolver(RESPONSE_SUCCESS_UPDATED_BG);
        });
    });

    it('does not query if there are no changes', async () => {
        const bg = {
            actions: [],
            displayName: 'My bg name',
            id: 'bg-id'
        };

        const { result } = renderHook(() => useSaveBehaviorGroup(bg), {
            wrapper: getConfiguredAppWrapper()
        });

        let saveResponse: ReturnType<typeof result.current.save> | undefined = undefined;

        await act(async () => {
            saveResponse = result.current.save({
                actions: [],
                events: [],
                bundleId: 'my-bundle-id',
                id: 'bg-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(result.current.isSaving).toBe(false);
        expect(await saveResponse).toEqual({
            status: true,
            operation: SaveBehaviorGroupOperation.UPDATE
        });
    });

    it('does query to update displayName', async () => {
        const bg = {
            actions: [],
            events: [],
            displayName: 'My bg name old',
            id: 'bg-id'
        };

        const { result } = renderHook(() => useSaveBehaviorGroup(bg), {
            wrapper: getConfiguredAppWrapper()
        });
        const shouldBeCalled = jest.fn(() => RESPONSE_SUCCESS_UPDATED_BG);
        fetchMock.put('/api/notifications/v1.0/notifications/behaviorGroups/bg-id', shouldBeCalled);

        await act(async () => {
            result.current.save({
                actions: [],
                events: [],
                bundleId: 'my-bundle-id',
                id: 'bg-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(shouldBeCalled).toHaveBeenCalled();
    });

    it('creates actions in order - 1', async () => {
        const { result } = renderHook(() => useSaveBehaviorGroup(), {
            wrapper: getConfiguredAppWrapper()
        });

        const shouldBeCalled = jest.fn((_url, options) => {
            expect(options.body.eventTypeIds).toEqual([
                'i1', 'i2', 'i3'
            ]);
        });

        fetchMock.post('/api/notifications/v1.0/notifications/behaviorGroups', shouldBeCalled);

        await act(async () => {
            await result.current.save({
                actions: [
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i1',
                            type: IntegrationType.WEBHOOK,
                            name: 'i1',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i2',
                            type: IntegrationType.WEBHOOK,
                            name: 'i2',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i3',
                            type: IntegrationType.WEBHOOK,
                            name: 'i3',
                            isEnabled: true
                        }
                    }
                ],
                events: [],
                bundleId: 'my-bundle-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(shouldBeCalled).toHaveBeenCalled();
    });

    it('creates actions in order - 2', async () => {
        const { result } = renderHook(() => useSaveBehaviorGroup(), {
            wrapper: getConfiguredAppWrapper()
        });

        const shouldBeCalled = jest.fn((_url, options) => {
            expect(options.body.eventTypeIds).toEqual([
                'i1', 'i2', 'e1', 'e2', 'i3'
            ]);
        });

        fetchMock.post('/api/notifications/v1.0/notifications/behaviorGroups', shouldBeCalled);

        await act(async () => {
            await result.current.save({
                actions: [
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i1',
                            type: IntegrationType.WEBHOOK,
                            name: 'i1',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i2',
                            type: IntegrationType.WEBHOOK,
                            name: 'i2',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.EMAIL_SUBSCRIPTION,
                        recipient: [ new NotificationUserRecipient('e1', true), new NotificationUserRecipient('e2', false) ]
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i3',
                            type: IntegrationType.WEBHOOK,
                            name: 'i3',
                            isEnabled: true
                        }
                    }
                ],
                events: [],
                bundleId: 'my-bundle-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(shouldBeCalled).toHaveBeenCalled();
    });

    it('creates actions in order - 3', async () => {
        const { result } = renderHook(() => useSaveBehaviorGroup(), {
            wrapper: getConfiguredAppWrapper()
        });

        const shouldBeCalled = jest.fn((_url, options) => {
            expect(options.body.eventTypeIds).toEqual([
                'i1', 'i2', 'e-new', 'e2', 'i3'
            ]);
        });

        fetchMock.post('/api/notifications/v1.0/notifications/behaviorGroups', shouldBeCalled);

        fetchMock.post('/api/integrations/v1.0/endpoints/system/email_subscription', {
            description: 'email',
            name: 'email',
            id: 'e-new',
            type: 'email_subscription'
        });

        await act(async () => {
            await result.current.save({
                actions: [
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i1',
                            type: IntegrationType.WEBHOOK,
                            name: 'i1',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i2',
                            type: IntegrationType.WEBHOOK,
                            name: 'i2',
                            isEnabled: true
                        }
                    },
                    {
                        type: NotificationType.EMAIL_SUBSCRIPTION,
                        recipient: [ new NotificationUserRecipient(undefined, true), new NotificationUserRecipient('e2', false) ]
                    },
                    {
                        type: NotificationType.INTEGRATION,
                        integration: {
                            id: 'i3',
                            type: IntegrationType.WEBHOOK,
                            name: 'i3',
                            isEnabled: true
                        }
                    }
                ],
                events: [],
                bundleId: 'my-bundle-id',
                bundleName: 'bundle Name',
                displayName: 'My bg name'
            });
        });

        expect(shouldBeCalled).toHaveBeenCalled();
    });

});
