import type { Browser, Page } from 'playwright';

export interface BotResult {
  success: boolean;
  message: string;
  screenshotUrl?: string;
}

export abstract class BaseBot {
  protected page: Page | null = null;

  protected async delay(min: number, max: number): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  protected async humanType(page: Page, selector: string, text: string): Promise<void> {
    await page.click(selector);
    for (const char of text) {
      await page.keyboard.type(char, { delay: Math.random() * 100 + 30 });
    }
  }

  abstract apply(params: {
    jobUrl: string;
    coverLetter: string;
    resumePath?: string;
  }): Promise<BotResult>;

  getFallbackInstructions(jobUrl: string): string {
    return `Auto-apply failed. Please apply manually:\n1. Open ${jobUrl}\n2. Click the Apply button\n3. Fill in your details\n4. Paste your cover letter\n5. Submit the application`;
  }
}
