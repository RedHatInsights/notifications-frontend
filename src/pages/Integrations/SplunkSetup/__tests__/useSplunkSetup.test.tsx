import { act, renderHook } from '@testing-library/react-hooks';

import { useGetBundleByName } from '../../../../services/Notifications/GetBundles';
import { useSaveBehaviorGroupMutation } from '../../../../services/Notifications/SaveBehaviorGroup';
import { useCreateSplunkBehaviorGroup } from '../useSplunkSetup';

jest.mock('../../../../services/Notifications/SaveBehaviorGroup', () => {
    const actual = jest.requireActual('../../../../services/Notifications/SaveBehaviorGroup');

    return {
        ...actual,
        useSaveBehaviorGroupMutation: jest.fn()
    };
});

jest.mock('../../../../services/Notifications/GetBundles', () => ({
    useGetBundleByName: jest.fn()
}));

describe('src/pages/Integrations/SplunkSetup/useSplunkSetup', () => {
    describe('useCreateSplunkBehaviorGroup', () => {
        it('should retry if the name already exists', async () => {
            const existingBehaviorGroups = [
                'foo',
                'SPLUNK_AUTOMATION_GROUP',
                'SPLUNK_AUTOMATION_GROUP (1)',
                'SPLUNK_AUTOMATION_GROUP (2)',
                'SPLUNK_AUTOMATION_GROUP (3)',
                'SPLUNK_AUTOMATION_GROUP (5)'
            ];

            (useGetBundleByName as jest.Mock).mockImplementation(() => () => ({
                id: '1'
            }));

            (useSaveBehaviorGroupMutation as jest.Mock).mockImplementation(() => ({
                mutate: (behaviorGroup) => {
                    if (existingBehaviorGroups.includes(behaviorGroup.displayName)) {
                        return {
                            error: true,
                            payload: {
                                value: 'already exists'
                            }
                        };
                    }

                    return {
                        error: false,
                        payload: {
                            value: behaviorGroup
                        }
                    };
                }
            }));
            const { result } = renderHook(() => useCreateSplunkBehaviorGroup());
            let value;

            await act(async () => {
                value = await result.current({
                    behaviorGroupName: 'SPLUNK_AUTOMATION_GROUP',
                    bundleName: 'bundle'
                });
            });
            expect(value.displayName).toBe('SPLUNK_AUTOMATION_GROUP (4)');
            existingBehaviorGroups.push(value.displayName);

            await act(async () => {
                value = await result.current({
                    behaviorGroupName: 'SPLUNK_AUTOMATION_GROUP',
                    bundleName: 'bundle'
                });
            });
            expect(value.displayName).toBe('SPLUNK_AUTOMATION_GROUP (6)');
        });
    });
});
