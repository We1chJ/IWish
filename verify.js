const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  // Test landing page
  console.log('📍 Landing page...');
  await page.goto('http://localhost:3000');
  await page.screenshot({ path: '/tmp/landing.png' });
  console.log('✅ Landing page loaded');
  
  // Test "Browse Wishes" button navigation
  console.log('📍 Clicking "Browse Wishes"...');
  await page.click('text=Browse Wishes');
  await page.waitForURL('**/feed');
  await page.screenshot({ path: '/tmp/feed.png' });
  console.log('✅ Feed page loaded');
  
  // Go back and test "Get Started" button
  console.log('📍 Going back to home...');
  await page.goto('http://localhost:3000');
  await page.click('text=Get Started');
  await page.waitForURL('**/auth/signup');
  await page.screenshot({ path: '/tmp/signup.png' });
  console.log('✅ Signup page loaded');
  
  // Test login link from signup
  console.log('📍 Clicking login link...');
  await page.click('text=Log in');
  await page.waitForURL('**/auth/login');
  await page.screenshot({ path: '/tmp/login.png' });
  console.log('✅ Login page loaded');
  
  // Test header login button
  console.log('📍 Testing header navigation from login...');
  await page.click('a[href="/"]');
  await page.waitForURL('http://localhost:3000/');
  console.log('✅ Home navigation works');
  
  await browser.close();
  console.log('\n✅ All verifications passed!');
})();
