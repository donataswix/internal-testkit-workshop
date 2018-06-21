describe('App', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.id('APP_TAB')).tap();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.text('Hello!'))).toBeVisible();
  });
});
