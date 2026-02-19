import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StudioPage } from '../pages/StudioPage';
import { SettingsPage } from '../pages/SettingsPage';

/**
 * Custom test fixture with Page Objects
 */
type TestFixtures = {
  loginPage: LoginPage;
  studioPage: StudioPage;
  settingsPage: SettingsPage;
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
});

export { expect } from '@playwright/test';
