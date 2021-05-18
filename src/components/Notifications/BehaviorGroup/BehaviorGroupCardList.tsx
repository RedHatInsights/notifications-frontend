import { Flex, FlexItem } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { BehaviorGroupCard, BehaviorGroupCardSkeleton } from './BehaviorGroupCard';

const cardsWrapperClassName = style({
    overflow: 'auto'
});

const cardWrapperClassName = style({
    paddingBottom: global_spacer_md.var
});

interface BehaviorGroupCardListProps {
    onEdit: (behaviorGroup: BehaviorGroup) => void;
    behaviorGroups: ReadonlyArray<BehaviorGroup>;
}

interface BehaviorGroupCardListLayoutProps {
    contents: Array<{
        key: string;
        element: React.ReactNode;
    }>;
}

const BehaviorGroupCardListLayout: React.FunctionComponent<BehaviorGroupCardListLayoutProps> = props => {
    const ref = React.useCallback(container => {
        if (container?.firstChild?.firstChild) {
            const height = container.firstChild.firstChild.getBoundingClientRect().height;
            container.firstChild.style['max-height'] = `${height}px`;
        }
    }, []);

    return (
        <div ref={ ref }>
            <Flex
                alignItems={ { default: 'alignItemsStretch' } }
                alignContent={ { default: 'alignContentSpaceBetween' } }
                className={ cardsWrapperClassName }
            >
                { props.contents.map(content => (
                    <FlexItem key={ content.key } className={ cardWrapperClassName }>
                        { content.element }
                    </FlexItem>
                ))}
            </Flex>
        </div>
    );
};

export const BehaviorGroupCardList: React.FunctionComponent<BehaviorGroupCardListProps> = props => {

    return (
        <BehaviorGroupCardListLayout
            contents={ props.behaviorGroups.map(behaviorGroup => ({
                key: behaviorGroup.id,
                element: <BehaviorGroupCard
                    behaviorGroup={ behaviorGroup }
                    onEdit={ props.onEdit }
                />
            })) }
        />
    );
};

export const BehaviorGroupCardListSkeleton: React.FunctionComponent = () => {
    return (
        <BehaviorGroupCardListLayout
            contents={ [
                {
                    key: 'skeleton-1',
                    element: <BehaviorGroupCardSkeleton />
                },
                {
                    key: 'skeleton-2',
                    element: <BehaviorGroupCardSkeleton />
                },
                {
                    key: 'skeleton-3',
                    element: <BehaviorGroupCardSkeleton />
                }
            ] }
        />
    );
};
