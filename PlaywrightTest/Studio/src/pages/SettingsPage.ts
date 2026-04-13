import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { StudioContainerComponent } from '../components/StudioContainerComponent';
import { IFRAMES } from '../selectors/selectors';
import { TIMEOUTS } from '../utils/constants';
import { Logger } from '../utils/logger';

/**
 * Settings Page - handles application settings within Studio.
 * Delegates iframe access to CPOM components.
 */
export class SettingsPage extends BasePage {
  private readonly container: StudioContainerComponent;

  constructor(page: Page) {
    super(page);
    this.container = new StudioContainerComponent(page);
  }

  /** Open Settings via Overview button */
  async openApplicationSettings(): Promise<void> {
    const btn = this.container.overview.getButton('Settings');
    await btn.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await btn.click();
    Logger.success('Click', 'Settings', 'Opened application settings');
  }

  /** Verify the Settings iframe is visible */
  async verifySettingsOpened(): Promise<void> {
    const settingsFrame = this.container.getFrame(IFRAMES.SETTINGS);
    const text = settingsFrame.getByText('Settings');
    await text.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    Logger.success('Verify', 'Settings', 'Settings panel visible');
  }
}
