import {
  Grid,
  GridItem,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import * as React from 'react';

import { Action } from '../../../types/Notification';
import { ActionComponent } from '../ActionComponent';
import { Recipient } from '../Recipient';

interface BehaviorGroupActionsSummaryProps {
  actions?: ReadonlyArray<Action>;
}

type BehaviorGroupActionSummaryImplProps =
  Required<BehaviorGroupActionsSummaryProps>;

const skeletonActions = 3;

const BehaviorGroupActionsSummaryLayout: React.FunctionComponent<
  React.PropsWithChildren
> = (props) => {
  return (
    <Grid>
      <GridItem span={6}>
        <TextContent>
          <Text component={TextVariants.h6}>Action</Text>
        </TextContent>
      </GridItem>
      <GridItem span={6}>
        <TextContent>
          <Text component={TextVariants.h6}>Recipient</Text>
        </TextContent>
      </GridItem>
      {props.children}
    </Grid>
  );
};

const BehaviorGroupActionsSummaryImpl: React.FunctionComponent<
  BehaviorGroupActionSummaryImplProps
> = (props) => {
  return (
    <BehaviorGroupActionsSummaryLayout>
      {props.actions.map((action, index) => (
        <React.Fragment key={`${index}-${action.type}`}>
          <GridItem span={6}>
            <ActionComponent action={action} />
          </GridItem>
          <GridItem className="pf-u-text-break-word" span={6}>
            <Recipient action={action} />
          </GridItem>
        </React.Fragment>
      ))}
    </BehaviorGroupActionsSummaryLayout>
  );
};

const BehaviorGroupActionsSummarySkeleton: React.FunctionComponent = () => {
  const contentWidth = '150px';

  return (
    <BehaviorGroupActionsSummaryLayout>
      {[...Array(skeletonActions).values()].map((_unused, index) => (
        <React.Fragment key={`skeleton-${index}`}>
          <GridItem span={6}>
            <Skeleton width={contentWidth} />
          </GridItem>
          <GridItem span={6}>
            <Skeleton width={contentWidth} />
          </GridItem>
        </React.Fragment>
      ))}
    </BehaviorGroupActionsSummaryLayout>
  );
};

export const BehaviorGroupActionsSummary: React.FunctionComponent<
  BehaviorGroupActionsSummaryProps
> = (props) => {
  if (props.actions) {
    return <BehaviorGroupActionsSummaryImpl actions={props.actions} />;
  }

  return <BehaviorGroupActionsSummarySkeleton />;
};
