import { componentTypes } from '@data-driven-forms/react-form-renderer';

export const schema = {
    fields: [
        {
            component: componentTypes.WIZARD,
            inModal: true,
            title: 'Add integration',
            description: 'Configure integrations between third-party tools and the Red Hat Hybrid Cloud Console.',
            name: 'add-integration-wizard',
            fields: [
                {
                    title: 'Enter details',
                    name: 'details',
                    nextStep: 'review',
                    fields: [
                        {
                            component: componentTypes.TEXT_FIELD,
                            name: 'integration-name',
                            type: 'text',
                            label: 'Integration name',
                            isRequired: true,
                            validate: [
                                {
                                    type: 'required'
                                }
                            ]
                        }
                    ]
                },
                {
                    title: 'Review',
                    name: 'review',
                    fields: [
                        {
                            component: 'summary-content',
                            name: 'summary-content'
                        }
                    ]
                }
            ]
        }
    ]
};
