import {
  Button,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Title,
} from '@patternfly/react-core';
import {
  BellIcon,
  BugIcon,
  IntegrationIcon,
  RunningIcon,
  UserIcon,
  UsersIcon,
} from '@patternfly/react-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

export enum IconName {
  USER = 'user',
  RUNNING = 'running',
  INTEGRATION = 'integration',
  USERS = 'users',
  BELL = 'bell',
  BUG = 'bug',
}

interface CustomDataListItemProps {
  icon: IconName;
  heading: string;
  linkTitle?: string;
  linkTarget?: string;
  expandableContent: React.ReactNode;
  isRedirect?: boolean;
  isExpanded?: boolean;
}

const IconMapper = {
  [IconName.USER]: <UserIcon className="pf-v6-u-icon-color-brand" />,
  [IconName.RUNNING]: <RunningIcon className="pf-v6-u-icon-color-brand" />,
  [IconName.INTEGRATION]: <IntegrationIcon className="pf-v6-u-icon-color-brand" />,
  [IconName.USERS]: <UsersIcon className="pf-v6-u-icon-color-brand" />,
  [IconName.BELL]: <BellIcon className="pf-v6-u-icon-color-brand" />,
  [IconName.BUG]: <BugIcon className="pf-v6-u-icon-color-brand" />,
};

const messages = defineMessages({
  actionsAria: {
    id: 'overview.dataListItem.actionsAria',
    defaultMessage: 'Actions',
  },
  detailedExplanationAria: {
    id: 'overview.dataListItem.detailedExplanationAria',
    defaultMessage: '{heading} - Detailed Explanation',
  },
});

const ACTIONS_LABELLEDBY = 'item1 action1';
const ACTION_ID = 'action1';
const PREVIEW_PREFIX = '/preview';

const CustomDataListItem: React.FC<CustomDataListItemProps> = ({
  icon,
  heading,
  linkTitle,
  linkTarget,
  expandableContent,
  isRedirect,
  isExpanded,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const iconElement: React.ReactNode | null = IconMapper[icon] || null;
  const [expanded, setExpanded] = React.useState(isExpanded || false);

  return (
    <React.Fragment>
      <DataListItem aria-labelledby="item1" isExpanded={expanded}>
        <DataListItemRow className="pf-v6-u-align-items-center">
          <DataListToggle
            isExpanded={expanded}
            id="toggle1"
            aria-controls="expand1"
            onClick={() => setExpanded(!expanded)}
          />
          <DataListItemCells
            dataListCells={[
              <DataListCell key={'cell-' + icon.toString().toLowerCase()}>
                <div>
                  <Flex className="pf-v6-u-flex-nowrap">
                    <FlexItem className="pf-v6-u-align-self-center">
                      <Icon size="lg">{iconElement}</Icon>
                    </FlexItem>
                    <Divider
                      orientation={{
                        default: 'vertical',
                      }}
                    />
                    <FlexItem className="pf-v6-u-align-self-center">
                      <Title headingLevel="h4">{heading}</Title>
                    </FlexItem>
                  </Flex>
                </div>
              </DataListCell>,
            ]}
          />
          {linkTitle && linkTarget && (
            <DataListAction
              aria-labelledby={ACTIONS_LABELLEDBY}
              id={ACTION_ID}
              aria-label={intl.formatMessage(messages.actionsAria)}
            >
              <Button
                component="a"
                href={linkTarget}
                variant="link"
                onClick={(e) => {
                  if (!isRedirect) {
                    e.preventDefault();
                    navigate(linkTarget.replace(PREVIEW_PREFIX, ''));
                  }
                }}
              >
                {linkTitle}
              </Button>
            </DataListAction>
          )}
        </DataListItemRow>
        <DataListContent
          aria-label={intl.formatMessage(messages.detailedExplanationAria, { heading })}
          id="expand1"
          isHidden={!expanded}
        >
          <p>{expandableContent}</p>
        </DataListContent>
      </DataListItem>
    </React.Fragment>
  );
};

export default CustomDataListItem;
