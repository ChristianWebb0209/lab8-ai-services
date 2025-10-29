import { test, expect } from '@playwright/test';

test.describe('Eliza Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.selectOption('#model-select', 'eliza');


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

    test('should respond to greeting patterns', async ({ page }) => {
        const testMessage = 'Hello there!';
        await page.fill('#message-input', testMessage);
        await page.click('#send-button');

        await page.waitForTimeout(100);

        const messages = page.locator('.message');
        const messageCount = await messages.count();

        expect(messageCount).toBeGreaterThanOrEqual(2);
    });

    test('should handle multiple messages in a conversation', async ({ page }) => {
        const messages = ['Hello', 'How are you?', 'Thank you'];

        for (const msg of messages) {
            await page.fill('#message-input', msg);
            await page.click('#send-button');
            await page.waitForTimeout(300);
        }

        await page.waitForTimeout(100);

        const allMessages = page.locator('.message');
        const messageCount = await allMessages.count();
        expect(messageCount).toBeGreaterThanOrEqual(6);
    });

});

