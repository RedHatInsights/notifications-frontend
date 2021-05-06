import {
    Button,
    ButtonVariant,
    ExpandableSection,
    Split,
    SplitItem,
    Stack,
    StackItem,
    TextInput
} from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupCardList } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupCardList';
import {
    makeCreateAction,
    makeEditAction,
    makeNoneAction,
    useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { useGetBehaviorGroups } from '../../../services/Notifications/GetBehaviorGroups';
import { BehaviorGroup, UUID } from '../../../types/Notification';
import { EditBehaviorGroupPage } from '../Form/EditBehaviorGroupPage';

const sectionClassName = style({
    backgroundColor: 'white',
    padding: global_spacer_lg.var
});

interface BehaviorGroupSectionProps {
    bundleId: UUID;
}

export const BehaviorGroupsSection: React.FunctionComponent<BehaviorGroupSectionProps> = props => {

    const [ isExpanded, setExpanded ] = React.useState(true);

    const behaviorGroups = useGetBehaviorGroups(props.bundleId);
    const [ modalState, dispatch ] = useFormModalReducer<BehaviorGroup>();

    const createGroup = React.useCallback(() => {
        dispatch(makeCreateAction<BehaviorGroup>({
            bundleId: props.bundleId
        }));
    }, [ dispatch, props.bundleId ]);

    const onCloseModal = React.useCallback((saved: boolean) => {
        const reload = behaviorGroups.query;
        if (saved) {
            reload();
        }

        dispatch(makeNoneAction());
    }, [ dispatch, behaviorGroups.query ]);

    const onEdit = React.useCallback((behaviorGroup: BehaviorGroup) => {
        dispatch(makeEditAction(behaviorGroup));
    }, [ dispatch ]);

    return (
        <ExpandableSection className={ sectionClassName } toggleText="Behavior Groups" isExpanded={ isExpanded } onToggle={ setExpanded }>
            <Stack hasGutter>
                <StackItem>
                    Configure default actions for notifications recipients. Keep in mind that users will be able
                    to change settings for all entitled events in User Preferences. You can prevent users from
                    changing assigned actions by locking action / recipient pairings when creating or editing
                    behavior groups.
                </StackItem>
                <StackItem>
                    <Split hasGutter>
                        <SplitItem>
                            <TextInput
                                value=""
                                type="text"
                                iconVariant='search'
                                aria-label="Search by name"
                                placeholder="Search by name"
                            />
                        </SplitItem>
                        <SplitItem>
                            <Button variant={ ButtonVariant.primary } onClick={ createGroup }>Create new group</Button>
                        </SplitItem>
                    </Split>
                </StackItem>
                { behaviorGroups.loading /* Replace with a skeleton */ ? (
                    <span>Loading...</span>
                ) : (
                    <StackItem>
                        { behaviorGroups.payload?.status === 200 && (
                            <BehaviorGroupCardList onEdit={ onEdit } behaviorGroups={ behaviorGroups.payload.value } />
                        )}
                    </StackItem>
                ) }
            </Stack>
            { modalState.isOpen && (
                <EditBehaviorGroupPage
                    behaviorGroup={ modalState.template }
                    onClose={ onCloseModal }
                />
            )}
        </ExpandableSection>
    );
};
