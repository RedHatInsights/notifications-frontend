import {
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  NumberInput,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../../types/Notification';
import messages from '../messages';

interface ThresholdConfigCellProps {
  notification: NotificationBehaviorGroup;
  behaviorGroupContent: BehaviorGroupContent;
  selected: ReadonlyArray<BehaviorGroup>;
  onSelect?: (
    notification: NotificationBehaviorGroup,
    behaviorGroup: BehaviorGroup,
    linkBehavior: boolean
  ) => void;
  isEditMode: boolean;
  thresholdValue: number;
  onThresholdChange?: (value: number) => void;
}

export const ThresholdConfigCell: React.FunctionComponent<ThresholdConfigCellProps> = (props) => {
  const intl = useIntl();
  const [localThreshold, setLocalThreshold] = React.useState(props.thresholdValue);

  React.useEffect(() => {
    setLocalThreshold(props.thresholdValue);
  }, [props.thresholdValue]);

  const handleMinus = () => {
    const newValue = Math.max(0, localThreshold - 1);
    setLocalThreshold(newValue);
    props.onThresholdChange?.(newValue);
  };

  const handlePlus = () => {
    const newValue = Math.min(100, localThreshold + 1);
    setLocalThreshold(newValue);
    props.onThresholdChange?.(newValue);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = Number((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setLocalThreshold(value);
      props.onThresholdChange?.(value);
    }
  };

  const onRemoveChip = React.useCallback(
    (behaviorGroup: BehaviorGroup) => {
      const onSelect = props.onSelect;
      if (onSelect) {
        onSelect(props.notification, behaviorGroup, false);
      }
    },
    [props.onSelect, props.notification]
  );

  const sortedSelected = React.useMemo(
    () => [
      ...props.selected.filter((b) => b.isDefault),
      ...props.selected.filter((b) => !b.isDefault),
    ],
    [props.selected]
  );

  if (!props.isEditMode) {
    // Read-only view
    return (
      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <LockIcon className="pf-v6-u-mr-sm" />
          {localThreshold} % {intl.formatMessage(messages.ofUsageThreshold)}
        </FlexItem>
        {sortedSelected.length > 0 && (
          <FlexItem>
            <LabelGroup>
              {sortedSelected.map((value) => (
                <Label key={value.id} isCompact>
                  {value.displayName}
                </Label>
              ))}
            </LabelGroup>
          </FlexItem>
        )}
      </Flex>
    );
  }

  // Edit mode
  return (
    <Stack hasGutter>
      <StackItem>
        <span className="pf-v6-u-mr-sm">{intl.formatMessage(messages.usageThreshold)}</span>
        <NumberInput
          value={localThreshold}
          min={0}
          max={100}
          onMinus={handleMinus}
          onPlus={handlePlus}
          onChange={handleChange}
          inputName="threshold-input"
          inputAriaLabel={intl.formatMessage(messages.usageThresholdPercentage)}
          minusBtnAriaLabel={intl.formatMessage(messages.decreaseThreshold)}
          plusBtnAriaLabel={intl.formatMessage(messages.increaseThreshold)}
          widthChars={4}
          unit="%"
        />
      </StackItem>
      {sortedSelected.length > 0 && (
        <StackItem>
          <LabelGroup>
            {sortedSelected.map((value) => (
              <Label key={value.id} variant="outline" onClose={() => onRemoveChip(value)} isCompact>
                {value.displayName}
              </Label>
            ))}
          </LabelGroup>
        </StackItem>
      )}
    </Stack>
  );
};
