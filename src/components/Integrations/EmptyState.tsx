import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardHeader,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Gallery,
  Icon,
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
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';

const EmptyIntegrationCard: React.FunctionComponent<{
  TitleIcon: React.ComponentClass<SVGIconProps, unknown>;
  title: string;
  body: string;
  link: string;
  isOrgAdmin: boolean;
}> = ({ TitleIcon, title, body, link, isOrgAdmin }) => {
  return (
    <Card isFullHeight isPlain style={{ maxWidth: isOrgAdmin ? '106ch' : '70ch' }}>
      <CardHeader>
        <Icon className="pf-v6-u-pl-sm pf-v6-u-pr-lg">
          <TitleIcon className="pf-v6-u-text-color-link" />
        </Icon>
        <Content>
          <Content component={ContentVariants.h4}>{title}</Content>
        </Content>
      </CardHeader>
      <CardBody className="pf-v6-u-display-flex">
        <Content className="pf-v6-u-display-flex pf-v6-u-flex-direction-column pf-v6-u-align-self-stretch">
          <Content component={ContentVariants.p} className="pf-v6-u-flex-grow-1">
            {body}
          </Content>
          <Content component={ContentVariants.p}>
            <Link to={link} target="_blank">
              Learn more
              <Icon className="pf-v6-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            </Link>
          </Content>
        </Content>
      </CardBody>
    </Card>
  );
};

export const IntegrationsEmptyState: React.FunctionComponent<{
  onAddIntegration: (() => void) | undefined;
}> = ({ onAddIntegration }) => {
  const { isOrgAdmin } = useAppContext();
  return (
    <div className="pf-v6-l-flex pf-m-justify-content-center">
      <EmptyState
        headingLevel={ContentVariants.h4}
        icon={CubesIcon}
        titleText="No integrations yet"
      >
        <EmptyStateBody>
          <Gallery
            aria-label="Card container"
            minWidths={{ default: '100%', md: isOrgAdmin ? '30%' : '40%' }}
            hasGutter
            className="pf-v6-u-text-align-left"
          >
            <EmptyIntegrationCard
              isOrgAdmin={isOrgAdmin}
              TitleIcon={HelpIcon}
              title="Why integrate?"
              body="Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard."
              link="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-manage_alerts_preferred_platform"
            />
            <EmptyIntegrationCard
              isOrgAdmin={isOrgAdmin}
              TitleIcon={CogIcon}
              title="Configure applications"
              body="To prepare for integration with the Hybrid Cloud Console, you must configure incoming webhooks in your third-party applications."
              link="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/observe-configure_notifications_hcc_services"
            />
            {isOrgAdmin && (
              <EmptyIntegrationCard
                isOrgAdmin={isOrgAdmin}
                TitleIcon={InfrastructureIcon}
                title="Create behavior groups"
                body="A behavior group defines which notifications will be sent to external services when a specific event is received by the notifications service. You can link events from any Hybrid Cloud Console service to your behavior group."
                link="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/observe-configure_notifications_hcc_services"
              />
            )}
          </Gallery>
        </EmptyStateBody>
        <EmptyStateFooter>
          <Button
            variant={ButtonVariant.primary}
            component="a"
            disabled={!onAddIntegration}
            onClick={() => (onAddIntegration ? onAddIntegration() : null)}
          >
            {Messages.components.integrations.toolbar.actions.addIntegration}
          </Button>
        </EmptyStateFooter>
      </EmptyState>
    </div>
  );
};
