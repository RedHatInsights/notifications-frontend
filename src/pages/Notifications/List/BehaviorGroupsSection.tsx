import {
    Badge,
    Button,
    ButtonVariant,
    ExpandableSection,
    ExpandableSectionToggle,
    SearchInput, Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { global_BackgroundColor_100, global_palette_black_1000, global_spacer_lg } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import {
    BehaviorGroupCardList,
    BehaviorGroupCardListSkeleton
} from '../../../components/Notifications/BehaviorGroup/BehaviorGroupCardList';
import { useDeleteModalReducer } from '../../../hooks/useDeleteModalReducer';
import {
    useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { BehaviorGroup, UUID } from '../../../types/Notification';
import { emptyImmutableArray } from '../../../utils/Immutable';
import { DeleteBehaviorGroupPage } from '../Form/DeleteBehaviorGroupPage';
import { EditBehaviorGroupPage } from '../Form/EditBehaviorGroupPage';
import { BehaviorGroupContent } from './useBehaviorGroupContent';

const expandableSectionClassName = {
    backgroundColor: global_BackgroundColor_100.var,
    paddingLeft: global_spacer_lg.var,
    paddingRight: global_spacer_lg.var
};

const sectionClassName = style(
    expandableSectionClassName,
    {
        paddingBottom: global_spacer_lg.var
    }
);

const sectionTitleClassName = style(
    expandableSectionClassName,
    {
        paddingTop: global_spacer_lg.var
    }
);

const titleClassName = style({
    marginTop: '-0.15em',
    color: global_palette_black_1000.var
});

const emptyAddButtonClassName = style({
    marginTop: '-0.2em'
});

interface BehaviorGroupSectionProps {
    bundleId: UUID;
    behaviorGroupContent: BehaviorGroupContent;
}

export const BehaviorGroupsSection: React.FunctionComponent<BehaviorGroupSectionProps> = props => {

    const [ isExpanded, setExpanded ] = React.useState(true);
    const [ filter, setFilter ] = React.useState<string>('');
    const { rbac } = useAppContext();

    const filteredBehaviors = React.useMemo(() => {
        if (!props.behaviorGroupContent.isLoading && !props.behaviorGroupContent.hasError) {
            const lowerCaseFilter = filter.toLowerCase();
            return props.behaviorGroupContent.content.filter(bg => bg.displayName.toLowerCase().includes(lowerCaseFilter));
        }

        return emptyImmutableArray;
    }, [ filter, props.behaviorGroupContent ]);

    const [ editModalState, editModalActions ] = useFormModalReducer<BehaviorGroup>();
    const [ deleteModalState, deleteModalActions ] = useDeleteModalReducer<BehaviorGroup>();

    const createGroup = React.useCallback((event) => {
        event.stopPropagation();
        editModalActions.create({
            bundleId: props.bundleId
        });
    }, [ editModalActions, props.bundleId ]);

    const onCloseModal = React.useCallback((saved: boolean) => {
        const reload = props.behaviorGroupContent.reload;
        if (saved) {
            reload();
        }

        editModalActions.reset();
    }, [ editModalActions, props.behaviorGroupContent.reload ]);

    const onEdit = React.useCallback((behaviorGroup: BehaviorGroup) => {
        editModalActions.edit(behaviorGroup);
    }, [ editModalActions ]);

    const onDelete = React.useCallback((behaviorGroup: BehaviorGroup) => {
        deleteModalActions.delete(behaviorGroup);
    }, [ deleteModalActions ]);

    const onCloseDelete = React.useCallback((deleted: boolean) => {
        const reload = props.behaviorGroupContent.reload;
        if (deleted) {
            reload();
        }

        deleteModalActions.reset();
    }, [ deleteModalActions, props.behaviorGroupContent.reload ]);

    const onClearFilter = React.useCallback(() => {
        setFilter('');
    }, [ setFilter ]);

    const contentId = 'behavior-group-section-content';

    return (
        <div>
            <div className={ sectionTitleClassName }>
                <ExpandableSectionToggle
                    isExpanded={ isExpanded }
                    onToggle={ setExpanded }
                    contentId={ contentId }
                    direction="down"
                >
                    <Split hasGutter>
                        <SplitItem>
                            <Title className={ titleClassName } headingLevel="h2">Behavior groups</Title>
                        </SplitItem>
                        <SplitItem>
                            { (!props.behaviorGroupContent.isLoading && !props.behaviorGroupContent.hasError) && (
                                props.behaviorGroupContent.content.length > 0 ?
                                    <Badge isRead>{ props.behaviorGroupContent.content.length }</Badge> :
                                    <Button
                                        className={ emptyAddButtonClassName }
                                        variant={ ButtonVariant.primary }
                                        onClick={ createGroup }
                                        component='a'
                                        isDisabled={ !rbac.canWriteNotifications }
                                    >
                                        Create new group
                                    </Button>
                            ) }
                        </SplitItem>
                    </Split>
                </ExpandableSectionToggle>
            </div>
            <ExpandableSection
                className={ sectionClassName }
                contentId={ contentId }
                isExpanded={ isExpanded }
                onToggle={ setExpanded }
                isDetached
            >
                <Stack hasGutter>
                    <StackItem>
                        Configure default actions for notifications recipients. Keep in mind that users will be able
                        to change settings for all entitled events in User Preferences. You can prevent users from
                        changing assigned actions by locking action / recipient pairings when creating or editing
                        behavior groups.
                    </StackItem>
                    { (props.behaviorGroupContent.isLoading ||
                        props.behaviorGroupContent.hasError ||
                        props.behaviorGroupContent.content.length > 0) && (
                        <>
                            <StackItem>
                                <Split hasGutter>
                                    <SplitItem>
                                        <SearchInput
                                            value={ filter }
                                            onChange={ setFilter }
                                            onClear={ onClearFilter }
                                            type="text"
                                            aria-label="Search by name"
                                            placeholder="Search by name"
                                            isDisabled={ props.behaviorGroupContent.isLoading }
                                        />
                                    </SplitItem>
                                    <SplitItem>
                                        <Button
                                            isDisabled={ props.behaviorGroupContent.isLoading || !rbac.canWriteNotifications }
                                            variant={ ButtonVariant.primary }
                                            onClick={ createGroup }
                                        >
                                            Create new group
                                        </Button>
                                    </SplitItem>
                                </Split>
                            </StackItem>
                            <StackItem>
                                { props.behaviorGroupContent.isLoading ? (
                                    <BehaviorGroupCardListSkeleton />
                                ) : props.behaviorGroupContent.hasError ? (
                                    <div>Error loading behavior groups</div>
                                ) : (
                                    <BehaviorGroupCardList
                                        onEdit={ rbac.canWriteNotifications ? onEdit : undefined }
                                        onDelete={ rbac.canWriteNotifications ? onDelete : undefined }
                                        behaviorGroups={ filteredBehaviors }
                                    />
                                ) }
                            </StackItem>
                        </>
                    ) }
                </Stack>
                { editModalState.isOpen && (
                    <EditBehaviorGroupPage
                        behaviorGroup={ editModalState.template }
                        onClose={ onCloseModal }
                    />
                )}
                { deleteModalState.isOpen && (
                    <DeleteBehaviorGroupPage
                        behaviorGroup={ deleteModalState.data }
                        onClose={ onCloseDelete }
                    />
                ) }
            </ExpandableSection>
        </div>
    );
};
