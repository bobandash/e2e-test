import { CommentDetail } from "../types";

class Comment {
  private details: CommentDetail;

  constructor(details: CommentDetail) {
    this.details = details;
  }

  public async getName() {
    return this.details.userAnchorLocator?.innerText() || null;
  }

  public async getContent() {
    return this.details.contentLocator?.innerText() || null;
  }

  public async isReplyButtonVisible() {
    return this.details.replyLocator?.isVisible() || false;
  }

  public async reply() {
    const isVisible = await this.isReplyButtonVisible();
    if (!isVisible || !this.details.replyLocator) {
      throw new Error("Reply button not found");
    }
    await this.details.replyLocator.click();
  }
}

export default Comment;
