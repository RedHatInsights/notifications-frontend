import { Alert, AlertActionCloseButton, AlertActionLink } from '@patternfly/react-core';
import { global_spacer_xl } from '@patternfly/react-tokens';
import { Section } from '@redhat-cloud-services/frontend-components';
import { BetaIfNot, getInsights, InsightsBetaDetector, localUrl } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

const bannerSectionClassname = style({
    marginBottom: global_spacer_xl.var
});

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
                <Section className={ bannerSectionClassname }>
                    <Alert
                        title="Splunk and ServiceNow integration is available in our Beta environment"
                        actionClose={ <AlertActionCloseButton onClose={ close } /> }
                        isInline
                        actionLinks={ <>
                            <AlertActionLink onClick={ goToBeta }>Go to Integration beta</AlertActionLink>
                        </> }
                    >
                        <p>
                            Set up a Splunk and ServiceNow integration on console.redhat.com/beta.
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
                </Section>
            </BetaIfNot>
        </InsightsBetaDetector>
    );
};
