import { Split, SplitItem, Text, TextContent } from '@patternfly/react-core';
import { global_spacer_3xl, global_spacer_sm } from '@patternfly/react-tokens';
import PageHeaderFC from '@redhat-cloud-services/frontend-components/PageHeader';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import * as React from 'react';
import { style } from 'typestyle';

interface PageHeaderProps {
  title: React.ReactNode | string;
  subtitle: React.ReactNode | string;
  action?: React.ReactNode;
}

const subtitleClassName = style({
  paddingTop: global_spacer_sm.value,
});

const actionClassName = style({
  marginLeft: global_spacer_3xl.value,
});

export const PageHeader: React.FunctionComponent<PageHeaderProps> = (props) => {
  return (
    <PageHeaderFC className="pf-u-pb-md">
      <Split>
        <SplitItem isFilled>
          <PageHeaderTitle title={props.title} />
          <TextContent className={subtitleClassName}>
            <Text>{props.subtitle}</Text>
          </TextContent>
        </SplitItem>
        {props.action && (
          <SplitItem className={actionClassName}>{props.action}</SplitItem>
        )}
      </Split>
    </PageHeaderFC>
  );
};
