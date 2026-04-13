import { FrameLocator, Locator } from '@playwright/test';
import { BaseComponent } from './base/BaseComponent';

/**
 * Component for the App Flow iframe inside Studio container.
 */
export class AppFlowComponent extends BaseComponent {
  constructor(frame: FrameLocator) {
    super(frame);
  }

  get searchButton(): Locator {
    return this.frame.getByRole('button', { name: 'Search' });
  }

  get searchInput(): Locator {
    return this.frame.getByPlaceholder(' ');
  }

  getListItem(text: string): Locator {
    return this.frame.getByRole('listitem').getByText(text);
  }

  getDiagramElement(text: string): Locator {
    return this.frame.locator('#diagram').getByText(text);
  }
}
