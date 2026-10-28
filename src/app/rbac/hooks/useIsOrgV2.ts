import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { useEffect, useState } from 'react';
import type { ChromeAPI } from '@redhat-cloud-services/types';

/**
 * `isKesselOrgOnboarded` is implemented by insights-chrome (VisibilitySingleton) but not yet
 * declared in `@redhat-cloud-services/types`. Extend locally until the types catch up.
 */
type ChromeWithVisibilityFunctions = ChromeAPI & {
  visibilityFunctions?: {
    isKesselOrgOnboarded?: (expected: boolean) => Promise<boolean>;
  };
};

/**
 * Tri-state org V2 detection.
 *
 * - `undefined` — detection pending (or chrome API unavailable and flag unresolved)
 * - `true` — the org is opted into RBAC v2 (Kessel)
 * - `false` — the org is v1
 */
export type IsOrgV2 = boolean | undefined;

/**
 * Whether the current org is onboarded to RBAC v2.
 *
 * Uses Chrome's `isKesselOrgOnboarded` visibility function, backed by
 * `GET /api/rbac/v1/tenant/opt-in/` (`{ v2_opted_in: boolean }`) with a
 * 120s identity-scoped cache — Chrome fetches it at page load, so this
 * does not add a request in the common case.
 *
 * Semantics (see insights-chrome `VisibilitySingleton`):
 * - ITLess (FedRAMP): returns `false` — orgs there are v1.
 * - Request failure: returns `false`. Pending state is tracked separately
 *   here so callers can distinguish "not decided yet" from "decided v1".
 *
 * Fallback: when Chrome does not expose `visibilityFunctions` (older chrome
 * build, test harnesses), the environment-level `platform.chrome.kessel`
 * flag is used, preserving the previous behavior.
 */
export const useIsOrgV2 = (): IsOrgV2 => {
  // `useChrome`'s declared return type does not narrow with a type argument, hence the cast.
  const chrome = useChrome() as ChromeWithVisibilityFunctions;
  const visibilityFunctions = chrome?.visibilityFunctions;
  const isKesselOrgOnboarded = visibilityFunctions?.isKesselOrgOnboarded;
  const hasOnboardedCheck = typeof isKesselOrgOnboarded === 'function';

  const envFlagFallback = useFlag('platform.chrome.kessel');
  const [orgOptedIn, setOrgOptedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!hasOnboardedCheck) {
      return;
    }

    let cancelled = false;
    isKesselOrgOnboarded!(true)
      .then((optedIn: boolean) => {
        if (!cancelled) {
          setOrgOptedIn(optedIn);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrgOptedIn(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // Chrome object is changed when the user is changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOnboardedCheck]);

  if (hasOnboardedCheck) {
    return orgOptedIn;
  }

  return envFlagFallback;
};
