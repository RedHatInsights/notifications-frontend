import { Flex, FlexItem } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import * as React from 'react';
import { useMeasure } from 'react-use';
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
    onDelete: (behaviorGroup: BehaviorGroup) => void;
    behaviorGroups: ReadonlyArray<BehaviorGroup>;
}

interface BehaviorGroupCardListLayoutProps {
    contents: Array<{
        key: string;
        element: React.ReactNode;
    }>;
}

const BehaviorGroupCardListLayout: React.FunctionComponent<BehaviorGroupCardListLayoutProps> = props => {

    const [ measureRef, measuredSizing ] = useMeasure<HTMLDivElement>();
    const container = React.useRef<HTMLDivElement>();
    const ref = React.useCallback(refContainer => {
        container.current = refContainer;
        measureRef(refContainer);
    }, [ container, measureRef ]);

    React.useEffect(() => {
        if (container.current?.firstChild?.firstChild) {
            const element = container.current.firstChild as HTMLElement;
            const height = (element.firstChild as HTMLElement).getBoundingClientRect().height;
            element.style['max-height'] = `${height}px`;
        }
    }, [ measuredSizing ]);

    return (
        <div ref={ ref } data-testid="ref-card-list-container">
            <Flex
                alignItems={ { default: 'alignItemsStretch' } }
                alignContent={ { default: 'alignContentSpaceBetween' } }
                className={ cardsWrapperClassName }
                data-testid="card-list-container"
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
                    onDelete={ props.onDelete }
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
