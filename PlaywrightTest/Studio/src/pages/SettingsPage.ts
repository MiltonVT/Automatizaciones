import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS } from '../utils/constants';

/**
 * Settings Page Object Model
 */
export class SettingsPage extends BasePage {
  // Selectors - ACTUALIZA ESTOS SEGÚN TU APP
  private readonly SETTINGS_MENU = 'a[href*="settings"]';
  private readonly SETTINGS_TITLE = 'h1:has-text("Settings")';
  private readonly SAVE_BUTTON = 'button:has-text("Save")';
  private readonly SUCCESS_MESSAGE = '.alert-success';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Settings
   */
  async goToSettings(): Promise<void> {
    await this.click(this.SETTINGS_MENU);
    await this.waitForElement(this.SETTINGS_TITLE, TIMEOUTS.ELEMENT_WAIT);
  }

  /**
   * Verify Settings page is loaded
   */
  async verifySettingsPageLoaded(): Promise<void> {
    await expect(this.page.locator(this.SETTINGS_TITLE)).toBeVisible();
    console.log('✅ Settings page loaded');
  }

  /**
   * Change a setting value
   */
  async changeSetting(settingName: string, newValue: string): Promise<void> {
    const settingInput = `input[name="${settingName}"]`;
    await this.fillInput(settingInput, newValue);
    console.log(`✅ Changed ${settingName} to ${newValue}`);
  }

  /**
   * Save settings
   */
  async saveSettings(): Promise<void> {
    await this.click(this.SAVE_BUTTON);
    // Esperar mensaje de éxito
    await this.waitForElement(this.SUCCESS_MESSAGE, TIMEOUTS.SHORT_WAIT);
    console.log('✅ Settings saved successfully');
  }

  /**
   * Get setting value
   */
  async getSettingValue(settingName: string): Promise<string> {
    const settingInput = `input[name="${settingName}"]`;
    return await this.page.locator(settingInput).inputValue();
  }

  /**
   * Verify setting was saved
   */
  async verifySettingSaved(settingName: string, expectedValue: string): Promise<void> {
    const actualValue = await this.getSettingValue(settingName);
    expect(actualValue).toBe(expectedValue);
    console.log(`✅ Setting ${settingName} verified: ${actualValue}`);
  }

  /**
   * Take Settings screenshot
   */
  async takeSettingsScreenshot(filename: string = 'settings-page.png'): Promise<void> {
    await this.takeScreenshot(filename);
  }

  /**
   * Click on Settings button in application
   */
  async openApplicationSettings(): Promise<void> {
    try {
      const settingsButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByRole('button', { name: 'Settings' });

      await settingsButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await settingsButton.click();
      console.log('✅ Clicked on Settings button');
    } catch (error) {
      console.log('⚠️ Could not click Settings button');
      throw error;
    }
  }

  /**
   * Verify settings panel is open
   */
  async verifySettingsOpened(): Promise<void> {
    try {
      // Buscar el iframe de Settings y validar que contiene el texto "Settings"
      const settingsText = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Settings"]')
        .contentFrame()
        .getByText('Settings');

      await settingsText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      console.log('✅ Settings panel verified');
    } catch (error) {
      console.log('⚠️ Could not verify settings panel');
      throw error;
    }
  }
}
