import { test, expect } from '@playwright/test';

test.describe('Gemini AI Chatbot Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.selectOption('#model-select', 'gemini');

        await page.evaluate(() => {
            // return random api key
            window.prompt = () => 'ranodm-key-12312094';
        });

        await page.waitForTimeout(50);

        // clear the page before each new test
        const clearButton = page.locator('#clear-button');
        if (await clearButton.isVisible()) {
            await clearButton.click();
            await page.evaluate(() => {
                window.confirm = () => true;
            });
            await clearButton.click();
        }
    });

    test('should create message for gemini', async ({ page }) => {
        const testMessage = 'this is a test question';

        await page.fill('#message-input', testMessage);
        await page.click('#send-button');

        // sometimes it takes a while so wait a good amount
        await page.waitForTimeout(3000);

        // should have created message
        const messages = page.locator('.message');
        const messageCount = await messages.count();
        expect(messageCount).toBeGreaterThanOrEqual(2);
    });

    test('switching between models should work', async ({ page }) => {
        await expect(page.locator('#model-select')).toHaveValue('gemini');

        await page.selectOption('#model-select', 'eliza');
        await page.waitForTimeout(100);
        await expect(page.locator('#model-select')).toHaveValue('eliza');

        await page.selectOption('#model-select', 'gemini');
        await page.waitForTimeout(100);
        await expect(page.locator('#model-select')).toHaveValue('gemini');
    });
});

