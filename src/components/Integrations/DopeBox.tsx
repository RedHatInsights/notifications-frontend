import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  ExpandableSection,
  Gallery,
  GalleryItem,
  Icon,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
} from '@patternfly/react-core';
import { CogIcon } from '@patternfly/react-icons';
import { LockIcon } from '@patternfly/react-icons';
import { BellIcon } from '@patternfly/react-icons';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { IntegrationCategory } from '../../types/Integration';
import '../../app/App.scss';

interface DopeBoxProps {
  category?: IntegrationCategory;
}

const DopeBox: React.FC<DopeBoxProps> = ({ category }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const onToggle = React.useCallback(
    (isExpanded: boolean) => {
      setIsExpanded(isExpanded);
    },
    [setIsExpanded]
  );

  return (
    <Card className="noti-c-card-getting-started pf-v5-u-mb-xl">
      <ExpandableSection
        className="pf-u-w-100 pf-u-flex-direction-row"
        toggleText={'Making use of Integrations'}
        onToggle={onToggle}
        isExpanded={isExpanded}
      >
        <Gallery
          hasGutter
          minWidths={{
            default: '100%',
            md: '25%',
          }}
        >
          <GalleryItem>
            <Card isFullHeight isPlain>
              <CardHeader>
                <TextContent>
                  <Text component={TextVariants.h3}>Getting Started</Text>
                </TextContent>
              </CardHeader>
              <CardBody className="pf-v5-u-display-flex">
                <TextContent className="pf-v5-u-display-flex pf-v5-u-flex-direction-column pf-v5-u-align-self-stretch">
                  <Text
                    component={TextVariants.p}
                    className="pf-v5-u-mb-sm pf-v5-u-active-color-100"
                  >
                    <Icon className="pf-v5-u-pl-sm pf-v5-u-pr-md">
                      <CogIcon />
                    </Icon>
                    Configure Applications
                  </Text>
                  <Text component="p" className="pf-u-flex-grow-1">
                    To prepare for integration with the Hybrid Cloud Console,
                    you must configure incoming webhooks in your third-party
                    applications.
                  </Text>
                  {category === IntegrationCategory.COMMUNICATIONS && (
                    <TextList className="pf-u-ml-0">
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-insights-integration-with-slack_integrations"
                          target="_blank"
                        >
                          Configure Slack
                        </Link>
                      </TextListItem>
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-gchat_integrations"
                          target="_blank"
                        >
                          Configure Google Chat
                        </Link>
                      </TextListItem>
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-teams_integrations"
                          target="_blank"
                        >
                          Configure Microsoft Teams
                        </Link>
                      </TextListItem>
                    </TextList>
                  )}
                  {category === IntegrationCategory.REPORTING && (
                    <TextList className="pf-u-ml-0">
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-splunk_integrations"
                          target="_blank"
                        >
                          Configure Splunk
                        </Link>
                      </TextListItem>
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-snow_integrations"
                          target="_blank"
                        >
                          Configure ServiceNow
                        </Link>
                      </TextListItem>
                      <TextListItem>
                        <Link
                          to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-eda_integrations"
                          target="_blank"
                        >
                          Configure Event-Driven Ansible
                        </Link>
                      </TextListItem>
                    </TextList>
                  )}
                  {category === IntegrationCategory.WEBHOOKS && (
                    <Text component="p">
                      <Link
                        to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index"
                        target="_blank"
                      >
                        Learn more
                        <Icon className="pf-u-ml-sm" isInline>
                          <ArrowRightIcon />
                        </Icon>
                      </Link>
                    </Text>
                  )}
                </TextContent>
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card isFullHeight isPlain>
              <CardBody className="pf-v5-u-display-flex pf-v5-u-pt-3xl-on-md">
                <TextContent className="pf-v5-u-display-flex pf-v5-u-flex-direction-column pf-v5-u-align-self-stretch">
                  <Text
                    component={TextVariants.p}
                    className="pf-v5-u-mb-sm pf-v5-u-active-color-100"
                  >
                    <Icon className="pf-v5-u-pl-sm pf-v5-u-pr-md">
                      <LockIcon />
                    </Icon>
                    Configure user access
                  </Text>
                  <Text component="p" className="pf-u-flex-grow-1">
                    To configure notifications and integration settings, you
                    must be a member of a group with the Notifications
                    adminstrator role. This group must be configured in User
                    Access by an Organization Administrator.
                  </Text>
                  <Text component="p">
                    <Link
                      to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/user_access_configuration_guide_for_role-based_access_control_rbac/index"
                      target="_blank"
                    >
                      Learn more
                      <Icon className="pf-u-ml-sm" isInline>
                        <ArrowRightIcon />
                      </Icon>
                    </Link>
                  </Text>
                </TextContent>
              </CardBody>
            </Card>
          </GalleryItem>
          <GalleryItem>
            <Card className="noti-c-card-configure" isFullHeight isPlain>
              <CardHeader>
                <TextContent>
                  <Text component={TextVariants.h3}>Next Steps</Text>
                </TextContent>
              </CardHeader>
              <CardBody className="pf-v5-u-display-flex">
                <TextContent className="pf-v5-u-display-flex pf-v5-u-flex-direction-column pf-v5-u-align-self-stretch">
                  <Text
                    component={TextVariants.p}
                    className="pf-v5-u-mb-sm pf-v5-u-active-color-100"
                  >
                    <Icon className="pf-v5-u-pl-sm pf-v5-u-pr-md">
                      <BellIcon />
                    </Icon>
                    Configure Notifications Portal
                  </Text>
                  <Text component="p" className="pf-u-flex-grow-1">
                    You can configure the Red Hat Cloud Console to send event
                    notifications to all users on a new or existing channel in
                    Google Chat, Microsoft Teams, or Slack.
                  </Text>
                  <Text component="p">
                    <Link
                      to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index"
                      target="_blank"
                    >
                      Learn more
                      <Icon className="pf-u-ml-sm" isInline>
                        <ArrowRightIcon />
                      </Icon>
                    </Link>
                  </Text>
                </TextContent>
              </CardBody>
            </Card>
          </GalleryItem>
        </Gallery>
      </ExpandableSection>
    </Card>
  );
};
export default DopeBox;
