import { Page, expect, FrameLocator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Transactions Page Object Model
 */
export class TransactionsPage extends BasePage {
  // Selectors
  private readonly OVERVIEW_IFRAME = 'iframe[title="Overview"]';
  private readonly STUDIO_CONTAINER_IFRAME = 'iframe[title="Studio container"]';
  private readonly TRANSACTIONS_BUTTON = 'button:has-text("Transactions")';
  private readonly TRANSACTIONS_IFRAME = 'iframe[title="Transactions"]';
  private readonly SEARCH_INPUT = 'input[role="textbox"][name="Search"], input[aria-label="Search"]';
  private readonly EDIT_BUTTON = 'button:has-text("Edit")';
  private readonly ES_MAYOR_MENOR_IFRAME = 'iframe[title="EsMayorMenor(AMenorQueB)"]';
  private readonly SETTING_NAME = '[data-testid="setting_name"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navega a la sección de transacciones (abre popup)
   */
  async openTransactionsPopup(): Promise<Page> {
    const studioFrame = await this.page.frameLocator(this.STUDIO_CONTAINER_IFRAME);
    const overviewFrame = studioFrame.frameLocator(this.OVERVIEW_IFRAME);
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      overviewFrame.locator(this.TRANSACTIONS_BUTTON).click()
    ]);
    return popup;
  }

  /**
   * Realiza búsqueda y edición en transacciones
   */
  async searchAndEditTransaction(popup: Page, searchText: string): Promise<void> {
    const studioFrame = popup.frameLocator(this.STUDIO_CONTAINER_IFRAME);
    const transactionsFrame = studioFrame.frameLocator(this.TRANSACTIONS_IFRAME);
    await transactionsFrame.getByRole('textbox', { name: 'Search' }).click();
    await transactionsFrame.getByRole('textbox', { name: 'Search' }).fill(searchText);
    await transactionsFrame.getByRole('button', { name: 'Edit' }).click();
  }

  /**
   * Interactúa con el iframe EsMayorMenor
   */
  async interactWithEsMayorMenor(popup: Page): Promise<void> {
    const studioFrame = popup.frameLocator(this.STUDIO_CONTAINER_IFRAME);
    const esMayorMenorFrame = studioFrame.frameLocator(this.ES_MAYOR_MENOR_IFRAME);
    await esMayorMenorFrame.getByTestId('setting_name').click();
  }
}
