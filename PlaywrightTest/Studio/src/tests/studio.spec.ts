import { test, expect } from '../fixtures/testFixture';
import { URLS, CREDENTIALS } from '../utils/constants';

test('Login to STUDIO ALFA - POM Architecture', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2-4. Realizar login con credenciales
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 5. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // Tomar screenshot del dashboard
  await studioPage.takeStudioScreenshot('studio-login-success.png');
});

test('Login to STUDIO ALFA and open ALPHA_EASY_VT_SERVICESS application', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2-4. Realizar login con credenciales
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 5. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // Tomar screenshot antes de abrir la aplicación
  await studioPage.takeStudioScreenshot('studio-dashboard.png');

  // 6. Abrir la aplicación (basado en APP_NAME env variable)
  await studioPage.openApplicationFlow();

  // 7. Tomar screenshot de la aplicación abierta
  await studioPage.takeStudioScreenshot('application-opened.png');
});

test('Publish application after opening', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2. Realizar login
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 3. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // 4. Abrir la aplicación (respeta APP_NAME y BRANCH env variables)
  await studioPage.openApplicationFlow();

  // 5. Tomar screenshot antes de publicar
  await studioPage.takeStudioScreenshot('application-before-publish.png');

  // 6. Hacer click en el botón "Generate and publish"
  await studioPage.clickPublishButton();

  // 7. Esperar que termine la publicación
  await studioPage.waitForPublicationComplete();

  // 8. Tomar screenshot después de publicar
  await studioPage.takeStudioScreenshot('application-after-publish.png');

  console.log('✅ Application publication test completed successfully');
});

// Base de Tests: Login + Abrir Aplicación
test.describe('Application Settings Tests', () => {
  test.beforeEach(async ({ page, loginPage, studioPage }) => {
    // Setup base: Login + Abrir aplicación
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    await studioPage.verifyLoginSuccess();
    await studioPage.openApplicationFlow();
    await studioPage.takeStudioScreenshot('application-opened.png');
  });

  test('Access application Settings', async ({ page, studioPage, settingsPage }) => {
    // 1. Abrir los Settings
    await settingsPage.openApplicationSettings();

    // 2. Validar que los Settings se abrieron
    await settingsPage.verifySettingsOpened();

    // 3. Tomar screenshot de los Settings
    await settingsPage.takeSettingsScreenshot('application-settings.png');
  });
});

