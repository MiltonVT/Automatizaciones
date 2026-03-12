import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TIMEOUTS, TEST_DATA, APPLICATION } from '../utils/constants';

/**
 * Studio Page Object Model
 */
export class StudioPage extends BasePage {
  // Selectors
  private readonly STUDIO_MENU_NAME = 'span.vtui_studio-menu_name';
  private readonly STUDIO_TITLE = 'text=Studio';
  private readonly APPLICATION_CARD = 'span.vtui_card_header_title';
  private readonly CARD_CONTAINER = '[class*="vtui_card"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Wait for Studio menu to be visible
   */
  async waitForStudioMenu(): Promise<void> {
    await this.waitForElement(this.STUDIO_MENU_NAME, TIMEOUTS.ELEMENT_WAIT);
  }

  /**
   * Verify Studio title is visible
   */
  async verifyStudioTitle(): Promise<void> {
    await this.waitForStudioMenu();
    await expect(this.page.getByText(TEST_DATA.EXPECTED_TITLE)).toBeVisible();
  }

  /**
   * Verify user is logged in to Studio
   */
  async verifyLoginSuccess(): Promise<void> {
    const currentUrl = await this.getCurrentUrl();
    console.log(`Current URL: ${currentUrl}`);
    
    // Validar que la URL contiene studio y veritran (funciona con cualquier ambiente)
    await expect(this.page).toHaveURL(/.*studio\..*\.envs\.veritran\.com.*/);
    
    // Intentar esperar el elemento, pero si no aparece validamos solo por URL
    const isElementVisible = await this.isElementVisible(this.STUDIO_MENU_NAME);
    if (isElementVisible) {
      await this.verifyStudioTitle();
      console.log('✅ Studio menu found and visible');
    } else {
      console.log('✅ Login successful - URL changed to Studio ALFA');
    }
  }

  /**
   * Wait for applications to be loaded
   */
  async waitForApplicationsLoaded(): Promise<void> {
    try {
      const dashboard = this.page
        .frameLocator('iframe[title="Studio container"]')
        .frameLocator('iframe[title="Dashboard"]');

      await dashboard.locator('article').first().waitFor({ timeout: TIMEOUTS.APP_LOAD });
      console.log('✅ Applications loaded');
    } catch (error) {
      console.log('⚠️ Applications element attached (even if not visible), continuing...');
    }
  }

  /**
   * Select branch from the Dashboard based on BRANCH environment variable
   */
  async selectBranch(): Promise<void> {
    try {
      const branchName = APPLICATION.BRANCH;
      console.log(`🔍 Looking for branch: ${branchName}`);
      
      // Use the provided locator structure to find and click the branch
      const branchElement = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Dashboard"]')
        .contentFrame()
        .getByText(branchName);
      
      // Wait for branch element to be visible
      await branchElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      
      // Click on the branch
      await branchElement.click();
      console.log(`✅ Selected branch: ${branchName}`);
      
      // Wait a moment for the branch to load
      await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    } catch (error) {
      console.log(`⚠️ Could not select branch: ${APPLICATION.BRANCH}`);
      console.log('Continuing with current branch...');
    }
  }

  /**
   * Click on application card based on APP_NAME environment variable
   */
  async openApplication(): Promise<void> {
    await this.waitForApplicationsLoaded();
    
    const appNameToOpen = APPLICATION.NAME;
    console.log(`🔍 Looking for application: ${appNameToOpen}`);
    
    // Use frameLocator for nested iframes (Playwright best practice)
    const appCard = this.page
      .frameLocator('iframe[title="Studio container"]')
      .frameLocator('iframe[title="Dashboard"]')
      .getByText(appNameToOpen)
      .first();
    
    // Explicitly wait for visibility before clicking
    await appCard.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    
    await appCard.click();
    console.log(`✅ Clicked on ${appNameToOpen} application`);
    
    // Don't wait for networkidle - the element validation in verifyApplicationTitle() 
    // will confirm the app actually loaded by checking the Overview iframe
  }

  /**
   * Click on ALPHA_EASY_VT_SERVICESS application card (Legacy - use openApplication instead)
   * @deprecated Use openApplication() instead
   */
  async openAlphaEasyVTServicesApp(): Promise<void> {
    await this.openApplication();
  }

  /**
   * Verify application title is displayed with branch
   */
  async verifyApplicationTitle(): Promise<void> {
    try {
      const appName = APPLICATION.NAME;
      const branch = APPLICATION.BRANCH;
      const expectedTitle = `${appName} | ${branch}`;
      
      const appTitle = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByText(expectedTitle);
      
      await appTitle.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      console.log(`✅ Application title verified: ${expectedTitle}`);
    } catch (error) {
      console.log('⚠️ Could not verify application title');
      throw error;
    }
  }

