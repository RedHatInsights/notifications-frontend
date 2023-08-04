import {
    Button,
    DataListAction,
    DataListCell,
    DataListContent,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    DataListToggle,
    Divider,
    Flex,
    FlexItem,
    Icon,
    Title
} from '@patternfly/react-core';
import { BellIcon, IntegrationIcon, RunningIcon, UserIcon, UsersIcon } from '@patternfly/react-icons';
import React from 'react';

export enum IconName {
  USER = 'user',
  RUNNING = 'running',
  INTEGRATION = 'integration',
  USERS = 'users',
  BELL = 'bell'
}

interface CustomDataListItemProps {
  icon: IconName;
  heading: string;
  linkTitle?: string;
  linkTarget?: string;
  expandableContent: string;
}

const CustomDataListItem: React.FC<CustomDataListItemProps> = ({ icon, heading, linkTitle, linkTarget, expandableContent }) => {
    let iconElement: React.ReactNode = null;
    const [ expanded, setExpanded ] = React.useState(false);

    switch (icon) {
        case IconName.USER:
            iconElement = <UserIcon className='pf-u-primary-color-100' />;
            break;
        case IconName.RUNNING:
            iconElement = <RunningIcon className='pf-u-primary-color-100' />;
            break;
        case IconName.INTEGRATION:
            iconElement = <IntegrationIcon className='pf-u-primary-color-100' />;
            break;
        case IconName.USERS:
            iconElement = <UsersIcon className='pf-u-primary-color-100' />;
            break;
        case IconName.BELL:
            iconElement = <BellIcon className='pf-u-primary-color-100' />;
            break;
        default:
            break;
    }

    return (
        <React.Fragment>
            <DataListItem aria-labelledby="item1" isExpanded={ expanded }>
                <DataListItemRow className='pf-u-align-items-center'>
                    <DataListToggle
                        isExpanded={ expanded }
                        id="toggle1"
                        aria-controls="expand1"
                        onClick={ () => setExpanded(!expanded) }
                    />
                    <DataListItemCells
                        dataListCells={ [
                            <DataListCell key={ 'cell-' + icon.toString().toLowerCase() }>
                                <div>
                                    <Flex className='pf-u-flex-nowrap'>
                                        <FlexItem className='pf-u-align-self-center'>
                                            <Icon size="lg">
                                                {iconElement}
                                            </Icon>
                                        </FlexItem>
                                        <Divider
                                            orientation={ {
                                                default: 'vertical'
                                            } }
                                        />
                                        <FlexItem className='pf-u-align-self-center'>
                                            <Title headingLevel="h4">{heading}</Title>
                                        </FlexItem>
                                    </Flex>
                                </div>
                            </DataListCell>
                        ] }
                    />
                    {linkTitle && linkTarget &&
                        <DataListAction
                            aria-labelledby="item1 action1"
                            id="action1"
                            aria-label="Actions"
                            isPlainButtonAction
                        >
                            <Button component="a" href={ linkTarget } variant="link">
                                {linkTitle}
                            </Button>
                        </DataListAction>
                    }
                </DataListItemRow>
                <DataListContent aria-label={ heading + ' - Detailed Explanation' } id="expand1" isHidden={ !expanded }>
                    <p>{expandableContent}</p>
                </DataListContent>
            </DataListItem>
        </React.Fragment>
    );
};

export default CustomDataListItem;
