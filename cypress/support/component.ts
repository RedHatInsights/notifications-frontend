/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { mount } from 'cypress/react18'
import '@cypress/code-coverage/support'

// Alternatively you can use CommonJS syntax:
// require('./commands')

const { addMatchImageSnapshotCommand,  } = require('@simonsmith/cypress-image-snapshot/command');

// configure the matcher to be less precise to adjust between the headless and normal browser rendering differences
addMatchImageSnapshotCommand({
  failureThreshold: 0.03, // threshold for entire image
  failureThresholdType: 'percent', // percent of image or number of pixels
  customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
  capture: 'viewport', // capture viewport in screenshot
});

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  interface Window {
    TestApp: unknown;
    useChrome: typeof useChrome;
  }
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      matchImageSnapshot: () => void
      login(): Chainable<void>
      mockUseChrome(): Chainable<void>
    }
  }
}

const fakeUseChrome = {
  addWsEventListener: () => null,
};


Cypress.Commands.add('mount', mount)
// Example use:
// cy.mount(<MyComponent />)

// Mock the useChrome hook
Cypress.Commands.add('mockUseChrome', () => {
  const useChrome = cy.stub(fakeUseChrome).as('useChrome');
  useChrome.addWsEventListener = cy.stub().returns(null);
  cy.window().then((win) => {
    win.useChrome = useChrome;
  });
});
// cy.stub(o, 'toString').callsFake(() => 'foo')
