// This is a custom getBaseName that doesn't add the appId
// The reason is that this 'app' is in 2 menus (integrations and notifications), so is easier to just add that into our
// paths for easier navigation.
export const getBaseName = (pathname: string) => {
    const previewFragment = pathname.split('/')[1];
    const isPreview = [ 'beta', 'preview' ].includes(previewFragment);
    let release = '/';
    const pathName = pathname.replace(/(#|\?).*/, '').split('/');

    pathName.shift();

    if (isPreview) {
        pathName.shift();
        release = `/${previewFragment}/`;
    }

    return `${release}${pathName[0]}`;
};

export const getSubApp = (pathname: string) => {
    const pathName = pathname.split('/');
    pathName.shift();
    if ([ 'beta', 'preview' ].includes(pathName[0])) {
        return pathName[1];
    }

    return pathName[0];
};
