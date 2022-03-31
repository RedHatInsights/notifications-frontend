import { Label, LabelProps, Tooltip } from '@patternfly/react-core';
import * as React from 'react';

interface GroupNotFoundProps {
    onClose?: LabelProps['onClose'];
}

export const GroupNotFound: React.FunctionComponent<GroupNotFoundProps> = props => {
    return <Tooltip content="The group was not found. Someone else could have deleted it.">
        <Label variant="outline" color="red" onClose={ props.onClose }>
            Group not found
        </Label>
    </Tooltip>;
};
