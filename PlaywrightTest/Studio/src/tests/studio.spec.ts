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

  // 8. Confirmar la publicación haciendo click en "Confirm"
  await studioPage.confirmPublish();

  // 9. Validar que la publicación fue exitosa
  await studioPage.verifyPublicationSuccess();

  // 10. Tomar screenshot después de publicar
  await studioPage.takeStudioScreenshot('application-after-publish.png');

  console.log('✅ Application publication test completed successfully');
});

test('Validar visualizacion de Screen', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2. Realizar login
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 3. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // 4. Abrir la aplicación (respeta APP_NAME y BRANCH env variables)
  await studioPage.openApplicationFlow();

  // 5. Tomar screenshot de la aplicación abierta
  await studioPage.takeStudioScreenshot('screen-view-before.png');

  // 6. Ejecutar el flujo de visualización de pantallas
  await studioPage.viewScreenFlow('S001');

  // 7. Tomar screenshot después de ver la pantalla
  await studioPage.takeStudioScreenshot('screen-view-after.png');

  console.log('✅ Screen visualization test completed successfully');
});

test('Validar busquedas Appflow', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2. Realizar login
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 3. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // 4. Abrir la aplicación (respeta APP_NAME y BRANCH env variables)
  await studioPage.openApplicationFlow();

  // 5. Tomar screenshot de la aplicación abierta
  await studioPage.takeStudioScreenshot('appflow-before.png');

  // 6. Ejecutar el flujo de búsquedas en AppFlow
  await studioPage.validateAppFlowSearches('S001', 'P_TPL_INITIAL');

  // 7. Tomar screenshot después de las búsquedas
  await studioPage.takeStudioScreenshot('appflow-after.png');

  console.log('✅ AppFlow search validation test completed successfully');
});

test('Validar dependencias', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2. Realizar login
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 3. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // 4. Abrir la aplicación (respeta APP_NAME y BRANCH env variables)
  await studioPage.openApplicationFlow();

  // 5. Tomar screenshot de la aplicación abierta
  await studioPage.takeStudioScreenshot('dependencies-before.png');

  // 6. Ejecutar el flujo de validación de dependencias
  await studioPage.validateDependenciesFlow();

  // 7. Tomar screenshot después de validar dependencias
  await studioPage.takeStudioScreenshot('dependencies-after.png');

  console.log('✅ Dependencies validation test completed successfully');
});

test('Validar Listado de Procesos', async ({ page, loginPage, studioPage }) => {
  // 1. Navegar a la URL de Studio
  await loginPage.goto(URLS.STUDIO_ALFA);

  // 2. Realizar login
  await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);

  // 3. Validar que el login fue exitoso
  await studioPage.verifyLoginSuccess();

  // 4. Abrir la aplicación (respeta APP_NAME y BRANCH env variables)
  await studioPage.openApplicationFlow();

  // 5. Tomar screenshot de la aplicación abierta
  await studioPage.takeStudioScreenshot('process-list-01-before.png');

  // 6. Ejecutar el flujo de validación de listado de procesos
  await studioPage.validateProcessListFlow('card');

  // 7. Tomar screenshot después de validar procesos
  await studioPage.takeStudioScreenshot('process-list-04-after.png');

  console.log('✅ Process list validation test completed successfully');
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

