import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS } from '../utils/constants';

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly USERNAME_INPUT = '#login';
  private readonly PASSWORD_INPUT = 'input[type="password"]';
  private readonly SIGN_IN_BUTTON = 'button:has-text("Sign in")';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Fill username field
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.USERNAME_INPUT, username);
  }

  /**
   * Fill password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.PASSWORD_INPUT, password);
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    await this.click(this.SIGN_IN_BUTTON);
  }

  /**
   * Perform login
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    await this.waitForNavigation(TIMEOUTS.NAVIGATION);
  }
}
