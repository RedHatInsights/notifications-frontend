import { render } from '@testing-library/react';
import * as React from 'react';

import {
  appWrapperCleanup,
  appWrapperSetup,
  getConfiguredAppWrapper,
} from '../../../../test/AppWrapper';
import { ErrorPage } from '../Page';

jest.mock('@redhat-cloud-services/frontend-components', () => {
  const Children: React.FunctionComponent = (props) => {
    return <span>{props.children}</span>;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Title: React.FunctionComponent<any> = (props) => {
    return <span>{props.title}</span>;
  };

  return {
    Main: Children,
    PageHeader: Children,
    PageHeaderTitle: Title,
  };
});

describe('src/pages/Error/Page', () => {
  let mockConsole;

  beforeEach(() => {
    mockConsole = jest.spyOn(console, 'error');
    mockConsole.mockImplementation(() => '');
    appWrapperSetup();
  });

  afterEach(() => {
    mockConsole.mockRestore();
    appWrapperCleanup();
  });

  it('Goes to back when clicking the button', () => {
    const getLocation = jest.fn();
    const AppWrapper = getConfiguredAppWrapper({
      getLocation,
      router: {
        initialEntries: ['/foo'],
      },
    });

    const Surprise = () => {
      throw new Error('surprise');
    };

    render(
      <ErrorPage>
        <Surprise />
      </ErrorPage>,
      {
        wrapper: AppWrapper,
      }
    );
    expect(getLocation().pathname).toEqual('/foo');
  });
});
