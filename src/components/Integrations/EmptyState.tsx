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

import { Link } from 'react-router-dom';
import { useAppContext } from '../../app/AppContext';
import { SVGIconProps } from '@patternfly/react-icons/dist/js/createIcon';
import { defineMessages, useIntl } from 'react-intl';

const WIDTH_30 = '30%';
const EXTEND_ALERTS_DOC =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-manage_alerts_preferred_platform';
const OBSERVE_CONFIGURE_DOC =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/observe-configure_notifications_hcc_services';
const WIDTH_40 = '40%';

const messages = defineMessages({
  noIntegrations: {
    id: 'integrations.emptyState.noIntegrations',
    defaultMessage: 'No integrations yet',
  },
  cardContainerAria: {
    id: 'integrations.emptyState.cardContainerAria',
    defaultMessage: 'Card container',
  },
  learnMore: {
    id: 'integrations.emptyState.learnMore',
    defaultMessage: 'Learn more',
  },
  whyIntegrate: {
    id: 'integrations.emptyState.whyIntegrate',
    defaultMessage: 'Why integrate?',
  },
  whyIntegrateBody: {
    id: 'integrations.emptyState.whyIntegrateBody',
    defaultMessage:
      'Integrating third-party applications expands the scope of notifications beyond emails and messages, so that you can view and manage Hybrid Cloud Console events from your preferred platform dashboard.',
  },
  configureApplications: {
    id: 'integrations.emptyState.configureApplications',
    defaultMessage: 'Configure applications',
  },
  configureApplicationsBody: {
    id: 'integrations.emptyState.configureApplicationsBody',
    defaultMessage:
      'To prepare for integration with the Hybrid Cloud Console, you must configure incoming webhooks in your third-party applications.',
  },
  createBehaviorGroups: {
    id: 'integrations.emptyState.createBehaviorGroups',
    defaultMessage: 'Create behavior groups',
  },
  createBehaviorGroupsBody: {
    id: 'integrations.emptyState.createBehaviorGroupsBody',
    defaultMessage:
      'A behavior group defines which notifications will be sent to external services when a specific event is received by the notifications service. You can link events from any Hybrid Cloud Console service to your behavior group.',
  },
  addIntegration: {
    id: 'integrations.emptyState.addIntegration',
    defaultMessage: 'Add integration',
  },
});

const EmptyIntegrationCard: React.FunctionComponent<{
  TitleIcon: React.ComponentClass<SVGIconProps, unknown>;
  title: string;
  body: string;
  link: string;
  isOrgAdmin: boolean;
}> = ({ TitleIcon, title, body, link, isOrgAdmin }) => {
  const intl = useIntl();
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
              {intl.formatMessage(messages.learnMore)}
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
  const intl = useIntl();
  return (
    <div className="pf-v6-l-flex pf-m-justify-content-center">
      <EmptyState
        headingLevel={ContentVariants.h4}
        icon={CubesIcon}
        titleText={intl.formatMessage(messages.noIntegrations)}
      >
        <EmptyStateBody>
          <Gallery
            aria-label={intl.formatMessage(messages.cardContainerAria)}
            minWidths={{ default: '100%', md: isOrgAdmin ? WIDTH_30 : WIDTH_40 }}
            hasGutter
            className="pf-v6-u-text-align-left"
          >
            <EmptyIntegrationCard
              isOrgAdmin={isOrgAdmin}
              TitleIcon={HelpIcon}
              title={intl.formatMessage(messages.whyIntegrate)}
              body={intl.formatMessage(messages.whyIntegrateBody)}
              link={EXTEND_ALERTS_DOC}
            />
            <EmptyIntegrationCard
              isOrgAdmin={isOrgAdmin}
              TitleIcon={CogIcon}
              title={intl.formatMessage(messages.configureApplications)}
              body={intl.formatMessage(messages.configureApplicationsBody)}
              link={OBSERVE_CONFIGURE_DOC}
            />
            {isOrgAdmin && (
              <EmptyIntegrationCard
                isOrgAdmin={isOrgAdmin}
                TitleIcon={InfrastructureIcon}
                title={intl.formatMessage(messages.createBehaviorGroups)}
                body={intl.formatMessage(messages.createBehaviorGroupsBody)}
                link={OBSERVE_CONFIGURE_DOC}
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
            {intl.formatMessage(messages.addIntegration)}
          </Button>
        </EmptyStateFooter>
      </EmptyState>
    </div>
  );
};
