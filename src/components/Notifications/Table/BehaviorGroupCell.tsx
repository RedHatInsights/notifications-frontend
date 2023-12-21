import {
  Badge,
  Chip,
  ChipGroup,
  Icon,
  Label,
  MenuItem,
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuToggle,
  Tooltip,
} from '@patternfly/react-core';
import { BellSlashIcon, LockIcon } from '@patternfly/react-icons';
import { TableText } from '@patternfly/react-table';
import { join } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import {
  BehaviorGroup,
  NotificationBehaviorGroup,
} from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { emptyImmutableObject } from '../../../utils/Immutable';

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

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChip> = (
  props
) => {
  const unlink = React.useCallback(() => {
    const onSelect = props.onSelect;
    if (onSelect) {
      onSelect(props.notification, props.behaviorGroup, false);
    }
  }, [props.onSelect, props.behaviorGroup, props.notification]);

  return (
    <Chip onClick={unlink} isReadOnly={props.behaviorGroup.isDefault}>
      {props.behaviorGroup.displayName}
    </Chip>
  );
};

export const BehaviorGroupCell: React.FunctionComponent<BehaviorGroupCellProps> =
  (props) => {
    const [isOpen, setOpen] = React.useState(false);

    const onSelected = React.useCallback(
      (
        event?: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent,
        behaviorGroupId?: string
      ) => {
        const dataset =
          (event?.currentTarget?.firstChild as HTMLElement)?.dataset ??
          emptyImmutableObject;
        const onSelect = props.onSelect;
        if (
          !props.behaviorGroupContent.isLoading &&
          !props.behaviorGroupContent.hasError &&
          onSelect
        ) {
          if (dataset.behaviorGroupId || behaviorGroupId) {
            let found;
            if (dataset.behaviorGroupId) {
              found = props.behaviorGroupContent.content.find(
                // eslint-disable-next-line testing-library/await-async-queries
                findById(dataset.behaviorGroupId)
              );
            } else if (behaviorGroupId) {
              found = props.behaviorGroupContent.content.find(
                // eslint-disable-next-line testing-library/await-async-queries
                findById(behaviorGroupId)
              );
            }
            if (found) {
              // eslint-disable-next-line testing-library/await-async-queries
              const isSelected = !!props.selected.find(findById(found.id));
              onSelect(props.notification, found, !isSelected);
            }
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

    const items = React.useMemo(() => {
      if (
        props.behaviorGroupContent.isLoading ||
        props.behaviorGroupContent.hasError
      ) {
        return [
          <OptionsMenuItem key="is-loading" isDisabled>
            Loading
          </OptionsMenuItem>,
        ];
      }

      if (props.behaviorGroupContent.content.length === 0) {
        return [
          <OptionsMenuItem key="empty" isDisabled>
            <span className="pf-v5-u-text-align-left">
              You have no behavior groups. <br />
              Create a new group by clicking on the <br />
              &apos;Create new group&apos; button above.
            </span>
          </OptionsMenuItem>,
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
              hasCheck
              onClick={(event) => onSelected(event, bg.id)}
              data-behavior-group-id={bg.id}
              isSelected={selected}
              isDisabled={bg.isDefault}
              className="pf-v5-u-ml-sm"
            >
              {bg.isDefault && <LockIcon className="pf-v5-u-ml-sm" />}{' '}
              <span className="pf-v5-u-ml-sm"> {bg.displayName}</span>
            </MenuItem>
          );
        }),
      ];
    }, [props.behaviorGroupContent, props.selected, onSelected]);

    const sortedSelected = React.useMemo(
      () => [
        ...props.selected.filter((b) => b.isDefault),
        ...props.selected.filter((b) => !b.isDefault),
      ],
      [props.selected]
    );

    const toggle = React.useMemo(() => {
      return (
        <OptionsMenuToggle
          onToggle={setOpen}
          toggleTemplate={
            sortedSelected.length === 0 ? (
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
                <ChipGroup>
                  {sortedSelected.map((value) => (
                    <BehaviorGroupChip
                      key={value.id}
                      behaviorGroup={value}
                      notification={props.notification}
                      onSelect={props.onSelect}
                    />
                  ))}
                </ChipGroup>
                <Badge className="pf-v5-u-ml-xs" isRead>
                  {sortedSelected.length}
                </Badge>
              </>
            )
          }
        />
      );
    }, [sortedSelected, props.notification, props.onSelect]);

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
      <OptionsMenu
        id={props.id}
        direction="down"
        menuItems={items}
        toggle={toggle}
        isOpen={isOpen}
        menuAppendTo={document.body}
      />
    );
  };
