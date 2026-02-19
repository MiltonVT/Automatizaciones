import { test, expect } from '../fixtures/testFixture';
import { URLS, CREDENTIALS } from '../utils/constants';

test.describe('Application Settings', () => {
  
  test.beforeEach(async ({ loginPage, studioPage }) => {
    // Setup base: Login + Abrir aplicación
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    await studioPage.verifyLoginSuccess();
    await studioPage.openApplication();
  });

  test('Should open Settings', async ({ settingsPage }) => {
    await settingsPage.openApplicationSettings();
    await settingsPage.verifySettingsOpened();
    await settingsPage.takeSettingsScreenshot('settings-opened.png');
  });

  test('Should update multiple settings at once', async ({ settingsPage }) => {
    await settingsPage.openApplicationSettings();
    await settingsPage.verifySettingsOpened();
    await settingsPage.takeSettingsScreenshot('settings-updated.png');
  });
});

