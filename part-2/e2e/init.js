const detox = require('detox');
const config = require('../package.json').detox;
const {OneAppStateBuilder, OneAppStateReader} = require('wix-one-app-engine-tools');
const mockTools = require('wix-one-app-engine/lib/MockTools');

before(async () => {
  await detox.init(config);

  const businessId = '9d2f36c8-0698-4921-9f73-9d862d951df0';
  const oneAppState = new OneAppStateBuilder()
    .withUserId('fde01512-8eed-4f42-878f-b891a7a1be66')
    .withAppMode(OneAppStateReader.APP_MODES.UNIFIED)
    .withBusiness(businessId, 'hotels-world-hybrid', true, null, true)
    .withBusinessService(
      businessId,
      OneAppStateReader.SERVICE_TYPE.BOOKINGS,
      'active',
      '13f78abc-67d8-3334-640d-e47ae106380b',
      null
    )
    .asBusinessOwner(businessId)
    .build();
  await mockTools.setLoginData({oneAppState});
});

after(async () => {
  await detox.cleanup();
});
