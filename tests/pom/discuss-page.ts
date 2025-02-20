import { Locator, Page } from "playwright";
import { CommentDetail } from "./types";

// this has to be initialized with page because it's dynamic depending on item
// instead of inheriting from abstract page with common url prefix
class DiscussPage {
  private page: Page;
  private $titleAnchorLocator: Locator;
  private $textAreaLocator: Locator;
  private $addCommentBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.initLocators();
  }

  private initLocators() {
    this.$titleAnchorLocator = this.page.locator("td.title > span.titleline a");
    this.$textAreaLocator = this.page.locator("textarea");
    this.$addCommentBtn = this.page.getByRole("button", {
      name: "add comment",
    });
  }

  public async getTitle() {
    const title = await this.$titleAnchorLocator.innerText();
    return title;
  }

  public async addComment(content: string) {
    await this.$textAreaLocator.fill(content);
    await this.$addCommentBtn.click();
  }

  public async getComments() {
    const rows = await this.page
      .locator("table.comment-tree > tbody > tr")
      .all();
    const comments: CommentDetail[] = [];
    for (const row of rows) {
      const userAnchorLocator = row.locator("a.hnuser");
      const dateAnchorLocator = row.locator("span.age > a");
      const contentLocator = row.locator("div.comment > div.commtext");
      const replyLocator = row.getByRole("link", { name: "reply" });
      comments.push({
        userAnchorLocator,
        dateAnchorLocator,
        contentLocator,
        replyLocator,
      });
    }
  }
}

export default DiscussPage;
