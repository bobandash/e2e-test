import { test, expect } from "./base";
import { isSortedByNewest } from "./util";

// for list of new posts
test.beforeEach(async ({ jobsPage }) => {
  await jobsPage.goto();
});

test("should render first 100 jobs by newest", async ({ jobsPage }) => {
  const allDates: Date[] = [];
  while (allDates.length < 100) {
    let dates = await jobsPage.getDates();
    if (dates.length === 0) {
      throw new Error("There are no dates in this page.");
    }
    if (dates.length + allDates.length > 100) {
      const numDatesToAdd = 100 - allDates.length;
      dates = dates.slice(0, numDatesToAdd);
    }
    allDates.push(...dates);
    await jobsPage.navigateNextPage();
  }
  expect(isSortedByNewest(allDates)).toBe(true);
});
