import { PostDetail } from "../types";

class Post {
  private details: PostDetail;

  constructor(details: PostDetail) {
    this.details = details;
  }

  public async getTitle() {
    return this.details.titleAnchorLocator?.innerText() || null;
  }

  public async getScore() {
    const scoreText = await this.details.scoreLocator?.innerText();
    if (!scoreText) {
      throw new Error("Post does not have score.");
    }
    const score = parseInt(scoreText.split(" ")[0]);
    return score;
  }

  public async isUpvoteButtonVisible() {
    return this.details.upvoteAnchorLocator?.isVisible() || false;
  }

  public async upvote() {
    const isVisible = await this.isUpvoteButtonVisible();
    if (!isVisible || !this.details.upvoteAnchorLocator) {
      throw new Error("Upvote button not found");
    }
    await this.details.upvoteAnchorLocator.click();
  }

  public async isUnvoteButtonVisible() {
    return this.details.unvoteLocator?.isVisible() || false;
  }

  public async unvote() {
    const isVisible = await this.isUnvoteButtonVisible();
    if (!isVisible || !this.details.upvoteAnchorLocator) {
      throw new Error("Unvote button not found");
    }
    await this.details.upvoteAnchorLocator.click();
  }

  public async hide() {
    if (!this.details.hideAnchorLocator) {
      throw new Error("Hide button not found");
    }
    await this.details.hideAnchorLocator.click();
  }

  public async navigateDiscussPage() {
    if (!this.details.commentAnchorLocator) {
      throw new Error("Discuss navigation anchor not found");
    }
    await this.details.commentAnchorLocator.click();
  }
}

export default Post;
