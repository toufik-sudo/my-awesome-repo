describe('language switcher integration tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('has a logo with an alt attribute', async () => {
    const navbarLogo = await page.evaluate(() => document.querySelector('#navbar > a > img').getAttribute('alt'));

    await expect(navbarLogo).toEqual('Logo');
  });

  it('has correct navbar elements', async () => {
    const navbarElement = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#navbar > ul:last-child > li'), element => element.textContent)
    );

    await expect(navbarElement.length).toEqual(6);
  });
});
