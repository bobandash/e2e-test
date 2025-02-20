const { chromium } = require("playwright");
const NUM_ARTICLES_TO_VERIFY = 100;

async function getHackerNewsArticleDates(page) {
  const dates = await page
    .locator("span.age")
    .evaluateAll((spans) => spans.map((span) => span.getAttribute("title")));
  const datesWithoutTimestamp = dates.map((date) => date.split(" ")[0]);
  return datesWithoutTimestamp;
}

function formatDates(dates) {
  const formattedDates = dates.map((date) => new Date(date));
  if (formattedDates.some((date) => isNaN(date))) {
    throw new Error("HackerNews date format is invalid.");
  }
  return formattedDates;
}

async function getDates(page, numArticles) {
  const allDates = [];

  while (allDates.length < numArticles) {
    let dates = await getHackerNewsArticleDates(page);
    if (dates.length + allDates.length > numArticles) {
      const numDatesToAdd = numArticles - allDates.length;
      dates = dates.slice(0, numDatesToAdd);
    }
    allDates.push(...dates);
    const loadMoreBtn = getLoadMoreBtn(page);
    const isLoadMoreBtnVisible = (await loadMoreBtn.count()) > 0;

    // if not possible to fetch any more articles, throw error and terminate
    if (!isLoadMoreBtnVisible && allDates.length < numArticles) {
      throw new Error("There are not enough articles to verify.");
    }

    await loadMoreBtn.click();
    await page.waitForLoadState();
  }

  const formattedDates = formatDates(allDates);
  return formattedDates;
}

function isSortedByNewest(formattedDates) {
  for (let i = 1; i < formattedDates.length; i++) {
    if (formattedDates[i] > formattedDates[i - 1]) {
      return false;
    }
  }
  return true;
}

function getLoadMoreBtn(page) {
  const btn = page.getByRole("link", { name: "More", exact: true });
  return btn;
}

async function sortHackerNewsArticles() {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");
    const dates = await getDates(page, NUM_ARTICLES_TO_VERIFY);
    if (isSortedByNewest(dates)) {
      console.log("Dates in HackerNews are sorted properly by newest.");
    } else {
      console.log("Dates in HackerNews are NOT sorted properly by newest.");
    }
  } catch (error) {
    console.error("ERROR:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
