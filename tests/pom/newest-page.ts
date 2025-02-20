import { Locator, type Page } from "@playwright/test";
import { ListPage } from "./abstract-classes/list-page";

type PostDetail = {
  rank?: string;
  upvoteAnchorLocator?: Locator;
  titleAnchorLocator?: Locator;
  scoreLocator?: Locator;
  hideAnchorLocator?: Locator;
  pastAnchorLocator?: Locator;
  commentAnchorLocator?: Locator;
  dateAnchorLocator?: Locator;
  unvoteLocator?: Locator;
};

export class NewestPage extends ListPage {
  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
  }

  private async getDetails(row: Locator, identifier: string) {
    // generic get details
    const locator = row.locator(identifier);
    const hasLocator = (await locator.count()) > 0;
    let text = "";
    if (hasLocator) {
      text = (await locator.textContent()) ?? "";
    }
    return { locator, hasLocator, text };
  }

  private async getSubtitleDetails(row: Locator) {
    const subline = row.locator("span.subline");
    const hasLocator = (await subline.count()) > 0;
    if (!hasLocator) {
      return null;
    }

    const scoreLocator = subline.locator("span.score");
    const posterLocator = subline.locator("a.hnuser");
    const dateAnchorLocator = subline.locator("span.age a");
    const hideAnchorLocator = subline.getByRole("link", { name: "hide" });
    const pastAnchorLocator = subline.getByRole("link", { name: "past" });
    const unvoteLocator = subline.getByRole("link", { name: "unvote" });
    let commentAnchorLocator = subline.getByRole("link", { name: "discuss" });

    const commentAnchorExists = (await commentAnchorLocator.count()) > 0;
    if (!commentAnchorExists) {
      commentAnchorLocator = subline.getByRole("link", { name: /comment/i });
    }

    return {
      scoreLocator,
      posterLocator,
      dateAnchorLocator,
      hideAnchorLocator,
      pastAnchorLocator,
      unvoteLocator,
      commentAnchorLocator,
    };
  }

  public async getPostByTitle(title: string | null) {
    const postDetails = await this.getPostDetails();
    for (const details of postDetails) {
      const postTitle = await details.titleAnchorLocator?.innerText();
      if (postTitle === title) {
        return new Post(details);
      }
    }

    return null;
  }

  public async getPosts() {
    const postDetails = await this.getPostDetails();
    return postDetails.map((detail) => new Post(detail));
  }

  private async getPostDetails() {
    const rows = await this.page
      .locator("table > tbody > tr > td > table > tbody > tr")
      .all();
    let currentPost: PostDetail = {};
    const posts: PostDetail[] = [];

    for (const row of rows) {
      const rankDetails = await this.getDetails(row, "td span.rank");
      const titleDetails = await this.getDetails(
        row,
        "td.title span.titleline > a:first-child"
      );
      const voteDetails = await this.getDetails(row, "td.votelinks a");
      const subtitleDetails = await this.getSubtitleDetails(row);

      if (rankDetails.hasLocator && voteDetails.hasLocator) {
        if (Object.keys(currentPost).length > 0) {
          posts.push({ ...currentPost });
        }
        currentPost = {
          rank: rankDetails.text,
          upvoteAnchorLocator: voteDetails.locator,
        };
      }

      if (titleDetails.hasLocator) {
        currentPost.titleAnchorLocator = titleDetails.locator;
      }

      if (subtitleDetails) {
        currentPost.scoreLocator = subtitleDetails.scoreLocator;
        currentPost.hideAnchorLocator = subtitleDetails.hideAnchorLocator;
        currentPost.scoreLocator = subtitleDetails.scoreLocator;
        currentPost.commentAnchorLocator = subtitleDetails.commentAnchorLocator;
        currentPost.dateAnchorLocator = subtitleDetails.dateAnchorLocator;
        currentPost.unvoteLocator = subtitleDetails.unvoteLocator;
      }
    }

    if (Object.keys(currentPost).length > 0) {
      posts.push({ ...currentPost });
    }

    return posts;
  }
}

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
}
