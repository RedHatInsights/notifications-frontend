import { Flex, FlexItem } from '@patternfly/react-core';
import { global_spacer_md } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { BehaviorGroupCard } from './BehaviorGroupCard';

const cardsWrapperClassName = style({
    overflow: 'auto'
});

const cardWrapperClassName = style({
    paddingBottom: global_spacer_md.var
});

interface BehaviorGroupCardListProps {
    onEdit: (behaviorGroup: BehaviorGroup) => void;
    behaviorGroups: Array<BehaviorGroup>;
}

export const BehaviorGroupCardList: React.FunctionComponent<BehaviorGroupCardListProps> = props => {

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
                { props.behaviorGroups.map(behaviorGroup => (
                    <FlexItem key={ behaviorGroup.id } className={ cardWrapperClassName }>
                        <BehaviorGroupCard
                            behaviorGroup={ behaviorGroup }
                            onEdit={ props.onEdit }
                        />
                    </FlexItem>
                ))}
            </Flex>
        </div>
    );
};
