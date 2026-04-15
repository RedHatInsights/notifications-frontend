import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Icon,
  Title,
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
import { EnvelopeIcon } from '@patternfly/react-icons';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React, { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppContext } from '../../app/AppContext';
import { triggerDailyDigest } from '../../api/helpers/notifications/daily-digest-trigger-helper';
import { useNotification } from '../../utils/AlertUtils';

type TriggerStatus = 'idle' | 'loading' | 'success' | 'error';

const STAGE_ENVIRONMENTS = ['stage', 'stage-beta'];

export const DailyDigestTrigger: React.FunctionComponent = () => {
  const { getEnvironment } = useChrome();
  const { isOrgAdmin } = useAppContext();
  const intl = useIntl();
  const { addSuccessNotification, addDangerNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<TriggerStatus>('idle');

  const isStage = STAGE_ENVIRONMENTS.includes(getEnvironment());

  const handleTrigger = useCallback(async () => {
    setStatus('loading');
    setIsModalOpen(false);

    try {
      await triggerDailyDigest();
      setStatus('success');
      addSuccessNotification(
        intl.formatMessage({
          id: 'dailyDigestTrigger.success',
          defaultMessage: 'Daily digest triggered successfully',
        })
      );
    } catch {
      setStatus('error');
      addDangerNotification(
        intl.formatMessage({
          id: 'dailyDigestTrigger.error',
          defaultMessage: 'Failed to trigger daily digest',
        })
      );
    }
  }, [addSuccessNotification, addDangerNotification, intl]);

  if (!isStage || !isOrgAdmin) {
    return null;
  }

  return (
    <>
      <Card className="pf-v5-u-mb-lg" data-testid="daily-digest-trigger-card">
        <CardTitle>
          <Flex className="pf-v5-u-flex-nowrap">
            <FlexItem>
              <Icon size="lg">
                <EnvelopeIcon className="pf-v5-u-primary-color-100" />
              </Icon>
            </FlexItem>
            <FlexItem>
              <Title headingLevel="h2">
                <FormattedMessage
                  id="dailyDigestTrigger.title"
                  defaultMessage="Trigger daily digest"
                />
              </Title>
            </FlexItem>
          </Flex>
        </CardTitle>
        <CardBody>
          <Content component={ContentVariants.p} className="pf-v5-u-mb-md">
            <FormattedMessage
              id="dailyDigestTrigger.description"
              defaultMessage="Manually trigger the daily digest email for your organization. This is only available in stage environments for testing purposes."
            />
          </Content>
          {status === 'success' && (
            <Alert
              variant="success"
              isInline
              title={intl.formatMessage({
                id: 'dailyDigestTrigger.successAlert',
                defaultMessage: 'Daily digest has been triggered. Emails will be sent shortly.',
              })}
              className="pf-v5-u-mb-md"
              data-testid="daily-digest-trigger-success"
            />
          )}
          {status === 'error' && (
            <Alert
              variant="danger"
              isInline
              title={intl.formatMessage({
                id: 'dailyDigestTrigger.errorAlert',
                defaultMessage: 'Failed to trigger daily digest. Please try again later.',
              })}
              className="pf-v5-u-mb-md"
              data-testid="daily-digest-trigger-error"
            />
          )}
          <Button
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
            isDisabled={status === 'loading'}
            isLoading={status === 'loading'}
            data-testid="daily-digest-trigger-button"
          >
            {status === 'loading' ? (
              <FormattedMessage id="dailyDigestTrigger.triggering" defaultMessage="Triggering..." />
            ) : (
              <FormattedMessage
                id="dailyDigestTrigger.triggerButton"
                defaultMessage="Trigger daily digest"
              />
            )}
          </Button>
        </CardBody>
      </Card>
      <Modal
        variant={ModalVariant.small}
        title={intl.formatMessage({
          id: 'dailyDigestTrigger.confirmTitle',
          defaultMessage: 'Trigger daily digest?',
        })}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={handleTrigger}
            data-testid="daily-digest-trigger-confirm"
          >
            <FormattedMessage id="dailyDigestTrigger.confirm" defaultMessage="Trigger" />
          </Button>,
          <Button key="cancel" variant="link" onClick={() => setIsModalOpen(false)}>
            <FormattedMessage id="dailyDigestTrigger.cancel" defaultMessage="Cancel" />
          </Button>,
        ]}
        ouiaId="DailyDigestTriggerModal"
      >
        <FormattedMessage
          id="dailyDigestTrigger.confirmBody"
          defaultMessage="This will send a daily digest email to all users in your organization who have opted in. Are you sure you want to proceed?"
        />
      </Modal>
    </>
  );
};

export default DailyDigestTrigger;
