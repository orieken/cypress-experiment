import Chainable = Cypress.Chainable;
import { SiteTitles } from '../lib/site-titles';

const getTitleForEnv = (name: string): string => {
  return SiteTitles[name];
};

const cyWrappedGetTitleForEnv = (name: string): Chainable<string> => {
  return cy.wrap(SiteTitles[name]);
};


describe('Examples', () => {
  const insideGetTitleForEnv = (name: string): string => {
    return SiteTitles[name];
  };

  const insideCyWrappedGetTitleForEnv = (name: string): Chainable<string> => {
    return cy.wrap(SiteTitles[name]);
  };
  beforeEach(() => {
    cyWrappedGetTitleForEnv(Cypress.env('name')).as('foo');
  });
  it('hard code\'d object lookup', () => {
    cy.title().should('eq', SiteTitles[Cypress.env('name')]);
  });

  it('hard code\'d cy.wrap object lookup', () => {
    cy.wrap({ titles: (name: string) => SiteTitles[name]})
        .invoke('titles', Cypress.env('name'))
        .then((expectedTitle) => {
          cy.title().should('eq', expectedTitle);
        });
  });

  it('hard code\'d cy.wrap object lookup function model name', () => {
    const getTitle = (name: string) => SiteTitles[name];
    cy.wrap({ titles: getTitle})
        .invoke('titles', Cypress.env('name'))
        .then((expectedTitle) => {
          cy.title().should('eq', expectedTitle);
        });
  });

  it('calling a function inside spec', () => {
    const bookstoreTitle = getTitleForEnv(Cypress.env('name'));
    cy.title().should('eq', bookstoreTitle);
  });

  it('cy.wrap on function getTitleForEnv with Cypress.env(\'name\')', () => {
    cy.wrap({'foo': getTitleForEnv})
        .invoke('foo', Cypress.env('name'))
        .then((title: string) => {
          cy.title().should('equal', title);
        });
  });

  it('cy.wrap on function getTitleForEnv with local', () => {
    cy.wrap({'foo': getTitleForEnv})
        .invoke('foo', 'local')
        .then((title: string) => {
          cy.title().should('equal', title);
        });
  });

  it('title then function', () => {
    cy.title().then((actualTitle: string) => {
      getTitleForEnv(Cypress.env('name')).should('equal', actualTitle);
    });
  });

  it('title then inside function', () => {
    cy.title().then((actualTitle: string) => {
      insideGetTitleForEnv(Cypress.env('name')).should('equal', actualTitle);
    });
  });

  it('title then inside cy.wrap function', () => {
    cy.title().then((actualTitle: string) => {
      insideCyWrappedGetTitleForEnv(Cypress.env('name')).should('equal', actualTitle);
    });
  });

  it('title then cy.wrap function', () => {
    cy.title().then((actualTitle: string) => {
      cyWrappedGetTitleForEnv(Cypress.env('name')).as('expectedTitle');
      cy.get('@expectedTitle').should('equal', actualTitle);
    });
  });

  it('title then cy.wrap function with hook', () => {
    cy.title().then((actualTitle: string) => {
      cy.get('@foo').should('equal', actualTitle);
    });
  });


  it('title then cy function', () => {
    cyWrappedGetTitleForEnv(Cypress.env('name')).as('expectedTitle');
    cy.get('@expectedTitle').then((expectedTitle: any) => {
      cy.title().should('equal', expectedTitle);
    });
  });

  it('works as a cy.wrapped function', () => {
    cyWrappedGetTitleForEnv(Cypress.env('name')).then((expectedTitle: string) => { // custom command throws getTitle does not exist on cy
      cy.title().should('equal', expectedTitle);
    });
  });


  it('works as a cy.wrapped custom command', () => {
    cy.getTitle(Cypress.env('name')).then((expectedTitle: string) => { // custom command throws getTitle does not exist on cy
      cy.title().should('equal', expectedTitle);
    });
  });

  it('should work cause of then', () => {
    let expectedTitle;

    cy.then(() => {
      expectedTitle = getTitleForEnv(Cypress.env('name'));
      cy.title().should('equal', expectedTitle);
    });
  });
});
