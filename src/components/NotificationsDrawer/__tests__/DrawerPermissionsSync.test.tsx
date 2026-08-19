import { render } from '@testing-library/react';
import React from 'react';

import { DrawerSingleton } from '../DrawerSingleton';

let mockFlagValue = false;
jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: () => mockFlagValue,
}));

let mockV1Value: boolean | undefined;
let mockV2Value: boolean | undefined;

jest.mock('../../../hooks/useHasNotificationsPermissions', () => ({
  useV1HasNotificationsPermissions: () => mockV1Value,
  useV2HasNotificationsPermissions: () => mockV2Value,
}));

const setSpy = jest.spyOn(DrawerSingleton.Instance, 'setHasNotificationsPermissions');

import DrawerPermissionsSync from '../DrawerPermissionsSync';

beforeEach(() => {
  mockFlagValue = false;
  mockV1Value = undefined;
  mockV2Value = undefined;
  setSpy.mockClear();
});

describe('DrawerPermissionsSync', () => {
  it('syncs v1 permissions when kessel is disabled', () => {
    mockV1Value = true;
    render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(true);
  });

  it('syncs v2 permissions when kessel is enabled', () => {
    mockFlagValue = true;
    mockV2Value = false;
    render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(false);
  });

  it('does not sync when permissions are undefined', () => {
    mockV1Value = undefined;
    render(<DrawerPermissionsSync />);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('transitions from v1 to v2 on flag change', () => {
    mockV1Value = true;
    mockV2Value = false;

    const { rerender } = render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(true);
    setSpy.mockClear();

    mockFlagValue = true;
    rerender(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(false);
  });
});
