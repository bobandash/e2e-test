import { Locator, type Page } from "@playwright/test";
import { ListPage } from "./abstract-classes/list-page";
import { PostDetail } from "./types";
import Post from "./subsections/posts";

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
