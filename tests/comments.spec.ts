import { test, expect } from "./base";
import { isSortedByNewest } from "./util";

// for list of new posts
test.beforeEach(async ({ commentsPage }) => {
  await commentsPage.goto();
});

test("should render first 100 comments by newest", async ({ commentsPage }) => {
  const allDates: Date[] = [];
  while (allDates.length < 100) {
    let dates = await commentsPage.getDates();
    if (dates.length === 0) {
      throw new Error("There are no dates in this page.");
    }
    if (dates.length + allDates.length > 100) {
      const numDatesToAdd = 100 - allDates.length;
      dates = dates.slice(0, numDatesToAdd);
    }
    allDates.push(...dates);
    await commentsPage.navigateNextPage();
  }
  expect(isSortedByNewest(allDates)).toBe(true);
});