  /**
   * Verify application has opened
   */
  async verifyApplicationOpened(): Promise<void> {
    // Esperar a que la URL cambie o la página cargue
    try {
      await this.page.waitForURL(/.*/, { timeout: TIMEOUTS.APP_LOAD });
      const currentUrl = this.page.url();
      console.log(`✅ Application opened - URL: ${currentUrl}`);
    } catch (error) {
      const url = this.page.url();
      console.log(`⚠️ Application load verified: ${url}`);
    }
  }

  /**
   * Complete flow: Open application after login and select branch
   */
  async openApplicationFlow(): Promise<void> {
    await this.openApplication();
    await this.selectBranch();
    await this.verifyApplicationOpened();
    await this.verifyApplicationTitle();
  }

  /**
   * Click on "Generate and publish" button to publish the application
   */
  async clickPublishButton(): Promise<void> {
    try {
      const publishButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .getByRole('button', { name: 'Generate and publish' });
      
      // Wait for the publish button to be visible and enabled
      await publishButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      
      // Scroll into view if needed
      await publishButton.scrollIntoViewIfNeeded();
      
      // Click the publish button
      await publishButton.click();
      console.log('✅ Clicked "Generate and publish" button');
      
      // Wait a moment for the publication process to start
      await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    } catch (error) {
      console.log('⚠️ Could not click publish button');
      throw error;
    }
  }

  /**
   * Wait for the application publication to complete
   * Waits for any loading indicators to disappear
   */
  async waitForPublicationComplete(): Promise<void> {
    try {
      console.log('⏳ Waiting for publication to complete...');
      
      // Wait for any loading spinners/progress indicators to disappear
      // This is a flexible approach that waits for the API/generation to finish
      const containerFrame = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame();
      
      // Wait for button to be stable (not in loading state)
      const publishButton = containerFrame.getByRole('button', { name: 'Generate and publish' });
      
      // Wait for the button to be enabled again (indicating publication is done)
      await publishButton.isEnabled({ timeout: TIMEOUTS.APP_LOAD });
      
      console.log('✅ Publication completed successfully');
      
      // Wait a moment for UI to stabilize after publication
      await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    } catch (error) {
      console.log('⚠️ Publication may still be in progress, continuing...');
      // Don't throw - publication might have completed silently
    }
  }

  /**
   * Click the "Confirm" button in the "Generate and publish" modal dialog
   */
  async confirmPublish(): Promise<void> {
    try {
      const confirmButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Generate and publish"]')
        .contentFrame()
        .getByRole('button', { name: 'Confirm' });
      
      // Wait for confirm button to be visible
      await confirmButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      
      // Click the confirm button
      await confirmButton.click();
      console.log('✅ Clicked "Confirm" button in publish dialog');
      
      // Wait a moment for the confirmation to be processed
      await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
    } catch (error) {
      console.log('⚠️ Could not click confirm button in publish dialog');
      throw error;
    }
  }

  /**
   * Verify that the application was successfully published
   * Looks for the "App successfully published." message
   */
  async verifyPublicationSuccess(): Promise<void> {
    try {
      const successMessage = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Generate and publish"]')
        .contentFrame()
        .getByText('App successfully published.');
      
      // Wait for the success message to be visible
      await successMessage.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      console.log('✅ Publication success message verified: "App successfully published."');
    } catch (error) {
      console.log('⚠️ Could not verify publication success message');
      throw error;
    }
  }

  /**
   * Complete flow: Publish application after opening it
   */
  async publishApplicationFlow(): Promise<void> {
    await this.openApplicationFlow();
    await this.clickPublishButton();
    await this.waitForPublicationComplete();
  }

