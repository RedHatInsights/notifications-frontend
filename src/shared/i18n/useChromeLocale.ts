import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

/**
 * The console language, resolved by Chrome's language detection flow
 * (RHCLOUD-52203) and exposed on the chrome API. Consumers never implement
 * fallback logic themselves: while the property is undefined we render
 * English (defaultMessage) with the locale left to the provider's default.
 *
 * TODO: drop the cast when frontend-components types gain `language`.
 */
export function useChromeLocale(): string {
  const chrome = useChrome() as { language?: string } | undefined;
  return chrome?.language ?? 'en';
}
