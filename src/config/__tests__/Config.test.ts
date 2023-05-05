import { localUrl } from '@redhat-cloud-services/insights-common-typescript';

import { sortedIntegrationList, withBaseUrl } from '../Config';
import { IntegrationType } from '../../types/Integration';

describe('src/config/Config', () => {

    it('withBaseUrl appends the baseUrl to the passed path', () => {
        expect(withBaseUrl('/foo/bar')).toBe('/api/notifications/v1.0/foo/bar');
    });

    it('localUrl does prepend beta to path if running on beta', () => {
        expect(localUrl('/foo/bar', true)).toBe('/preview/foo/bar');
    });

    it('localUrl does not prepend beta to path when not in beta', () => {
        expect(localUrl('/baz/bar', false)).toBe('/baz/bar');
    });
    it('sortedIntegrationList sorts the integrations in alphabetical order', () => {
        expect(sortedIntegrationList([
            IntegrationType.SLACK,
            IntegrationType.ANSIBLE,
            IntegrationType.WEBHOOK,
            IntegrationType.SPLUNK
        ])).toEqual([
            IntegrationType.ANSIBLE,
            IntegrationType.SLACK,
            IntegrationType.SPLUNK,
            IntegrationType.WEBHOOK
        ]);
    });
});
