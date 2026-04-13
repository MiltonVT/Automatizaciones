import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { IFRAMES } from '../selectors/selectors';
import { TEST_IDS } from '../selectors/selectors';
import { Logger } from '../utils/logger';

/**
 * Theme Page - handles popup-based theme workflow.
 */
export class ThemePage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  /** Open the Themes popup via Overview */
  async openThemesPopup(): Promise<Page> {
    Logger.action('Click', 'Themes', 'Opening themes popup');
    const btn = this.container.overview.getButton('Themes');
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      btn.click(),
    ]);
    Logger.success('Click', 'Themes', 'Popup opened');
    return popup;
  }

  /** Search and edit a theme in the popup window */
  async searchAndEditTheme(popup: Page, searchText: string): Promise<void> {
    Logger.action('Search', 'Themes', `Searching: ${searchText}`);
    const popupContainer = new StudioContainerComponent(popup);
    const themesFrame = popupContainer.getFrame(IFRAMES.THEMES);
    await themesFrame.getByRole('textbox', { name: 'Search' }).click();
    await themesFrame.getByRole('textbox', { name: 'Search' }).fill(searchText);
    await themesFrame.getByRole('button', { name: 'Edit' }).click();
    Logger.success('Click', 'Themes', `Edited theme: ${searchText}`);
  }

  /** Interact with the EsMayorMenor iframe inside the popup */
  async interactWithEsMayorMenor(popup: Page): Promise<void> {
    const popupContainer = new StudioContainerComponent(popup);
    const esMayorFrame = popupContainer.getFrame('iframe[title="EsMayorMenor(AMenorQueB)"]');
    await esMayorFrame.getByTestId(TEST_IDS.SETTING_NAME).click();
    Logger.success('Click', 'Themes', 'Clicked setting_name in EsMayorMenor');
  }
}
