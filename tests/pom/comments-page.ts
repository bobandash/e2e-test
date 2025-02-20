import { type Page } from "@playwright/test";
import { ListPage } from "./abstract-classes/list-page";

export class CommentsPage extends ListPage {
  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
  }
}