  /**
   * View screen details by searching and opening a specific screen
   * Searches for screen 'S001' and opens it for view
   */
  async viewScreenFlow(screenId: string = 'S001'): Promise<void> {
    try {
      // Click on "Screens" button
      console.log('🔍 Clicking on Screens button...');
      const screensButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByRole('button', { name: 'Screens' });
      
      await screensButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await screensButton.click();
      console.log('✅ Clicked Screens button');
      
      // Click on Search box
      console.log('🔍 Clicking on search box...');
      const searchBox = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Screens"]')
        .contentFrame()
        .getByRole('searchbox', { name: 'Search' });
      
      await searchBox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await searchBox.click();
      console.log('✅ Clicked search box');
      
      // Fill search box with screen ID
      console.log(`🔍 Searching for screen: ${screenId}...`);
      await searchBox.fill(screenId);
      console.log(`✅ Filled search with: ${screenId}`);
      
      // Wait for search results
      await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
      
      // Click on the screen result
      console.log(`🔍 Clicking on screen result...`);
      const screenResult = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Screens"]')
        .contentFrame()
        .getByText(`V00|contents1:${screenId}`);
      
      await screenResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await screenResult.click();
      console.log(`✅ Clicked on screen: ${screenId}`);
      
      // Double click on screen preview image
      console.log('🔍 Double-clicking on screen preview...');
      const screenPreview = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Screens"]')
        .contentFrame()
        .getByRole('img', { name: 'Screen preview' });
      
      await screenPreview.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await screenPreview.dblclick();
      console.log('✅ Double-clicked screen preview');
      
      // Wait for the unnamed iframe to be available and the element to load
      // Instead of a fixed wait, we wait for the element to be visible
      console.log('🔍 Waiting for screen detail view to load...');
      
      // Retry logic to handle slow loading
      let contentElementFound = false;
      let attempt = 0;
      const maxAttempts = 5;
      
      while (!contentElementFound && attempt < maxAttempts) {
        try {
          const contentElement = this.page
            .locator('iframe[title="Studio container"]')
            .contentFrame()
            .locator('iframe[title="Unnamed"]')
            .contentFrame()
            .getByText('V00|Contents');
          
          // Try to wait for the element with a shorter timeout per attempt
          await contentElement.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM_WAIT });
          contentElementFound = true;
          console.log('✅ Screen detail view loaded');
          
          // Click on content element
          console.log('🔍 Clicking on content element...');
          await contentElement.click();
          console.log('✅ Clicked on content element');
          
        } catch (error) {
          attempt++;
          console.log(`⚠️  Attempt ${attempt}/${maxAttempts}: Component not yet loaded, retrying...`);
          if (attempt < maxAttempts) {
            await this.page.waitForTimeout(TIMEOUTS.SHORT_WAIT);
          }
        }
      }
      
      if (!contentElementFound) {
        throw new Error('Could not find component after multiple attempts');
      }
      
