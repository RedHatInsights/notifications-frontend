import { Alert, AlertActionCloseButton, AlertActionLink } from '@patternfly/react-core';
import { BetaIfNot, getInsights, InsightsBetaDetector, localUrl } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

export const SplunkBetaEnvironmentBanner: React.FunctionComponent = () => {
    const [ isOpen, setOpen ] = React.useState(true);
    const insights = getInsights();

    const close = () => setOpen(false);
    const goToBeta = () => {
        window.location.href = localUrl('/settings/integrations', true);
    };

    if (!isOpen) {
        return <></>;
    }

    return (
        <InsightsBetaDetector insights={ insights }>
            <BetaIfNot>
                <Alert
                    title="Splunk integration is available in our Beta environment"
                    actionClose={ <AlertActionCloseButton onClose={ close } /> }
                    isInline
                    actionLinks={ <>
                        <AlertActionLink onClick={ goToBeta }>Go to Integration beta</AlertActionLink>
                    </> }
                >
                    <p>
                        Set up a Splunk integration on cloud.redhat.com/beta.
                        The Beta Environment allows you to interact with new features in an active development space.
                    </p>
                    <p>
                        Because beta pre-release software is still being developed, you may encounter bugs or flaws in availability,
                        stability, data or performance.
                    </p>
                    <p>
                        After you use a feature in beta, you&apos;ll stay in the Beta Environment until you manually exit the beta release.
                        Leave the Beta Environment any time by clicking on the settings (gear) icon or beta icon in the top toolbar.
                    </p>
                </Alert>
            </BetaIfNot>
        </InsightsBetaDetector>
    );
};
