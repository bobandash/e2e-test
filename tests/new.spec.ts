import { test, expect } from "./base";
import { testAccount } from "./constants";
import DiscussPage from "./pom/discuss-page";
import { isSortedByNewest } from "./util";

// for list of new posts
test.beforeEach(async ({ newestPage }) => {
  await newestPage.goto();
});

test("should render first 100 posts by newest", async ({ newestPage }) => {
  const allDates: Date[] = [];
  while (allDates.length < 100) {
    let dates = await newestPage.getDates();
    if (dates.length === 0) {
      throw new Error("There are no dates in this page.");
    }
    if (dates.length + allDates.length > 100) {
      const numDatesToAdd = 100 - allDates.length;
      dates = dates.slice(0, numDatesToAdd);
    }
    allDates.push(...dates);
    await newestPage.navigateNextPage();
  }
  expect(isSortedByNewest(allDates)).toBe(true);
});

test("should not be able to hide posts if not signed in", async ({
  newestPage,
  page,
}) => {
  const postDetails = await newestPage.getPosts();
  await postDetails[0].hide();
  await expect(
    page.getByText("You have to be logged in to hide.")
  ).toBeVisible();
});

test("should be able to hide posts if logged in", async ({
  loginPage,
  newestPage,
  page,
}) => {
  await test.step("Log in", async () => {
    await loginPage.goto();
    await loginPage.loginAccount(testAccount.username, testAccount.password);
  });

  await test.step("Hide first post", async () => {
    await newestPage.goto();
    const firstPost = (await newestPage.getPosts())[0];
    const title = await firstPost.getTitle();
    if (!title) {
      throw new Error("Post does not have title.");
    }
    await firstPost.hide();
    await expect(page.getByText(title)).not.toBeVisible();
  });
});

test("should be able to upvote posts and increase points", async ({
  loginPage,
  newestPage,
  page,
}) => {
  await test.step("Log in", async () => {
    await loginPage.goto();
    await loginPage.loginAccount(testAccount.username, testAccount.password);
  });

  await test.step("Upvote Post", async () => {
    await newestPage.goto();
    const posts = await newestPage.getPosts();
    const firstPost = posts[0];

    const title = await firstPost.getTitle();
    if (!title) {
      throw new Error("Could not get post title");
    }

    // if there's an unvote button, I have to clear it
    const unvoteBtnExists = await firstPost.isUnvoteButtonVisible();
    if (unvoteBtnExists) {
      await firstPost.unvote();
      await page.reload();

      const refreshedPost = await newestPage.getPostByTitle(title);
      if (!refreshedPost) {
        throw new Error("Could not find post after reload");
      }
      const oldScore = await refreshedPost.getScore();
      await refreshedPost.upvote();
      expect(await refreshedPost.isUpvoteButtonVisible()).toBe(false);

      // Reload again to check updated score
      await page.reload();
      const newPost = await newestPage.getPostByTitle(title);
      const newRenderedScore = await newPost?.getScore();
      expect(newRenderedScore).toBeGreaterThan(oldScore);
    } else {
      const oldScore = await firstPost.getScore();
      await firstPost.upvote();
      expect(await firstPost.isUpvoteButtonVisible()).toBe(false);

      // Reload again to check updated score
      await page.reload();
      const newPost = await newestPage.getPostByTitle(title);
      const newRenderedScore = await newPost?.getScore();
      expect(newRenderedScore).toBeGreaterThan(oldScore);
    }
  });
});

test("should not be able to comment on a post if not signed in", async ({
  newestPage,
  page,
}) => {
  await newestPage.goto();
  const posts = await newestPage.getPosts();
  const firstPost = posts[0];
  const title = await firstPost.getTitle();
  await firstPost.navigateDiscussPage();

  const discussPage = new DiscussPage(page);
  await discussPage.addComment("test");

  await expect(
    page.getByText("You have to be logged in to comment.")
  ).toBeVisible();
});
