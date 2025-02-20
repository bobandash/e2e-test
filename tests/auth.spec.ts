import { test, expect } from "./base";
import { simpleFaker } from "@faker-js/faker";
import { testAccount } from "./constants";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goto();
});

// main cases for create account and login
test("should fail to create account if username is already taken", async ({
  loginPage,
  page,
}) => {
  await loginPage.createAccount(
    testAccount.username,
    simpleFaker.string.alpha(10)
  );
  await expect(
    page.getByText("That username is taken. Please choose another")
  ).toBeVisible();
});

test("should fail to login account if credentials are invalid", async ({
  loginPage,
  page,
}) => {
  await loginPage.loginAccount(
    testAccount.username,
    simpleFaker.string.alpha(10)
  );
  await expect(page.getByText("Bad Login.")).toBeVisible();
});

test("should redirect to news after successful login", async ({
  loginPage,
  page,
}) => {
  await loginPage.loginAccount(testAccount.username, testAccount.password);
  expect(page).toHaveURL("https://news.ycombinator.com/");
});
