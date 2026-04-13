import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Settings iframe inside Studio container.
 */
export class SettingsIframeComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getTextElement(text: string): Locator {
    return this.frame.getByText(text);
  }
}
