import * as React from 'react';
import { Redirect } from 'react-router';

import { linkTo } from '../Routes';

export const defaultBundleName = 'insights';

export const RedirectToDefaultBundle = () => <Redirect from={ linkTo.notifications('') } to={ linkTo.notifications(defaultBundleName) } />;
