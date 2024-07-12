import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatedStep from './CreatedStep';
import FailedStep from './FailedStep';

interface ProgressProps {
  integrationName: string;
  behaviorGroupName: string;
}

export const FinalStep: React.FunctionComponent<ProgressProps> = (props) => {
  const { isBeta, getBundle } = useChrome();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = React.useState(true);
  const [isCreated, setIsCreated] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
 
//   I am trying to make sense of this to set the different pages as it progresses.. doesn't do anything right now.

  const handleCreate = () => {
    setIsCreating(true);

    if (data.response === '200') {
      setIsCreated(true);
      <CreatedStep integrationName={''} behaviorGroupName={''} />;
    } else {
      setIsCreated(false);
      <FailedStep integrationName={''} behaviorGroupName={''} />;
    }
  };

  return (

  )
};

export default FinalStep;
