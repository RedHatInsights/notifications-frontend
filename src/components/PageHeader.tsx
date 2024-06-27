import { Split, SplitItem, Text, TextContent } from '@patternfly/react-core';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import PageHeaderFC from '@redhat-cloud-services/frontend-components/PageHeader';
import * as React from 'react';

interface PageHeaderProps {
  title: React.ReactNode | string;
  subtitle: React.ReactNode | string;
  action?: React.ReactNode;
}

export const PageHeader: React.FunctionComponent<
  React.PropsWithChildren<PageHeaderProps>
> = (props) => {
  return (
    <PageHeaderFC className="pf-v5-u-pb-md">
      <Split>
        <SplitItem isFilled>
          <PageHeaderTitle title={props.title} />
          <TextContent className="pf-v5-u-pt-sm">
            <Text>{props.subtitle}</Text>
          </TextContent>
        </SplitItem>
        {props.action && (
          <SplitItem className="pf-v5-u-ml-3xl">{props.action}</SplitItem>
        )}
      </Split>
    </PageHeaderFC>
  );
};
