import axios from 'axios';

import { RHSM_UTILIZATION_API_BASE } from '../../constants';
import { ORG_PREFERENCES_TIMEOUT } from '../../../components/Notifications/constants';

export interface OrgPreferencesResponse {
  custom_threshold: number;
  last_modified?: string;
}

export async function fetchOrgPreferences(): Promise<OrgPreferencesResponse> {
  const response = await axios.get<OrgPreferencesResponse>(
    `${RHSM_UTILIZATION_API_BASE}/org-preferences`,
    { timeout: ORG_PREFERENCES_TIMEOUT }
  );
  return response.data;
}

export async function saveOrgPreferences(customThreshold: number): Promise<OrgPreferencesResponse> {
  const response = await axios.post<OrgPreferencesResponse>(
    `${RHSM_UTILIZATION_API_BASE}/org-preferences`,
    { custom_threshold: customThreshold },
    { timeout: ORG_PREFERENCES_TIMEOUT }
  );
  return response.data;
}
