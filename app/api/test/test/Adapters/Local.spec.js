// /* eslint-env jest */

const { initContainer } = require('../../../src/Container');
const { Config: ConfigClass } = require('../../../src/Config');
const { ConfigSchema } = require('../../../src/ConfigSchema');

describe(__filename.replace(__dirname, ''), () => {
  /** @type {import('awilix').AwilixContainer} */
  let container;

  afterAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    await container.dispose();
  });

  it('Local', async () => {
    const config = new ConfigClass(ConfigSchema, {});
    container = await initContainer(config);
    const LocalAdapter = container.resolve('LocalAdapter');
    const ok = LocalAdapter.setUp({
      country: 'IR',
      mobile: '+989011230000',
      message: 'HELLO',
    });

    expect(
      LocalAdapter.success({
        status: 200,
        json: 1,
        headers: [],
      }).result,
    ).toBe(true);

    expect(
      LocalAdapter.success({
        status: 404,
        json: 1,
        headers: [],
      }).result,
    ).toBe(false);

    expect(ok).toBeTruthy();
  });

  it('Local deactivate', async () => {
    const Config = new ConfigClass(ConfigSchema, {
      ASM_PUBLIC_ADAPTERS: 'other',
    });
    container = await initContainer(Config);
    const LocalAdapter = container.resolve('LocalAdapter');
    const notOk = LocalAdapter.setUp({
      country: 'IR',
      mobile: '+989011230000',
      message: 'HELLO',
    });
    expect(notOk).toBe(false);
  });
});
