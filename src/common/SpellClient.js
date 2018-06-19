const Provider = require('../providers/Provider');
const NaverProvider = require('../providers/NaverProvider');
const DaumProvider = require('../providers/DaumProvder');

class SpellClient {
  /**
   *
   * @param {Provider} provider
   */
  constructor(provider) {
    if (!(provider instanceof Provider)) {
      throw new Error('An instance of Provider must be given');
    }

    this.provider = provider;
  }

  /**
   *
   * @param {'naver'|'daum'} type
   */
  static create(type) {
    /** @type {Provider} */
    let provider;

    switch (type) {
      case 'naver':
        provider = new NaverProvider();
        break;
      case 'daum':
        provider = new DaumProvider();
        break;
      default:
        throw new Error(`type ${type} is not supported`);
    }

    return new SpellClient(provider);
  }

  async fix(content) {
  }

  async check(content) {
    return this.provider.execute(content);
  }
}

module.exports = SpellClient;
