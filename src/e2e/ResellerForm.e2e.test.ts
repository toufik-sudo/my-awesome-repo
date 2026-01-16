describe('language switcher integration tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('has a logo with an alt attribute', async () => {
    await page.click('.reseller button');
  });
});
