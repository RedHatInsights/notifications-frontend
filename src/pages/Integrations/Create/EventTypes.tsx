import React from 'react';
import './review.scss';
import { Form } from '@patternfly/react-core';

interface EventTypesProps {
  name: string;
}

const EventTypes: React.FunctionComponent<EventTypesProps> = ({
  name,
}: EventTypesProps) => {
  return <Form>{name}</Form>;
};

export default EventTypes;
