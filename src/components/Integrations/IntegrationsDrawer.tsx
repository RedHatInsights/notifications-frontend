import React from 'react';
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
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons';
import IntegrationDetails from './IntegrationDetails';
import { IntegrationRow } from './Table';
import messages from '../../properties/DefinedMessages';
import { useIntl } from 'react-intl';
import { IAction } from '@patternfly/react-table';

type ResolvedActions = (Omit<IAction, 'onClick'> & {
  onClick?: (event?: React.MouseEvent) => void;
})[];

const ActionDropdown: React.FunctionComponent<{
  actionResolver: (row: IntegrationRow, index: number) => ResolvedActions;
  integration: IntegrationRow;
  index: number;
}> = ({ actionResolver, index, integration }) => {
  const actions = actionResolver(integration, index);
  const [isOpen, setIsOpen] = React.useState(false);

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
        {actions.map((item, key) => (
          <DropdownItem
            key={key}
            value={key}
            description={item.description}
            onClick={() => item?.onClick?.()}
          >
            {item.title}
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  );
};

interface IntegrationsDrawerProps {
  actionResolver: (row: IntegrationRow, index: number) => ResolvedActions;
  selectedIndex?: number;
  selectedIntegration?: IntegrationRow;
  setSelectedIntegration: React.Dispatch<
    React.SetStateAction<IntegrationRow | undefined>
  >;
}

const ouiaId = 'IntegrationsTable';

const IntegrationsDrawer: React.FunctionComponent<IntegrationsDrawerProps> = ({
  actionResolver,
  selectedIndex,
  selectedIntegration,
  setSelectedIntegration,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const intl = useIntl();

  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

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
          {selectedIndex !== undefined && selectedIntegration && (
            <ActionDropdown
              actionResolver={actionResolver}
              integration={selectedIntegration}
              index={selectedIndex}
            />
          )}
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
        ></Tab>
      </Tabs>
    </DrawerPanelContent>
  );
};

export default IntegrationsDrawer;
