import React, { useEffect } from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
  Tab,
  TabTitleText,
  Tabs,
  Title,
} from '@patternfly/react-core';
import {
  EventTypes,
  useDataViewEventsContext,
} from '@patternfly/react-data-view';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import EllipsisVIcon from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import IntegrationDetails from './IntegrationDetails';
import { IntegrationRow } from './Table';
import messages from '../../properties/DefinedMessages';
import { useIntl } from 'react-intl';

const ActionDropdown: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const intl = useIntl();

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      popperProps={{ position: 'right', enableFlip: true }}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>
        <DropdownItem
          value={0}
          key="action"
          description={intl.formatMessage(messages.pauseDescription)}
        >
          {intl.formatMessage(messages.integrationdropdownPause)}
        </DropdownItem>
        <DropdownItem
          value={1}
          key="action"
          to="#default-link2"
          description={intl.formatMessage(messages.removeDescription)}
        >
          {intl.formatMessage(messages.integrationdropdownRemove)}
        </DropdownItem>
        <DropdownItem value={2} key="action" to="#default-link3">
          {intl.formatMessage(messages.integrationdropdownEdit)}
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

interface IntegrationsDrawerProps {
  selectedIntegration?: IntegrationRow;
  setSelectedIntegration: React.Dispatch<
    React.SetStateAction<IntegrationRow | undefined>
  >;
}

const ouiaId = 'IntegrationsTable';

const IntegrationsDrawer: React.FunctionComponent<IntegrationsDrawerProps> = ({
  selectedIntegration,
  setSelectedIntegration,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const intl = useIntl();

  const context = useDataViewEventsContext();

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  useEffect(() => {
    const unsubscribe = context.subscribe(
      EventTypes.rowClick,
      (integration: IntegrationRow) => {
        setSelectedIntegration(integration);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <DrawerPanelContent>
      <DrawerHead>
        <Title
          className="pf-v5-u-mb-md"
          headingLevel="h2"
          ouiaId={`${ouiaId}-drawer-title`}
        >
          {selectedIntegration?.name}
        </Title>
        <DrawerActions>
          <ActionDropdown />
          <DrawerCloseButton
            onClick={() => setSelectedIntegration(undefined)}
            data-ouia-component-id={`${ouiaId}-drawer-close-button`}
          />
        </DrawerActions>
      </DrawerHead>
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTabClick}
        ouiaId={`${ouiaId}-drawer-tabs`}
      >
        <Tab
          eventKey={0}
          title={
            <TabTitleText>
              {intl.formatMessage(messages.integrationDetailsTabTitle)}
            </TabTitleText>
          }
          ouiaId={`${ouiaId}-details-tab`}
        >
          <IntegrationDetails integration={selectedIntegration} />
        </Tab>
        <Tab
          eventKey={1}
          title={
            <TabTitleText>
              {intl.formatMessage(messages.associatedEventTypesTabTitle)}
            </TabTitleText>
          }
          ouiaId={`${ouiaId}-associated-event-types-tab`}
        >
          hi
        </Tab>
      </Tabs>
    </DrawerPanelContent>
  );
};

export default IntegrationsDrawer;
