import {
  Badge,
  Icon,
  Label,
  LabelGroup,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Popper,
  Tooltip,
} from '@patternfly/react-core';
import { BellSlashIcon, LockIcon } from '@patternfly/react-icons';
import { TableText } from '@patternfly/react-table';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { emptyImmutableObject } from '../../../utils/Immutable';
import { join } from '../../../utils/insights-common-typescript';
import messages from '../messages';

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

interface BehaviorGroupChip {
  behaviorGroup: BehaviorGroup;
  notification: BehaviorGroupCellProps['notification'];
  onSelect?: BehaviorGroupCellProps['onSelect'];
}

const CommaSeparator: React.FunctionComponent = () => <span>, </span>;

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChip> = (props) => {
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

export const BehaviorGroupCell: React.FunctionComponent<BehaviorGroupCellProps> = (props) => {
  const intl = useIntl();
  const [isOpen, setOpen] = React.useState(false);

  const onSelected = React.useCallback(
    (
      event?: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent,
      behaviorGroupId?: string
    ) => {
      const dataset =
        (event?.currentTarget?.firstChild as HTMLElement)?.dataset ?? emptyImmutableObject;
      const onSelect = props.onSelect;
      if (
        !props.behaviorGroupContent.isLoading &&
        !props.behaviorGroupContent.hasError &&
        onSelect
      ) {
        let found;
        if (dataset.behaviorGroupId || behaviorGroupId) {
          found = props.behaviorGroupContent.content.find(
            // eslint-disable-next-line testing-library/await-async-queries
            findById((dataset.behaviorGroupId as string) || (behaviorGroupId as string))
          );
          if (found) {
            // eslint-disable-next-line testing-library/await-async-queries
            const isSelected = !!props.selected.find(findById(found.id));
            onSelect(props.notification, found, !isSelected);
          }
        }
      }
    },
    [props.onSelect, props.behaviorGroupContent, props.notification, props.selected]
  );

  const items = React.useMemo(() => {
    if (props.behaviorGroupContent.isLoading || props.behaviorGroupContent.hasError) {
      return [
        <MenuItem key="is-loading" isDisabled>
          {intl.formatMessage(messages.loading)}
        </MenuItem>,
      ];
    }

    if (props.behaviorGroupContent.content.length === 0) {
      return [
        <MenuItem key="empty" isDisabled>
          <span className="pf-v6-u-text-align-left">
            {intl.formatMessage(messages.noBehaviorGroups)}
          </span>
        </MenuItem>,
      ];
    }

    const behaviorGroups = [
      ...props.selected.filter((b) => b.isDefault),
      ...props.behaviorGroupContent.content.filter((b) => !b.isDefault),
    ];

    return [
      behaviorGroups.map((bg) => {
        // eslint-disable-next-line testing-library/await-async-queries
        const selected = !!props.selected.find(findById(bg.id));

        return (
          <MenuItem
            key={bg.id}
            hasCheckbox
            onClick={(event) => onSelected(event, bg.id)}
            data-behavior-group-id={bg.id}
            isSelected={selected}
            isDisabled={bg.isDefault}
            className="pf-v6-u-ml-sm"
          >
            {bg.isDefault && <LockIcon className="pf-v6-u-ml-sm" />}{' '}
            <span className="pf-v6-u-ml-sm"> {bg.displayName}</span>
          </MenuItem>
        );
      }),
    ];
  }, [props.behaviorGroupContent, props.selected, onSelected, intl]);

  const sortedSelected = React.useMemo(
    () => [
      ...props.selected.filter((b) => b.isDefault),
      ...props.selected.filter((b) => !b.isDefault),
    ],
    [props.selected]
  );

  const toggleContent = React.useMemo(() => {
    return sortedSelected.length === 0 ? (
      <>
        <span className="pf-v6-u-disabled-color-100">
          {intl.formatMessage(messages.selectBehaviorGroup)}
        </span>
        <Badge className="pf-v6-u-ml-xs" isRead>
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
        <Badge className="pf-v6-u-ml-xs" isRead>
          {sortedSelected.length}
        </Badge>
      </>
    );
  }, [sortedSelected, props.notification, props.onSelect, intl]);

  const readonlyText = React.useMemo(() => {
    if (sortedSelected.length === 0) {
      return (
        <span>
          <Icon className="pf-v6-u-mr-sm pf-v6-u-disabled-color-100" isInline>
            <BellSlashIcon />
          </Icon>
          {intl.formatMessage(messages.mute)}
        </span>
      );
    }

    return join(
      sortedSelected.map((b) => (
        <React.Fragment key={b.id}>
          {b.isDefault && (
            <Tooltip
              content={intl.formatMessage(messages.defaultBehaviorTooltip, {
                displayName: b.displayName,
              })}
            >
              <LockIcon className="pf-v6-u-mr-sm pf-v6-u-disabled-color-100" />
            </Tooltip>
          )}{' '}
          <Label isCompact>{b.displayName}</Label>
        </React.Fragment>
      )),
      CommaSeparator
    );
  }, [sortedSelected, intl]);

  if (!props.isEditMode) {
    return <TableText wrapModifier="truncate"> {readonlyText} </TableText>;
  }

  return (
    <Popper
      trigger={
        <MenuToggle onClick={() => setOpen(!isOpen)} isExpanded={isOpen} variant="plain">
          {toggleContent}
        </MenuToggle>
      }
      popper={
        <Menu>
          <MenuList>{items}</MenuList>
        </Menu>
      }
      isVisible={isOpen}
      appendTo={() => document.body}
    />
  );
};
