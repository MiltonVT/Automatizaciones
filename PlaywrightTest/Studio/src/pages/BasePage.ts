import { Page } from '@playwright/test';

/**
 * Base Page class with common methods
 */
export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Fill an input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  /**
   * Click an element
   */
  async click(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  /**
   * Wait for navigation with timeout
   */
  async waitForNavigation(timeout: number): Promise<void> {
    await this.page.waitForNavigation({ timeout });
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number): Promise<void> {
    await this.page.locator(selector).waitFor({ timeout });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible().catch(() => false);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: filename });
  }
}
