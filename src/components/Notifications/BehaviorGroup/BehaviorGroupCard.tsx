import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
} from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
} from '@patternfly/react-core/deprecated';
import { LockIcon } from '@patternfly/react-icons';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { MarkRequired } from 'ts-essentials';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { BehaviorGroupActionsSummary } from './BehaviorGroupActionsSummary';

const cardClassName = style({
  width: 450,
  height: '100%',
});

export interface BehaviorGroupProps extends OuiaComponentProps {
  behaviorGroup?: BehaviorGroup;
  onEdit?: (behaviorGroup: BehaviorGroup) => void;
  onDelete?: (behaviorGroup: BehaviorGroup) => void;
}

type BehaviorGroupImplProps = MarkRequired<BehaviorGroupProps, 'behaviorGroup'>;

export interface BehaviorGroupCardLayout {
  title: React.ReactNode;
  dropdownItems?: Array<React.ReactNode>;
  isDefaultBehavior?: boolean;
}

const BehaviorGroupCardLayout: React.FunctionComponent<
  React.PropsWithChildren<BehaviorGroupCardLayout>
> = (props) => {
  const [isOpen, setOpen] = React.useState(false);

  const switchOpen = React.useCallback(
    () => setOpen((prev) => !prev),
    [setOpen]
  );

  return (
    <Card isFlat className={cardClassName}>
      <CardHeader
        actions={{
          actions: (
            <>
              {!props.isDefaultBehavior && (
                <Dropdown
                  onSelect={switchOpen}
                  toggle={
                    <KebabToggle
                      onToggle={(_e, isOpen) => setOpen(isOpen)}
                      isDisabled={!props.dropdownItems}
                    />
                  }
                  isOpen={isOpen}
                  isPlain
                  dropdownItems={props.dropdownItems}
                  position={DropdownPosition.right}
                  menuAppendTo={() => document.body}
                />
              )}
            </>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
        actions=
        {
          <>
            <Split>
              <SplitItem>
                {props.isDefaultBehavior && (
                  <Tooltip
                    position="top"
                    appendTo={() => document.body}
                    // eslint-disable-next-line max-len
                    content={
                      <div>
                        System required behavior group
                        <br></br>
                        <br></br>
                        This group is system generated and can not be edited,
                        deleted, or removed from being applied to an event
                      </div>
                    }
                  >
                    <LockIcon className="pf-v5-u-mr-sm" />
                  </Tooltip>
                )}
              </SplitItem>
              <SplitItem>
                <TextContent>
                  <Text component={TextVariants.h4}> {props.title} </Text>
                </TextContent>
              </SplitItem>
            </Split>
          </>
        }
      </CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
};

const BehaviorGroupCardImpl: React.FunctionComponent<BehaviorGroupImplProps> = (
  props
) => {
  const onClickEdit = React.useCallback(() => {
    const onEdit = props.onEdit;
    if (onEdit) {
      onEdit(props.behaviorGroup);
    }
  }, [props.behaviorGroup, props.onEdit]);

  const onClickDelete = React.useCallback(() => {
    const onDelete = props.onDelete;
    if (onDelete) {
      onDelete(props.behaviorGroup);
    }
  }, [props.behaviorGroup, props.onDelete]);

  const dropdownItems = React.useMemo(
    () => [
      <DropdownItem
        key="on-edit"
        onClick={onClickEdit}
        isDisabled={!onClickEdit}
      >
        {' '}
        Edit{' '}
      </DropdownItem>,
      <DropdownItem
        key="on-delete"
        onClick={onClickDelete}
        isDisabled={!onClickDelete}
      >
        {' '}
        Delete{' '}
      </DropdownItem>,
    ],
    [onClickEdit, onClickDelete]
  );

  return (
    <BehaviorGroupCardLayout
      title={props.behaviorGroup.displayName}
      dropdownItems={dropdownItems}
      isDefaultBehavior={props.behaviorGroup.isDefault}
    >
      <BehaviorGroupActionsSummary actions={props.behaviorGroup.actions} />
    </BehaviorGroupCardLayout>
  );
};

const BehaviorGroupCardSkeleton: React.FunctionComponent = () => {
  return (
    <BehaviorGroupCardLayout title={<Skeleton width="300px" />}>
      <BehaviorGroupActionsSummary />
    </BehaviorGroupCardLayout>
  );
};

export const BehaviorGroupCard: React.FunctionComponent<BehaviorGroupProps> = (
  props
) => {
  if (props.behaviorGroup) {
    return (
      <BehaviorGroupCardImpl {...props} behaviorGroup={props.behaviorGroup} />
    );
  }

  return <BehaviorGroupCardSkeleton />;
};
