import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Gallery,
  Icon,
  Text,
  TextContent,
  TextVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  CogIcon,
  CubesIcon,
  HelpIcon,
  InfrastructureIcon,
} from '@patternfly/react-icons';
import React from 'react';

import { Messages } from '../../properties/Messages';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../app/AppContext';

const getEmptyIntegrationCard = (props) => {
  const { TitleIcon, title, body, link, isOrgAdmin } = props;
  return (
    <Card
      isFullHeight
      isPlain
      style={{ maxWidth: isOrgAdmin ? '106ch' : '70ch' }}
    >
      <CardHeader>
        <Icon className="pf-v5-u-pl-sm pf-v5-u-pr-lg">
          <TitleIcon className="pf-v5-u-link-color" />
        </Icon>
        <TextContent>
          <Text component={TextVariants.h4}>{title}</Text>
        </TextContent>
      </CardHeader>
      <CardBody className="pf-v5-u-display-flex">
        <TextContent className="pf-v5-u-display-flex pf-v5-u-flex-direction-column pf-v5-u-align-self-stretch">
          <Text component={TextVariants.p} className="pf-u-flex-grow-1">
            {body}
          </Text>
          <Text component={TextVariants.p}>
            <Link to={link} target="_blank">
              Learn more
              <Icon className="pf-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            </Link>
          </Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};

export const IntegrationsEmptyState: React.FunctionComponent<{
  onAddIntegration: (() => void) | undefined;
}> = ({ onAddIntegration }) => {
  const { isOrgAdmin } = useAppContext();
  return (
    <div className="pf-v5-l-flex pf-m-justify-content-center">
      <EmptyState>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel={TextVariants.h4} size={TitleSizes.lg}>
          No integrations yet
        </Title>
        <EmptyStateBody>
          <Gallery
            aria-label="Card container"
            minWidths={{ default: '100%', md: isOrgAdmin ? '30%' : '40%' }}
            hasGutter
            className="pf-v5-u-text-align-left"
          >
            {getEmptyIntegrationCard({
              isOrgAdmin,
              TitleIcon: HelpIcon,
              title: 'Why integrate?',
              body: 'Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard.',
              link: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications',
            })}
            {getEmptyIntegrationCard({
              isOrgAdmin,
              TitleIcon: CogIcon,
              title: 'Configure applications',
              body: 'To prepare for integration with the Hybrid Cloud Console, you must configure incoming webhooks in your third-party applications.',
              link: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/assembly-intro_notifications',
            })}
            {isOrgAdmin &&
              getEmptyIntegrationCard({
                isOrgAdmin,
                TitleIcon: InfrastructureIcon,
                title: 'Create behavior groups',
                body: 'A behavior group defines which notifications will be sent to external services when a specific event is received by the notifications service. You can link events from any Red Hat Hybrid Cloud Console service to your behavior group.',
                link: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/assembly-config-behavior-groups_notifications',
              })}
          </Gallery>
        </EmptyStateBody>
        <Button
          variant={ButtonVariant.primary}
          component="a"
          disabled={!onAddIntegration}
          onClick={() => (onAddIntegration ? onAddIntegration() : null)}
        >
          {Messages.components.integrations.toolbar.actions.addIntegration}
        </Button>
      </EmptyState>
    </div>
  );
};
