import { defineMessages } from 'react-intl';

export default defineMessages({
  // Threshold configuration
  ofUsageThreshold: {
    id: 'notifications.threshold.ofUsageThreshold',
    description: 'Label suffix for threshold percentage display',
    defaultMessage: 'of usage threshold',
  },
  usageThreshold: {
    id: 'notifications.threshold.usageThreshold',
    description: 'Label for usage threshold input',
    defaultMessage: 'Usage threshold',
  },
  usageThresholdPercentage: {
    id: 'notifications.threshold.usageThresholdPercentage',
    description: 'Aria label for usage threshold percentage input',
    defaultMessage: 'Usage threshold percentage',
  },
  decreaseThreshold: {
    id: 'notifications.threshold.decreaseThreshold',
    description: 'Aria label for decrease threshold button',
    defaultMessage: 'Decrease threshold',
  },
  increaseThreshold: {
    id: 'notifications.threshold.increaseThreshold',
    description: 'Aria label for increase threshold button',
    defaultMessage: 'Increase threshold',
  },

  // Behavior group configuration
  loading: {
    id: 'notifications.behaviorGroup.loading',
    description: 'Loading state message',
    defaultMessage: 'Loading',
  },
  noBehaviorGroups: {
    id: 'notifications.behaviorGroup.noBehaviorGroups',
    description: 'Message when no behavior groups exist',
    defaultMessage:
      "You have no behavior groups. Create a new group by clicking on the 'Create new group' button above.",
  },
  selectBehaviorGroup: {
    id: 'notifications.behaviorGroup.selectBehaviorGroup',
    description: 'Placeholder text for behavior group selection',
    defaultMessage: 'Select behavior group',
  },
  mute: {
    id: 'notifications.behaviorGroup.mute',
    description: 'Label for muted notification state',
    defaultMessage: 'Mute',
  },
  defaultBehaviorTooltip: {
    id: 'notifications.behaviorGroup.defaultBehaviorTooltip',
    description: 'Tooltip for default behavior groups that cannot be changed',
    defaultMessage:
      '{displayName} behavior is attached to this event and cannot be changed. Add additional behavior groups to assign different actions or recipients.',
  },
});
