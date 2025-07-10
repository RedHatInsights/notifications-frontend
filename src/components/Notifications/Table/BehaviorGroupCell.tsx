/* eslint-disable testing-library/await-async-queries */
import {
  Badge,
  Icon,
  Label,
  LabelGroup,
  MenuToggle,
  Select,
  SelectOption,
  Tooltip,
} from '@patternfly/react-core';
import { BellSlashIcon, LockIcon } from '@patternfly/react-icons';
import { TableText } from '@patternfly/react-table';
import * as React from 'react';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import {
  BehaviorGroup,
  NotificationBehaviorGroup,
} from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { join } from '../../../utils/insights-common-typescript';

interface BehaviorGroupCellProps {
  id: string;
  notification: NotificationBehaviorGroup;
  behaviorGroupContent: BehaviorGroupContent;
  selected: ReadonlyArray<BehaviorGroup>;
  onSelect?: (
    notification: NotificationBehaviorGroup,
    behaviorGroup: BehaviorGroup,
    linkBehavior: boolean
  ) => void;
  isEditMode: boolean;
}

interface BehaviorGroupChipProps {
  behaviorGroup: BehaviorGroup;
  notification: BehaviorGroupCellProps['notification'];
  onSelect?: BehaviorGroupCellProps['onSelect'];
}

const CommaSeparator: React.FunctionComponent = () => <span>, </span>;

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChipProps> = (
  props
) => {
  const unlink = React.useCallback(() => {
    const onSelect = props.onSelect;
    if (onSelect) {
      onSelect(props.notification, props.behaviorGroup, false);
    }
  }, [props.onSelect, props.behaviorGroup, props.notification]);

  return (
    <Label variant="outline" onClose={unlink}>
      {props.behaviorGroup.displayName}
    </Label>
  );
};

export const BehaviorGroupCell: React.FunctionComponent<
  BehaviorGroupCellProps
> = (props) => {
  const [isOpen, setOpen] = React.useState(false);

  const onSelectHandler = React.useCallback(
    (
      _event: React.MouseEvent | React.ChangeEvent | undefined,
      selection: string | number | undefined
    ) => {
      const onSelect = props.onSelect;
      if (
        selection &&
        !props.behaviorGroupContent.isLoading &&
        !props.behaviorGroupContent.hasError &&
        onSelect
      ) {
        const found = props.behaviorGroupContent.content.find(
          findById(selection as string)
        );
        if (found) {
          const isCurrentlySelected = !!props.selected.find(findById(found.id));
          onSelect(props.notification, found, !isCurrentlySelected);
        }
      }
    },
    [
      props.onSelect,
      props.behaviorGroupContent,
      props.notification,
      props.selected,
    ]
  );

  const sortedSelected = React.useMemo(
    () => [
      ...props.selected.filter((b) => b.isDefault),
      ...props.selected.filter((b) => !b.isDefault),
    ],
    [props.selected]
  );

  const toggle = (toggleRef: React.Ref<HTMLButtonElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setOpen(!isOpen)}
      isExpanded={isOpen}
    >
      {sortedSelected.length === 0 ? (
        <>
          <span className="pf-v5-u-disabled-color-100">
            Select behavior group
          </span>
          <Badge className="pf-v5-u-ml-xs" isRead>
            {sortedSelected.length}
          </Badge>
        </>
      ) : (
        <>
          <LabelGroup>
            {sortedSelected.map((value) => (
              <BehaviorGroupChip
                key={value.id}
                behaviorGroup={value}
                notification={props.notification}
                onSelect={props.onSelect}
              />
            ))}
          </LabelGroup>
          <Badge className="pf-v5-u-ml-xs" isRead>
            {sortedSelected.length}
          </Badge>
        </>
      )}
    </MenuToggle>
  );

  const readonlyText = React.useMemo(() => {
    if (sortedSelected.length === 0) {
      return (
        <span>
          <Icon className="pf-v5-u-mr-sm pf-v5-u-disabled-color-100" isInline>
            <BellSlashIcon />
          </Icon>
          Mute
        </span>
      );
    }

    return join(
      sortedSelected.map((b) => (
        <React.Fragment key={b.id}>
          {b.isDefault && (
            <Tooltip
              content={`${b.displayName} behavior is attached to this event and cannot be changed.
                Add additional behavior groups to assign different actions or recipients.`}
            >
              <LockIcon className="pf-v5-u-mr-sm pf-v5-u-disabled-color-100" />
            </Tooltip>
          )}{' '}
          <Label isCompact>{b.displayName}</Label>
        </React.Fragment>
      )),
      CommaSeparator
    );
  }, [sortedSelected]);

  if (!props.isEditMode) {
    return <TableText wrapModifier="truncate"> {readonlyText} </TableText>;
  }

  return (
    <Select
      id={props.id}
      isOpen={isOpen}
      onOpenChange={(isOpen) => setOpen(isOpen)}
      onSelect={onSelectHandler}
      toggle={toggle}
    >
      {props.behaviorGroupContent.isLoading ||
      props.behaviorGroupContent.hasError ? (
        <SelectOption isDisabled>Loading...</SelectOption>
      ) : props.behaviorGroupContent.content.length === 0 ? (
        <SelectOption isDisabled>
          <span className="pf-v5-u-text-align-left">
            You have no behavior groups. <br />
            Create a new group by clicking on the <br />
            &apos;Create new group&apos; button above.
          </span>
        </SelectOption>
      ) : (
        props.behaviorGroupContent.content.map((bg) => {
          const isChecked = props.selected.some((s) => s.id === bg.id);
          return (
            <SelectOption
              key={bg.id}
              value={bg.id}
              isDisabled={bg.isDefault}
              checked={isChecked}
            >
              {bg.isDefault && <LockIcon className="pf-v5-u-mr-sm" />}{' '}
              {bg.displayName}
            </SelectOption>
          );
        })
      )}
    </Select>
  );
};
