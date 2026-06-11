import { hasV1DrawerNotificationsPermissions } from '../drawerNotificationsPermissions';

describe('hasV1DrawerNotificationsPermissions', () => {
  it('returns true for read permission', () => {
    expect(
      hasV1DrawerNotificationsPermissions([
        { permission: 'notifications:notifications:read', resourceDefinitions: [] },
      ])
    ).toBe(true);
  });

  it('returns true for write permission', () => {
    expect(
      hasV1DrawerNotificationsPermissions([
        { permission: 'notifications:notifications:write', resourceDefinitions: [] },
      ])
    ).toBe(true);
  });

  it('returns true for wildcard permission', () => {
    expect(
      hasV1DrawerNotificationsPermissions([
        { permission: 'notifications:*:*', resourceDefinitions: [] },
      ])
    ).toBe(true);
  });

  it('returns false for unrelated permissions', () => {
    expect(
      hasV1DrawerNotificationsPermissions([
        { permission: 'notifications:events:read', resourceDefinitions: [] },
      ])
    ).toBe(false);
  });

  it('returns false when permissions are empty', () => {
    expect(hasV1DrawerNotificationsPermissions([])).toBe(false);
    expect(hasV1DrawerNotificationsPermissions(undefined)).toBe(false);
  });
});
