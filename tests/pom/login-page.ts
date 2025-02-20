import { Locator, type Page, expect } from "@playwright/test";
import { AbstractPage } from "./abstract-classes/abstract-page";

type FormElements = {
  usernameInput: Locator;
  passwordInput: Locator;
  submitBtn: Locator;
};

export class LoginPage extends AbstractPage {
  private $loginForm: FormElements;
  private $createAccountForm: FormElements;

  constructor(page: Page, urlSuffix: string) {
    super(page, urlSuffix);
    this.initLocators();
  }

  private async initLocators() {
    const forms = this.page.locator("form");
    const loginForm = forms.nth(0);
    const createAccountForm = forms.nth(1);

    this.$loginForm = {
      usernameInput: loginForm.locator('input[name="acct"]'),
      passwordInput: loginForm.locator('input[name="pw"]'),
      submitBtn: loginForm.getByRole("button", { name: "login" }),
    };

    this.$createAccountForm = {
      usernameInput: createAccountForm.locator('input[name="acct"]'),
      passwordInput: createAccountForm.locator('input[name="pw"]'),
      submitBtn: createAccountForm.getByRole("button", {
        name: "create account",
      }),
    };
  }

  public async createAccount(username: string, password: string) {
    await this.$createAccountForm.usernameInput.fill(username);
    await this.$createAccountForm.passwordInput.fill(password);
    await this.$createAccountForm.submitBtn.click();
    await this.finishRender();
  }

  public async loginAccount(username: string, password: string) {
    await this.$loginForm.usernameInput.fill(username);
    await this.$loginForm.passwordInput.fill(password);
    await this.$loginForm.submitBtn.click();
    await this.finishRender();
  }

  private async hasCaptcha() {}

  private async bypassCaptcha() {}
}
