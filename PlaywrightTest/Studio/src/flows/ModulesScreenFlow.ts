import { Page, expect } from '@playwright/test';
import { ModulesPage } from '../pages/ModulesPage';
import { ScreensPage } from '../pages/ScreensPage';
import { Logger } from '../utils/logger';

/**
 * Flow: Modules -> Screens -> Design Mode
 * Orchestrates a multi-page business flow.
 */
export class ModulesScreenFlow {
  private readonly modulesPage: ModulesPage;
  private readonly screensPage: ScreensPage;

  constructor(page: Page) {
    this.modulesPage = new ModulesPage(page);
    this.screensPage = new ScreensPage(page);
  }

  async execute(moduleName: string, screenName: string, expectedNivelValue: string): Promise<void> {
    Logger.action('Flow', 'ModulesScreen', 'Starting modules-screen flow');
    await this.modulesPage.openModules();
    await this.modulesPage.searchModule(moduleName);
    await this.modulesPage.selectModule('MOD_KIREI_MODULES_2');
    await this.screensPage.openScreens();
    await this.screensPage.openScreen(screenName);
    await this.screensPage.openScreenPreview();
    await this.screensPage.openDesignMode();
    await this.screensPage.clickNivel();
    await this.screensPage.openDesignMode();
    // Final validation - assertion stays in flow since it's the flow's contract
    await expect(this.screensPage.nameTextbox).toHaveValue(expectedNivelValue);
    Logger.success('Flow', 'ModulesScreen', 'Flow completed successfully');
  }
}
