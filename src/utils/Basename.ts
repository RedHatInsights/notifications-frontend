// This is a custom getBaseName that doesn't add the appId
// The reason is that this 'app' is in 2 menus (integrations and notifications), so is easier to just add that into our
// paths for easier navigation.
export const getBaseName = (pathname: string) => {
    let release = '/';
    const pathName = pathname.split('/');

    pathName.shift();

    if (pathName[0] === 'beta') {
        pathName.shift();
        release = `/beta/`;
    }

    return `${release}${pathName[0]}`;
};

export const getSubApp = (pathname: string) => {
    const pathName = pathname.split('/');
    pathName.shift();
    if (pathName[0] === 'beta') {
        return pathName[1];
    }

    return pathName[0];
};
