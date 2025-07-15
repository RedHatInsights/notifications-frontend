import {
  Button,
  ButtonProps,
  ButtonVariant,
  Content,
  ContentVariants,
  SearchInput,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Tooltip,
} from '@patternfly/react-core';

import * as React from 'react';

import { useAppContext } from '../../../app/AppContext';
import { BehaviorGroupCardList } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupCardList';
import { useDeleteModalReducer } from '../../../hooks/useDeleteModalReducer';
import { useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { CreateBehaviorGroup } from '../../../types/CreateBehaviorGroup';
import { BehaviorGroup, Facet } from '../../../types/Notification';
import { emptyImmutableArray } from '../../../utils/Immutable';
import { BehaviorGroupWizardPage } from '../BehaviorGroupWizard/BehaviorGroupWizardPage';
import { DeleteBehaviorGroupPage } from '../Form/DeleteBehaviorGroupPage';
import { BehaviorGroupContent } from './useBehaviorGroupContent';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

interface BehaviorGroupSectionProps {
  bundle: Facet;
  applications: ReadonlyArray<Facet>;
  behaviorGroupContent: BehaviorGroupContent;
}

type BehaviorGroupAddButtonProps = Pick<
  ButtonProps,
  'className' | 'onClick' | 'isDisabled' | 'component'
>;

const BehaviorGroupAddButton: React.FunctionComponent<
  BehaviorGroupAddButtonProps
> = (props) => {
  const { isDisabled, ...buttonProps } = props;
  const [isOrgAdmin, setIsOrgAdmin] = React.useState<boolean | undefined>();
  const { auth } = useChrome();

  React.useEffect(() => {
    const getUserInfo = () =>
      auth.getUser().then((user) => {
        setIsOrgAdmin(user?.identity?.user?.is_org_admin);
      });
    getUserInfo();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const button = (
    <Button
      {...buttonProps}
      isAriaDisabled={isDisabled}
      variant={ButtonVariant.primary}
    >
      Create new group
    </Button>
  );

  if (isDisabled) {
    const content = isOrgAdmin
      ? 'You need the Notifications administrator role to perform this action'
      : 'You do not have permissions to perform this action. Contact your org admin for more information';
    return <Tooltip content={content}>{button}</Tooltip>;
  }

  return button;
};

export const BehaviorGroupsSection: React.FunctionComponent<
  BehaviorGroupSectionProps
> = (props) => {
  const [filter, setFilter] = React.useState<string>('');
  const { rbac } = useAppContext();

  const filteredBehaviors = React.useMemo(() => {
    if (
      !props.behaviorGroupContent.isLoading &&
      !props.behaviorGroupContent.hasError
    ) {
      const lowerCaseFilter = filter.toLowerCase();
      return props.behaviorGroupContent.content.filter((bg) =>
        bg.displayName.toLowerCase().includes(lowerCaseFilter)
      );
    }

    return emptyImmutableArray;
  }, [filter, props.behaviorGroupContent]);

  const [editModalState, editModalActions] =
    useFormModalReducer<CreateBehaviorGroup>();
  const [deleteModalState, deleteModalActions] =
    useDeleteModalReducer<BehaviorGroup>();

  const createGroup = React.useCallback(
    (event) => {
      event.stopPropagation();
      editModalActions.create({
        events: [],
        actions: [],
        displayName: '',
      });
    },
    [editModalActions]
  );

  const onCloseModal = React.useCallback(
    (saved: boolean) => {
      const reload = props.behaviorGroupContent.reload;
      if (saved) {
        reload();
      }

      editModalActions.reset();
    },
    [editModalActions, props.behaviorGroupContent.reload]
  );

  const onEdit = React.useCallback(
    (behaviorGroup: BehaviorGroup) => {
      editModalActions.edit({
        id: behaviorGroup.id,
        events: behaviorGroup.events,
        actions: behaviorGroup.actions,
        displayName: behaviorGroup.displayName,
      });
    },
    [editModalActions]
  );

  const onDelete = React.useCallback(
    (behaviorGroup: BehaviorGroup) => {
      deleteModalActions.delete(behaviorGroup);
    },
    [deleteModalActions]
  );

  const onCloseDelete = React.useCallback(
    (deleted: boolean) => {
      const reload = props.behaviorGroupContent.reload;
      if (deleted) {
        reload();
      }

      deleteModalActions.reset();
    },
    [deleteModalActions, props.behaviorGroupContent.reload]
  );

  const onClearFilter = React.useCallback(() => {
    setFilter('');
  }, [setFilter]);

  return (
    <>
      <div className="pf-v5-u-background-color-100 pf-v5-u-pt-lg pf-v5-u-px-lg">
        <Split className="pf-v5-u-mb-md" hasGutter>
          <SplitItem>
            <Content>
              <Content component={ContentVariants.p}>
                <b>Behavior groups</b> are made up of action/recipient pairings
                that allow you to configure which notification actions different
                users will be able to receive. Once you&apos;ve created a
                behavior group, you can assign it to an event using the Events
                table below.
                <br></br>
                <Content component={ContentVariants.p}>
                  You may also prevent users from changing assigned actions by
                  locking action/recipient pairings when creating or editing
                  behavior groups.
                </Content>
              </Content>
            </Content>
          </SplitItem>
        </Split>
        <Stack hasGutter>
          <StackItem>
            <Split hasGutter className="pf-v5-u-mb-md">
              <SplitItem>
                <SearchInput
                  value={filter}
                  onChange={(_e, val) => setFilter(val)}
                  onClear={onClearFilter}
                  type="text"
                  aria-label="Search by name"
                  placeholder="Search by name"
                  isDisabled={props.behaviorGroupContent.isLoading}
                />
              </SplitItem>
              <SplitItem>
                <BehaviorGroupAddButton
                  component="a"
                  isDisabled={
                    props.behaviorGroupContent.isLoading ||
                    !rbac.canWriteNotifications
                  }
                  onClick={createGroup}
                />
              </SplitItem>
            </Split>
          </StackItem>
        </Stack>
        <Stack hasGutter>
          {(props.behaviorGroupContent.isLoading ||
            props.behaviorGroupContent.hasError ||
            props.behaviorGroupContent.content.length > 0) && (
            <>
              <StackItem>
                {props.behaviorGroupContent.isLoading ? (
                  <BehaviorGroupCardList />
                ) : props.behaviorGroupContent.hasError ? (
                  <div>Error loading behavior groups</div>
                ) : (
                  <BehaviorGroupCardList
                    onEdit={rbac.canWriteNotifications ? onEdit : undefined}
                    onDelete={rbac.canWriteNotifications ? onDelete : undefined}
                    behaviorGroups={filteredBehaviors}
                  />
                )}
              </StackItem>
            </>
          )}
        </Stack>
      </div>
      {editModalState.isOpen && (
        <BehaviorGroupWizardPage
          bundle={props.bundle}
          applications={props.applications}
          behaviorGroup={editModalState.template}
          onClose={onCloseModal}
        />
      )}
      {deleteModalState.isOpen && (
        <DeleteBehaviorGroupPage
          behaviorGroup={deleteModalState.data}
          onClose={onCloseDelete}
        />
      )}
    </>
  );
};
