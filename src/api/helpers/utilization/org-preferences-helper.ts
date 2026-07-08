import axios from 'axios';

const API_BASE = '/api/rhsm-subscriptions/v1/utilization';

interface OrgPreferencesResponse {
  custom_threshold: number;
  last_modified?: string;
}

export async function fetchOrgPreferences(): Promise<OrgPreferencesResponse> {
  const response = await axios.get<OrgPreferencesResponse>(`${API_BASE}/org-preferences`);
  return response.data;
}

export async function saveOrgPreferences(customThreshold: number): Promise<OrgPreferencesResponse> {
  const response = await axios.post<OrgPreferencesResponse>(`${API_BASE}/org-preferences`, {
    custom_threshold: customThreshold,
  });
  return response.data;
}
