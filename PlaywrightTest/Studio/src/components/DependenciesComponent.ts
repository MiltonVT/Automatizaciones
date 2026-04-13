import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the Dependencies iframe inside Studio container.
 */
export class DependenciesComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  getItem(text: string): Locator {
    return this.frame.getByText(text).first();
  }
}
