import { test, expect } from '@playwright/test';
import path from 'path';

test('signup, login, and create post with text and image', async ({ page }) => {
  // Go to signup page and create user
  await page.goto('http://localhost:5173/signup');
  await page.fill('input[type="text"]', 'testuser');
  await page.fill('input[type="email"]', 'testuser@example.com');
  const passwordInputs = await page.$$('input[type="password"]');
  await passwordInputs[0].fill('password1234');
  await passwordInputs[1].fill('password1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Go to login page
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'testuser@example.com');
  await page.fill('input[type="password"]', 'password1234');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Always navigate to post creation page after login
  await page.goto('http://localhost:5173/posts/create');
  // Debug: print current URL
  console.log('Current URL after login:', page.url());
  // Take a screenshot for debugging
  await page.screenshot({ path: 'debug-post-create.png' });
  // Wait for the textarea to appear
  await page.waitForSelector('textarea', { timeout: 10000 });

  // Fill in content
  await page.fill('textarea', 'Automated test post with image!');

  // Upload image
  const filePath = path.resolve(__dirname, '../../../test_image.jpg');
  await page.setInputFiles('input[type="file"]', filePath);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for success message
  await expect(page.locator('text=Post created successfully!')).toBeVisible();

  // Check that the post appears in the list
  await expect(page.locator('text=Automated test post with image!')).toBeVisible();
  await expect(page.locator('img')).toBeVisible();
}); 