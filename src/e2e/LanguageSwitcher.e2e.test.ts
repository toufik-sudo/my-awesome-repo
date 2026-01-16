describe('language switcher integration tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('is implemented and default language is english', async () => {
    const languageElement = await page.evaluate(() =>
      Array.from(document.querySelectorAll('nav ul li'), element => element.textContent)
    );

    await expect(languageElement[0]).toEqual('English');
  });

  it('is has 2 languages', async () => {
    await page.click('#language-switcher');
    const languageLists = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('#language-switcher > div:last-child div div'),
        element => element.textContent
      )
    );

    expect(languageLists.length).toBe(2);
  });
});
