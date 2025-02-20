import { type Page } from "@playwright/test";
import { AbstractPage } from "./abstract-classes/abstract-page";

export class SubmitPage extends AbstractPage {
  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
  }
}
