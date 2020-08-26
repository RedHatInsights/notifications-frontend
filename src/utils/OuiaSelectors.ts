
interface OuiaSelectors {
    getOuiaElement: (componentType: string, componentId?: string) => OuiaSelectableElement | undefined;
    getOuiaElements: (componentType: string, componentId?: string) => Array<OuiaSelectableElement>;
}

type OuiaSelectableElement = HTMLElement & OuiaSelectors;

const _getOuiaElements = (base: HTMLElement, componentType: string, componentId?: string): Array<OuiaSelectableElement> => {
    let selector = `[data-ouia-component-type="${componentType}"]`;
    if (componentId) {
        selector += `[data-ouia-component-id="${componentId}"]`;
    }

    const result = base.querySelectorAll<HTMLElement>(selector);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return Array.from(result).map(r => ouiaSelectorsFor(r));
};

const _getOuiaElement = (base: HTMLElement, componentType: string, componentId?: string): OuiaSelectableElement | undefined => {
    const elements = _getOuiaElements(base, componentType, componentId);
    if (elements.length > 1) {
        throw new Error(`There are more than one element with the type: ${ componentType } and the id ${ componentId }`);
    } else if (elements.length === 0) {
        return undefined;
    }

    return elements[0];
};

export const ouiaSelectors: Readonly<OuiaSelectors> = {
    getOuiaElement: (componentType: string, componentId?: string) => {
        return _getOuiaElement(document.body, componentType, componentId);
    },
    getOuiaElements: (componentType: string, componentId?: string) => {
        return _getOuiaElements(document.body, componentType, componentId);
    }
};

export const ouiaSelectorsFor = (base: HTMLElement): Readonly<OuiaSelectableElement> => {
    return Object.assign(base, {
        getOuiaElement: (componentType: string, componentId?: string) => {
            return _getOuiaElement(base, componentType, componentId);
        },
        getOuiaElements: (componentType: string, componentId?: string) => {
            return _getOuiaElements(base, componentType, componentId);
        }
    });
};
