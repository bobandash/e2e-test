// fixture to use all playwright page object models
import { test as base, expect } from "@playwright/test";
import {
  NewestPage,
  AskPage,
  CommentsPage,
  JobsPage,
  PastPage,
  ShowPage,
  SubmitPage,
  BasePage,
} from "./pom";
import { LoginPage } from "./pom/login-page";

type MyFixtures = {
  basePage: BasePage;
  askPage: AskPage;
  commentsPage: CommentsPage;
  jobsPage: JobsPage;
  newestPage: NewestPage;
  pastPage: PastPage;
  showPage: ShowPage;
  submitPage: SubmitPage;
  loginPage: LoginPage;
};

const test = base.extend<MyFixtures>({
  basePage: async ({ page }, use) => {
    await use(new BasePage(page, ""));
  },
  askPage: async ({ page }, use) => {
    await use(new AskPage(page, "ask"));
  },
  commentsPage: async ({ page }, use) => {
    await use(new CommentsPage(page, "newcomments"));
  },
  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page, "jobs"));
  },
  newestPage: async ({ page }, use) => {
    await use(new NewestPage(page, "newest"));
  },
  pastPage: async ({ page }, use) => {
    await use(new PastPage(page, "front"));
  },
  showPage: async ({ page }, use) => {
    await use(new ShowPage(page, "show"));
  },
  submitPage: async ({ page }, use) => {
    await use(new SubmitPage(page, "submit"));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page, "login"));
  },
});

test.afterEach(async () => {
  const delay = Math.floor(Math.random() * 2000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));
});

export { test, expect };
