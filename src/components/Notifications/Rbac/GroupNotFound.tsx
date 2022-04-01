import { Label, LabelProps, Tooltip } from '@patternfly/react-core';
import * as React from 'react';

interface GroupNotFoundProps {
    onClose?: LabelProps['onClose'];
}

export const GroupNotFound: React.FunctionComponent<GroupNotFoundProps> = props => {
    return <Tooltip content="The group was deleted and can not be found.">
        <Label variant="outline" color="red" onClose={ props.onClose }>
            Group not found
        </Label>
    </Tooltip>;
};
