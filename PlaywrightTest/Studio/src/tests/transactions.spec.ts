import { test, expect } from '../fixtures/testFixture';
import { URLS, CREDENTIALS, APPLICATION } from '../utils/constants';

test.describe('Transactions', () => {
  test.beforeEach(async ({ loginPage, studioPage }) => {
    // Setup base: Login + Abrir aplicación + Seleccionar branch
    await loginPage.goto(URLS.STUDIO_ALFA);
    await loginPage.login(CREDENTIALS.USERNAME, CREDENTIALS.PASSWORD);
    await studioPage.verifyLoginSuccess();
    await studioPage.openApplicationFlow();
    console.log(`📱 Test Setup: App="${APPLICATION.NAME}" | Branch="${APPLICATION.BRANCH}"`);
    // Aquí termina el flujo igual que dependencias
  });

  test('Should search and edit transaction', async ({ page, transactionsPage }) => {
    // 1. Abrir popup de transacciones
    const popup = await transactionsPage.openTransactionsPopup();

    // 2. Buscar y editar transacción
    await transactionsPage.searchAndEditTransaction(popup, 'may');

    // 3. Interactuar con el iframe EsMayorMenor
    await transactionsPage.interactWithEsMayorMenor(popup);

    // 4. Validar que el campo setting_name es visible
    // (opcional, según el flujo grabado)
    // await expect(popup.getByTestId('setting_name')).toBeVisible();
  });
});