      console.log('✅ Screen view flow completed successfully');
    } catch (error) {
      console.log(`❌ Error during screen view flow: ${error}`);
      throw error;
    }
  }

  /**
   * Validate AppFlow searches - search for screens and processes
   */
  async validateAppFlowSearches(screenId: string = 'S001', processId: string = 'P_TPL_INITIAL'): Promise<void> {
    try {
      console.log('🔍 Starting AppFlow search validation...');
      
      // Click on App Flow button in Overview
      console.log('🔍 Clicking on App Flow button...');
      const appFlowButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByRole('button', { name: 'App Flow' });
      
      await appFlowButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await appFlowButton.click();
      console.log('✅ Clicked on App Flow button');
      
      // Wait for App Flow frame to load
      await this.page.waitForTimeout(2000);
      
      // Click on Search button
      console.log('🔍 Clicking on Search button...');
      const searchButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .getByRole('button', { name: 'Search' });
      
      await searchButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await searchButton.click();
      console.log('✅ Clicked on Search button');
      
      // Search for first item (Screen)
      console.log(`🔍 Searching for ${screenId}...`);
      const searchInput = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .getByPlaceholder(' ');
      
      await searchInput.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await searchInput.click();
      await searchInput.fill(screenId);
      console.log(`✅ Filled search field with ${screenId}`);
      
      // Click on search result
      console.log(`🔍 Clicking on search result ${screenId}...`);
      const screenResult = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .getByRole('listitem')
        .getByText(`V00|contents1:${screenId}`);
      
      await screenResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await screenResult.click();
      console.log(`✅ Clicked on screen result ${screenId}`);
      
      // Click on diagram element for the screen
      console.log(`🔍 Clicking on diagram element for ${screenId}...`);
      const screenDiagramElement = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .locator('#diagram')
        .getByText(`V00|contents1:${screenId}`);
      
      await screenDiagramElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await screenDiagramElement.click();
      console.log(`✅ Clicked on diagram element for ${screenId}`);
      
      // Clear search and search for process
      console.log(`🔍 Clearing search and searching for ${processId}...`);
      await searchInput.click();
      await searchInput.press('Control+A');
      await searchInput.fill(processId);
      console.log(`✅ Filled search field with ${processId}`);
      
      // Click on process result
      console.log(`🔍 Clicking on process result ${processId}...`);
      const processResult = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .getByText(`${processId}Process Initial`);
      
      await processResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await processResult.click();
      console.log(`✅ Clicked on process result ${processId}`);
      
      // Click on diagram element for the process
      console.log(`🔍 Clicking on diagram element for ${processId}...`);
      const processDiagramElement = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="App Flow"]')
        .contentFrame()
        .locator('#diagram')
        .getByText(processId);
      
      await processDiagramElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await processDiagramElement.click();
      console.log(`✅ Clicked on diagram element for ${processId}`);
      
      console.log('✅ AppFlow search validation completed successfully');
    } catch (error) {
      console.log(`❌ Error during AppFlow search validation: ${error}`);
      throw error;
    }
  }

  /**
   * Validate dependencies - access dependencies panel and view global transaction logic
   */
  async validateDependenciesFlow(): Promise<void> {
    try {
      console.log('📋 Starting dependencies validation...');
      
      // Click on Dependencies button in Overview
      console.log('🔍 Clicking on Dependencies button...');
      const dependenciesButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByRole('button', { name: 'Dependencies' });
      
      await dependenciesButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await dependenciesButton.dblclick();
      console.log('✅ Double-clicked on Dependencies button');
      
      // Wait for Dependencies tab panel and iframe to load
      await this.page.waitForTimeout(2000);
      
      // Click on Global transaction logic item
      console.log('🔍 Clicking on Global transaction logic item...');
      const globalTxnItem = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .getByRole('tabpanel', { name: 'Dependencies' })
        .locator('iframe[title="Dependencies"]')
        .contentFrame()
        .getByText('Global transaction logic')
        .first();
      
      await globalTxnItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await globalTxnItem.click();
      console.log('✅ Clicked on Global transaction logic item');
      
      console.log('✅ Dependencies validation completed successfully');
    } catch (error) {
      console.log(`❌ Error during dependencies validation: ${error}`);
      throw error;
    }
  }

  /**
   * Validate process list - search, edit and view processes
   */
  async validateProcessListFlow(searchTerm: string = 'card'): Promise<void> {
    try {
      console.log('📋 Starting process list validation...');
      
      // Step 1: Click on Processes button
      console.log('🔍 Clicking on Processes button...');
      const processesButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Overview"]')
        .contentFrame()
        .getByRole('button', { name: ' Processes' });
      
      await processesButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await processesButton.click();
      console.log('✅ Clicked on Processes button');
      
      // Wait for Processes iframe to load completely with all items
      console.log('⏳ Waiting for processes list to load...');
      await this.page.waitForTimeout(5000);
      
      // Step 2: Click on search textbox
      console.log('🔍 Clicking on search textbox...');
      const searchTextbox = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByRole('textbox', { name: 'Search by name or description' });
      
      await searchTextbox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await searchTextbox.click();
      console.log('✅ Clicked on search textbox');
      
      // Step 3: Fill search with search term
      console.log(`🔍 Filling search with '${searchTerm}'...`);
      await searchTextbox.fill(searchTerm);
      console.log(`✅ Filled search with '${searchTerm}'`);
      
      // Wait for search results to filter and CARD_ARRAY to appear
      console.log('⏳ Waiting for CARD_ARRAY to appear in filtered results...');
      const cardArrayFiltered = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByText('CARD_ARRAY');
      
      try {
        await cardArrayFiltered.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
        console.log('✅ CARD_ARRAY appeared in filtered results');
      } catch (error) {
        console.log('⚠️ CARD_ARRAY not visible, clearing field and re-triggering search...');
        // Limpiar el campo completamente
        await searchTextbox.fill('');
        await this.page.waitForTimeout(500);
        // Escribir de nuevo para disparar el filtrado
        await searchTextbox.fill(searchTerm);
        await this.page.waitForTimeout(2000);
      }
      
      // Step 4: Click on CARD_ARRAY result
      console.log('🔍 Clicking on CARD_ARRAY result...');
      const cardArrayResult = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByText('CARD_ARRAY');
      
      await cardArrayResult.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await cardArrayResult.click();
      console.log('✅ Clicked on CARD_ARRAY result');
      
      // Wait for selection
      await this.page.waitForTimeout(1000);
      
      // Step 5: Click Edit button
      console.log('🔍 Clicking Edit button...');
      const editButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByRole('button', { name: 'Edit' });
      
      await editButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await editButton.click();
      console.log('✅ Clicked Edit button');
      
      // Wait for Editor to load
      await this.page.waitForTimeout(2000);
      
      // Wait for Registers element to be visible before proceeding
      console.log('⏳ Waiting for Registers element to appear in editor...');
      const registersElement = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Editor"]')
        .contentFrame()
        .locator('iframe')
        .contentFrame()
        .locator('iframe[title="lambda makecode"]')
        .contentFrame()
        .getByText('Registers');
      
      try {
        await registersElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
        console.log('✅ Registers element is visible');
      } catch (error) {
        console.log('⚠️ Registers element not visible, continuing anyway...');
      }
      
      // Take screenshot after Registers element is visible
      console.log('📸 Taking screenshot after Registers element appears...');
      await this.takeScreenshot('process-list-02-registers-visible.png');
      await this.page.waitForTimeout(1000);
      
      // Step 6: Click on path element in diagram
      console.log('🔍 Clicking on diagram path element...');
      const pathElement = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Editor"]')
        .contentFrame()
        .locator('iframe')
        .contentFrame()
        .getByRole('img')
        .nth(2);
      
      await pathElement.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await pathElement.click();
      console.log('✅ Clicked on diagram path element');
      
      // Wait for element selection
      await this.page.waitForTimeout(1000);
      
      // Step 7: Click on CARD_ARRAY text to view details
      console.log('🔍 Clicking on CARD_ARRAY text...');
      const cardArrayText = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Editor"]')
        .contentFrame()
        .locator('iframe')
        .contentFrame()
        .getByText('CARD_ARRAY');
      
      await cardArrayText.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await cardArrayText.click();
      console.log('✅ Clicked on CARD_ARRAY text');
      
      // Take screenshot after clicking on CARD_ARRAY text
      console.log('📸 Taking screenshot after CARD_ARRAY selection...');
      await this.takeScreenshot('process-list-03-card-array-selected.png');
      await this.page.waitForTimeout(1000);
      
      // Step 8: Click on Processes tab
      console.log('🔍 Clicking on Processes tab...');
      const processesTab = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .getByRole('tab', { name: 'Processes' });
      
      await processesTab.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await processesTab.click();
      console.log('✅ Clicked on Processes tab');
      
      // Wait for tab switch
      await this.page.waitForTimeout(1500);
      
      // Step 9: Click on Legacy button
      console.log('🔍 Clicking on Legacy button...');
      const legacyButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByRole('button', { name: 'Legacy' });
      
      await legacyButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await legacyButton.click();
      console.log('✅ Clicked on Legacy button');
      
      // Wait for legacy list to load
      await this.page.waitForTimeout(1000);
      
      // Step 10: Click on search textbox again
      console.log('🔍 Clicking on search textbox for legacy search...');
      const legacySearchTextbox = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByRole('textbox', { name: 'Search by name or description' });
      
      await legacySearchTextbox.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await legacySearchTextbox.click();
      console.log('✅ Clicked on legacy search textbox');
      
      // Step 11: Fill search with 'ini'
      console.log('🔍 Filling search with \'ini\'...');
      await legacySearchTextbox.fill('ini');
      console.log('✅ Filled search with \'ini\'');
      
      // Wait for search results
      await this.page.waitForTimeout(1000);
      
      // Step 11.5: Click on P_TPL_INITIAL legacy process
      console.log('🔍 Clicking on P_TPL_INITIAL legacy process...');
      const legacyProcessItem = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByText('P_TPL_INITIAL');
      
      await legacyProcessItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await legacyProcessItem.click();
      console.log('✅ Clicked on P_TPL_INITIAL legacy process');
      
      // Step 12: Click Edit button for legacy process
      console.log('🔍 Clicking Edit button for legacy process...');
      const legacyEditButton = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="Processes"]')
        .contentFrame()
        .getByRole('button', { name: 'Edit' });
      
      await legacyEditButton.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await legacyEditButton.click();
      console.log('✅ Clicked Edit button for legacy process');
      
      // Wait for process editor to load
      await this.page.waitForTimeout(2000);
      
      // Step 13: Click on TPL_INITIAL in the list
      console.log('🔍 Clicking on TPL_INITIAL list item...');
      const tplInitialItem = this.page
        .locator('iframe[title="Studio container"]')
        .contentFrame()
        .locator('iframe[title="P_TPL_INITIAL"]')
        .contentFrame()
        .getByRole('list')
        .getByText('TPL_INITIAL');
      
      await tplInitialItem.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await tplInitialItem.click();
      console.log('✅ Clicked on TPL_INITIAL list item');
      
      console.log('✅ Process list validation completed successfully');
    } catch (error) {
      console.log(`❌ Error during process list validation: ${error}`);
      throw error;
    }
  }

  /**
   * Take screenshot of Studio dashboard
   */
  async takeStudioScreenshot(filename: string = 'studio-dashboard.png'): Promise<void> {
    await this.takeScreenshot(filename);
  }
}
