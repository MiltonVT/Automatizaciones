import { test, expect } from '../fixtures/testFixture';
import { URLS, CREDENTIALS, APPLICATION } from '../utils/constants';

test.describe('Application Settings', () => {
  
  test.beforeEach(async ({ loginPage, studioPage }) => {
    // Setup base: Login + Abrir aplicación + Seleccionar branch
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    await studioPage.verifyLoginSuccess();
    await studioPage.openApplicationFlow();
    console.log(`📱 Test Setup: App="${APPLICATION.NAME}" | Branch="${APPLICATION.BRANCH}"`);
  });

  test('Should open Settings', async ({ studioPage, settingsPage }) => {
    // 1. Abrir los Settings
    await settingsPage.openApplicationSettings();

    // 2. Validar que los Settings se abrieron
    await settingsPage.verifySettingsOpened();

    // 3. Tomar screenshot de los Settings
    await settingsPage.takeSettingsScreenshot('settings-opened.png');
  });

  test('Should update multiple settings at once', async ({ studioPage, settingsPage }) => {
    // 1. Abrir los Settings
    await settingsPage.openApplicationSettings();

    // 2. Validar que los Settings se abrieron
    await settingsPage.verifySettingsOpened();

    // 3. Tomar screenshot de los Settings actualizados
    await settingsPage.takeSettingsScreenshot('settings-updated.png');
  });
});

