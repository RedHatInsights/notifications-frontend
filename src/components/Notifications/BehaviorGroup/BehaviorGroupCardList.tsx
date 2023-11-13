import { Flex, FlexItem } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import * as React from 'react';
import { MarkRequired } from 'ts-essentials';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { BehaviorGroupCard } from './BehaviorGroupCard';

const cardsWrapperClassName = style({
  overflow: 'auto',
});

const cardWrapperClassName = style({
  paddingBottom: global_spacer_md.var,
});

interface BehaviorGroupCardListProps {
  onEdit?: (behaviorGroup: BehaviorGroup) => void;
  onDelete?: (behaviorGroup: BehaviorGroup) => void;
  behaviorGroups?: ReadonlyArray<BehaviorGroup>;
}

type BehaviorGroupCardListImplProps = MarkRequired<
  BehaviorGroupCardListProps,
  'behaviorGroups'
>;

const skeletonBehaviorGroupCount = 3;

const BehaviorGroupCardListLayout: React.FunctionComponent = (props) => {
  return (
    <div data-testid="ref-card-list-container">
      <Flex
        alignItems={{ default: 'alignItemsStretch' }}
        alignContent={{ default: 'alignContentSpaceBetween' }}
        flexWrap={{ default: 'nowrap' }}
        className={cardsWrapperClassName}
        data-testid="card-list-container"
      >
        {props.children}
      </Flex>
    </div>
  );
};

const BehaviorGroupaCrdListImpl: React.FunctionComponent<BehaviorGroupCardListImplProps> =
  (props) => {
    return (
      <BehaviorGroupCardListLayout>
        {props.behaviorGroups.map((behaviorGroup) => (
          <FlexItem key={behaviorGroup.id} className={cardWrapperClassName}>
            <BehaviorGroupCard
              behaviorGroup={behaviorGroup}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          </FlexItem>
        ))}
      </BehaviorGroupCardListLayout>
    );
  };

const BehaviorGroupCardListSkeleton: React.FunctionComponent = () => {
  return (
    <BehaviorGroupCardListLayout>
      {[...Array(skeletonBehaviorGroupCount).values()].map((_unused, index) => (
        <FlexItem
          key={`behavior-group-card-skeleton-${index}`}
          className={cardWrapperClassName}
        >
          <BehaviorGroupCard />
        </FlexItem>
      ))}
    </BehaviorGroupCardListLayout>
  );
};

export const BehaviorGroupCardList: React.FunctionComponent<BehaviorGroupCardListProps> =
  (props) => {
    if (props.behaviorGroups) {
      return (
        <BehaviorGroupaCrdListImpl
          {...props}
          behaviorGroups={props.behaviorGroups}
        />
      );
    }

    return <BehaviorGroupCardListSkeleton />;
  };
