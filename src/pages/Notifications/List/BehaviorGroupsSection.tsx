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

import {
    BehaviorGroupCardList,
    BehaviorGroupCardListSkeleton
} from '../../../components/Notifications/BehaviorGroup/BehaviorGroupCardList';
import {
    makeCreateAction,
    makeEditAction,
    makeNoneAction,
    useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { useGetBehaviorGroups } from '../../../services/Notifications/GetBehaviorGroups';
import { BehaviorGroup, UUID } from '../../../types/Notification';
import { EditBehaviorGroupPage } from '../Form/EditBehaviorGroupPage';

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
}

type BehaviorGroupContent = {
    isLoading: true;
} | {
    isLoading: false;
    hasError: true;
    error: string;
} | {
    isLoading: false;
    hasError: false;
    content: Array<BehaviorGroup>;
    filtered: Array<BehaviorGroup>;
}

export const BehaviorGroupsSection: React.FunctionComponent<BehaviorGroupSectionProps> = props => {

    const [ isExpanded, setExpanded ] = React.useState(true);
    const [ filter, setFilter ] = React.useState<string>('');

    const behaviorGroups = useGetBehaviorGroups(props.bundleId);

    const contentWrapper = React.useMemo<BehaviorGroupContent>(() => {
        const payload = behaviorGroups.payload;
        const error = behaviorGroups.errorObject;
        const loading = behaviorGroups.loading;

        if (loading) {
            return {
                isLoading: true
            };
        }

        if (payload?.status === 200) {
            const lowerCaseFilter = filter.toLowerCase();
            return {
                isLoading: false,
                hasError: false,
                content: payload.value,
                filtered: payload.value.filter(bg => bg.displayName.toLowerCase().includes(lowerCaseFilter))
            };
        }

        return {
            isLoading: false,
            hasError: true,
            error: error.toString()
        };

    }, [ behaviorGroups.payload, behaviorGroups.loading, filter, behaviorGroups.errorObject ]);

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

    const onClearFilter = React.useCallback(() => {
        setFilter('');
    }, [ setFilter ]);

    const contentId = 'behaviour-group-section-content';

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
                            { (!contentWrapper.isLoading && !contentWrapper.hasError) && (
                                contentWrapper.content.length > 0 ?
                                    <Badge isRead>{ contentWrapper.content.length }</Badge> :
                                    <Button
                                        className={ emptyAddButtonClassName }
                                        variant={ ButtonVariant.primary }
                                        onClick={ createGroup }
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
                    { (contentWrapper.isLoading || contentWrapper.hasError || contentWrapper.content.length > 0) && (
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
                                            isDisabled={ contentWrapper.isLoading }
                                        />
                                    </SplitItem>
                                    <SplitItem>
                                        <Button
                                            isDisabled={ contentWrapper.isLoading }
                                            variant={ ButtonVariant.primary }
                                            onClick={ createGroup }
                                        >
                                            Create new group
                                        </Button>
                                    </SplitItem>
                                </Split>
                            </StackItem>
                            <StackItem>
                                { contentWrapper.isLoading ? (
                                    <BehaviorGroupCardListSkeleton />
                                ) : contentWrapper.hasError ? (
                                    <div>Error loading behavior groups</div>
                                ) : (
                                    <BehaviorGroupCardList onEdit={ onEdit } behaviorGroups={ contentWrapper.filtered } />
                                ) }
                            </StackItem>
                        </>
                    ) }
                </Stack>
                { modalState.isOpen && (
                    <EditBehaviorGroupPage
                        behaviorGroup={ modalState.template }
                        onClose={ onCloseModal }
                    />
                )}
            </ExpandableSection>
        </div>
    );
};
