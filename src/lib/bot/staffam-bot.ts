import { chromium, type Browser } from 'playwright';
import { BaseBot, type BotResult } from './base-bot';

export class StaffAmBot extends BaseBot {
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

        await page.goto(params.jobUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await this.delay(1500, 3000);

        // Look for apply button on staff.am
        const applyButton = await page.$('a.apply-btn, button.apply-btn, .job-apply-btn a');

        if (!applyButton) {
          return {
            success: false,
            message: 'Apply button not found on staff.am. The page structure may have changed.',
          };
        }

        await applyButton.click();
        await this.delay(2000, 4000);

        // Fill cover letter if field exists
        const letterField = await page.$('textarea[name="cover_letter"], textarea.cover-letter');
        if (letterField && params.coverLetter) {
          await letterField.fill('');
          await this.humanType(page, 'textarea[name="cover_letter"]', params.coverLetter);
          await this.delay(500, 1000);
        }

        // Upload resume if available
        if (params.resumePath) {
          const fileInput = await page.$('input[type="file"]');
          if (fileInput) {
            await fileInput.setInputFiles(params.resumePath);
            await this.delay(1000, 2000);
          }
        }

        // Submit
        const submitButton = await page.$('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await this.delay(2000, 3000);
        }

        await this.browser.close();

        return {
          success: true,
          message: 'Application submitted successfully on staff.am',
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
