import { type Locator, type Page } from "@playwright/test";
import { AbstractPage } from "./abstract-classes/abstract-page";

export class BasePage extends AbstractPage {
  private $newLink: Locator;
  private $pastLink: Locator;
  private $commentsLink: Locator;
  private $askLink: Locator;
  private $showLink: Locator;
  private $jobsLink: Locator;
  private $submitLink: Locator;

  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
    this.initLocators();
  }

  private initLocators() {
    this.$newLink = this.page.getByRole("link", { name: "new", exact: true });
    this.$pastLink = this.page.getByRole("link", { name: "past", exact: true });
    this.$commentsLink = this.page.getByRole("link", {
      name: "comments",
      exact: true,
    });
    this.$askLink = this.page.getByRole("link", {
      name: "ask",
      exact: true,
    });
    this.$showLink = this.page.getByRole("link", {
      name: "show",
      exact: true,
    });
    this.$jobsLink = this.page.getByRole("link", {
      name: "jobs",
      exact: true,
    });
    this.$submitLink = this.page.getByRole("link", {
      name: "submit",
      exact: true,
    });
  }

  public async navigateNewPage() {
    await this.$newLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigatePastPage() {
    await this.$pastLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigateCommentsPage() {
    await this.$commentsLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigateAskPage() {
    await this.$askLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigateShowPage() {
    await this.$showLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigateJobsPage() {
    await this.$jobsLink.click();
    await this.finishRender();
    this.initLocators();
  }

  public async navigateSubmitPage() {
    await this.$submitLink.click();
    await this.finishRender();
    this.initLocators();
  }
}
