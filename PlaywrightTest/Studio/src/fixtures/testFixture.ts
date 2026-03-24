import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StudioPage } from '../pages/StudioPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TransactionsPage } from '../pages/TransactionsPage';

/**
 * Custom test fixture with Page Objects
 */
type TestFixtures = {
  loginPage: LoginPage;
  studioPage: StudioPage;
  settingsPage: SettingsPage;
  transactionsPage: TransactionsPage;
};


export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  studioPage: async ({ page }, use) => {
    const studioPage = new StudioPage(page);
    await use(studioPage);
  },
  settingsPage: async ({ page }, use) => {
    const settingsPage = new SettingsPage(page);
    await use(settingsPage);
  },
  transactionsPage: async ({ page }, use) => {
    const transactionsPage = new TransactionsPage(page);
    await use(transactionsPage);
  },
});

export { expect } from '@playwright/test';
