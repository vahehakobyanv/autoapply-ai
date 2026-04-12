import { chromium, type Browser, type Page } from 'playwright';
import { BaseBot, type BotResult } from './base-bot';

export class HHBot extends BaseBot {
  private browser: Browser | null = null;

  async apply(params: {
    jobUrl: string;
    coverLetter: string;
    resumePath?: string;
  }): Promise<BotResult> {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.browser = await chromium.launch({ headless: true });
        const context = await this.browser.newContext({
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          viewport: { width: 1280, height: 800 },
        });
        const page = await context.newPage();

        // Navigate to the job page
        await page.goto(params.jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.delay(1500, 3000);

        // Look for the respond/apply button
        const applyButton = await page.$(
          'a[data-qa="vacancy-response-link-top"], button[data-qa="vacancy-response-link-top"]'
        );

        if (!applyButton) {
          return {
            success: false,
            message: 'Apply button not found. The job may require login or has been removed.',
          };
        }

        await applyButton.click();
        await this.delay(2000, 4000);

        // Check if a cover letter field exists
        const letterField = await page.$('textarea[data-qa="vacancy-response-popup-form-letter-input"]');
        if (letterField && params.coverLetter) {
          await letterField.fill('');
          await this.humanType(page, 'textarea[data-qa="vacancy-response-popup-form-letter-input"]', params.coverLetter);
          await this.delay(500, 1000);
        }

        // Submit the application
        const submitButton = await page.$(
          'button[data-qa="vacancy-response-submit-popup"], button[data-qa="vacancy-response-letter-submit"]'
        );

        if (submitButton) {
          await submitButton.click();
          await this.delay(2000, 3000);
        }

        await this.browser.close();

        return {
          success: true,
          message: 'Application submitted successfully on hh.ru',
        };
      } catch (error: any) {
        if (this.browser) await this.browser.close();

        if (attempt === maxRetries) {
          return {
            success: false,
            message: `Failed after ${maxRetries} attempts: ${error.message}`,
          };
        }

        await this.delay(2000, 5000);
      }
    }

    return { success: false, message: 'Unknown error' };
  }
}
