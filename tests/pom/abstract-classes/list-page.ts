import { Locator, type Page } from "@playwright/test";
import { AbstractPage } from "./abstract-page";

// these are pages in https://news.ycombinator.com/
// with lists (comments, posts, dates, etc.)

export class ListPage extends AbstractPage {
  private $moreBtn: Locator;

  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
    this.initLocators();
  }

  public async getDates() {
    const dates = await this.page
      .locator("span.age")
      .evaluateAll((spans) => spans.map((span) => span.getAttribute("title")));
    const datesWithoutTimestamp = dates
      .map((date) => {
        if (!date) {
          return null;
        }
        const dateWithoutTimestamp = date.split(" ")[0];
        return new Date(dateWithoutTimestamp);
      })
      .filter((date) => date != null);
    return datesWithoutTimestamp;
  }
  private initLocators() {
    this.$moreBtn = this.page.getByRole("link", { name: "More", exact: true });
  }

  public async navigateNextPage() {
    await this.$moreBtn.click();
    this.page.waitForLoadState("domcontentloaded");
    this.initLocators();
  }
}
