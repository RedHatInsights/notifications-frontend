import { render } from '@testing-library/react';
import React from 'react';

import { DrawerSingleton } from '../DrawerSingleton';

let mockFlagValue = false;
jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: () => mockFlagValue,
}));

type MockPermissions = { hasPermissions: boolean | undefined; isAdmin: boolean | undefined };

const pending = (): MockPermissions => ({ hasPermissions: undefined, isAdmin: undefined });
const granted = (hasPermissions: boolean, isAdmin = hasPermissions): MockPermissions => ({
  hasPermissions,
  isAdmin,
});

let mockV1Value: MockPermissions;
let mockV2Value: MockPermissions;

jest.mock('../../../hooks/useHasNotificationsPermissions', () => ({
  useV1HasNotificationsPermissions: () => mockV1Value,
  useV2HasNotificationsPermissions: () => mockV2Value,
}));

const setSpy = jest.spyOn(DrawerSingleton.Instance, 'setHasNotificationsPermissions');
const setAdminSpy = jest.spyOn(DrawerSingleton.Instance, 'setIsNotificationsAdmin');

import DrawerPermissionsSync from '../DrawerPermissionsSync';

beforeEach(() => {
  mockFlagValue = false;
  mockV1Value = pending();
  mockV2Value = pending();
  setSpy.mockClear();
  setAdminSpy.mockClear();
});

describe('DrawerPermissionsSync', () => {
  it('syncs v1 permissions when kessel is disabled', () => {
    mockV1Value = granted(true);
    render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(true);
  });

  it('syncs v2 permissions when kessel is enabled', () => {
    mockFlagValue = true;
    mockV2Value = granted(false);
    render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(false);
  });

  it('does not sync when permissions are undefined', () => {
    mockV1Value = pending();
    render(<DrawerPermissionsSync />);
    expect(setSpy).not.toHaveBeenCalled();
  });

  it('transitions from v1 to v2 on flag change', () => {
    mockV1Value = granted(true);
    mockV2Value = granted(false);

    const { rerender } = render(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(true);
    setSpy.mockClear();

    mockFlagValue = true;
    rerender(<DrawerPermissionsSync />);
    expect(setSpy).toHaveBeenCalledWith(false);
  });

  describe('admin flag', () => {
    it('syncs admin true for a user with write access', () => {
      mockV1Value = granted(true, true);
      render(<DrawerPermissionsSync />);
      expect(setAdminSpy).toHaveBeenCalledWith(true);
    });

    it('syncs admin false for a read-only user who still has drawer permissions', () => {
      mockV1Value = granted(true, false);
      render(<DrawerPermissionsSync />);
      expect(setSpy).toHaveBeenCalledWith(true);
      expect(setAdminSpy).toHaveBeenCalledWith(false);
    });

    it('syncs the pending undefined so the bell can tell loading from denied', () => {
      mockV1Value = pending();
      render(<DrawerPermissionsSync />);
      expect(setAdminSpy).toHaveBeenCalledWith(undefined);
    });
  });
});
