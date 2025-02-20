import { Locator } from "playwright";

export type PostDetail = {
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

// TODO: Add upvote button
export type CommentDetail = {
  userAnchorLocator?: Locator;
  dateAnchorLocator?: Locator;
  contentLocator?: Locator;
  replyLocator?: Locator;
};
