import { type Page } from "@playwright/test";

export class AbstractPage {
  public url: string;
  readonly page: Page;

  constructor(page: Page, urlSuffix: string) {
    this.url = "https://news.ycombinator.com/" + urlSuffix;
    this.page = page;
  }

  public async goto() {
    await this.page.goto(this.url);
  }

  protected async finishRender() {
    await this.page.waitForLoadState("domcontentloaded");
  }
}
