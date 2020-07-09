
enum IntegrationType {
    HTTP = 'http'
}

interface Integration {
    name: string;
    type: IntegrationType;
    isEnabled: boolean;
}

type IntegrationHttp = Integration & {
    type: IntegrationType.HTTP;
    url: string;
}
