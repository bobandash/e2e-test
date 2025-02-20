// https://playwright.dev/docs/locators
// https://www.youtube.com/watch?v=k488kAtT-Pw

export function isSortedByNewest(dates: Date[]) {
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] > dates[i - 1]) {
      return false;
    }
  }
  return true;
}
