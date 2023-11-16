import React, { useState } from 'react';
import { Button, Modal } from '@patternfly/react-core';

const IntegrationTestModal = () => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    const handleIntegrationTest = () => {
        console.log('Te gusta mi test papi?');
    };

    const handleModalCancel = () => {
        console.log('Cierramelo papi');
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Modal
            title="Integration Test"
            isOpen={ true }
            onClose={ () => console.log('Closing modal') }
            actions={ [
                <Button key="test" onClick={ handleIntegrationTest }>Test</Button>,
                <Button key="cancel" onClick={ handleModalCancel }>Cancel</Button>
            ] }
        >
        </Modal>
    );
};

export default IntegrationTestModal;
