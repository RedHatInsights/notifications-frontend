import {
  Card,
  CardBody,
  CardHeader,
  Content,
  ContentVariants,
  Menu,
  MenuItem,
  MenuList,
  MenuToggle,
  Popper,
  Skeleton,
  Split,
  SplitItem,
  Tooltip,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';
import * as React from 'react';
import { MarkRequired } from 'ts-essentials';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { BehaviorGroupActionsSummary } from './BehaviorGroupActionsSummary';

const cardClassName = style({
  width: 450,
  height: '100%',
});

export interface BehaviorGroupProps extends OuiaProps {
  behaviorGroup?: BehaviorGroup;
  onEdit?: (behaviorGroup: BehaviorGroup) => void;
  onDelete?: (behaviorGroup: BehaviorGroup) => void;
}

type BehaviorGroupImplProps = MarkRequired<BehaviorGroupProps, 'behaviorGroup'>;

export interface BehaviorGroupCardLayout {
  title: React.ReactNode;
  menuItems?: Array<{
    key: string;
    label: string;
    onClick: () => void;
    isDisabled: boolean;
  }>;
  isDefaultBehavior?: boolean;
}

const BehaviorGroupCardLayout: React.FunctionComponent<
  React.PropsWithChildren<BehaviorGroupCardLayout>
> = (props) => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <Card className={cardClassName}>
      <CardHeader
        actions={{
          actions: (
            <>
              {!props.isDefaultBehavior && props.menuItems && (
                <Popper
                  trigger={
                    <MenuToggle
                      variant="plain"
                      onClick={() => setOpen(!isOpen)}
                      isExpanded={isOpen}
                      icon={<span>&#8942;</span>}
                      aria-label="Actions"
                    />
                  }
                  popper={
                    <Menu>
                      <MenuList>
                        {props.menuItems.map((item) => (
                          <MenuItem
                            key={item.key}
                            onClick={item.onClick}
                            isDisabled={item.isDisabled}
                          >
                            {item.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  }
                  isVisible={isOpen}
                  appendTo={() => document.body}
                />
              )}
            </>
          ),
          hasNoOffset: false,
          className: undefined,
        }}
      >
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
                <Content>
                  <Content component={ContentVariants.h4}>
                    {' '}
                    {props.title}{' '}
                  </Content>
                </Content>
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

  const menuItems = React.useMemo(
    () => [
      {
        key: 'on-edit',
        label: 'Edit',
        onClick: onClickEdit,
        isDisabled: !onClickEdit,
      },
      {
        key: 'on-delete',
        label: 'Delete',
        onClick: onClickDelete,
        isDisabled: !onClickDelete,
      },
    ],
    [onClickEdit, onClickDelete]
  );

  return (
    <BehaviorGroupCardLayout
      title={props.behaviorGroup.displayName}
      menuItems={menuItems}
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
