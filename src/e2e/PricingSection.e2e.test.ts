describe('pricing section integration tests', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('it renders a column with expected number of li elements', async () => {
    const languageElement = await page.evaluate(() => document.querySelectorAll('.labels-block ul li').length);

    await expect(languageElement).toEqual(16);
  });

  it('it renders a column with expected number of slick elements', async () => {
    const languageElement = await page.evaluate(
      () => document.querySelectorAll('.pricing-slider .slick-track .slick-slide').length
    );

    await expect(languageElement).toEqual(4);
  });
});
