const vm = require('vm');

const { AllHtmlEntities } = require('html-entities');

const Provider = require('./Provider');
const { Part, PartType } = require('../common/Part');

/**
 * @typedef {Object} NaverResponse
 * @prop {Object} [message]
 * @prop {Object} [message.result]
 * @prop {number} [message.result.errate_count] - count of errors
 * @prop {String} [message.result.html] - result html
 */


/** @extends Provider */
class NaverProvider extends Provider {
  constructor() {
    super();

    this.entities = new AllHtmlEntities();
  }

  /**
   *
   * @param {'re_green'|'re_red'|'re_purple'} klass
   */
  static toPart(klass) {
    return ({
      re_green: PartType.Spacing,
      re_red: PartType.Spell,
      re_purple: PartType.Standard,
    })[klass] || PartType.Perfect;
  }

  /**
   *
   * @param {String} content
   * @returns {ProviderRequestFormat}
   */
  formatRequest(content) {
    return {
      url: 'https://m.search.naver.com/p/csearch/ocontent/spellchecker.nhn',
      querystring: {
        _callback: '',
        q: content,
      },
      headers: {
        Referer: 'https://m.search.naver.com/search.naver?query=%EB%A7%9E%EC%B6%A4%EB%B2%95+%EA%B2%80%EC%82%AC%EA%B8%B0&where=m&sm=mtp_hty',
      },
    };
  }

  parse(response) {
    /** @type {NaverResponse} */
    const data = vm.runInContext(response, vm.createContext({}));
    const { message: { result: { errata_count: errataCount, html } } } = data;

    if (errataCount === 0) {
      return [new Part(html, PartType.Perfect)];
    }

    const tokens = [];

    let buffer = '';
    const flushBufferIfNotEmpty = () => {
      if (buffer.length > 0) {
        tokens.push(new Part(this.entities.decode(buffer)));
        buffer = '';
      }
    };

    for (let i = 0; i < html.length;) {
      const char = html[i];

      if (char === '<') {
        const possible = html.substr(i);
        if (possible.startsWith(`<span class='`)) {
          flushBufferIfNotEmpty();

          const [, klass, after] = /<span class='(re_[a-z]+)'>(.+)/.exec(possible);
          const text = after.substr(0, after.indexOf('</span>'));

          tokens.push(new Part(this.entities.decode(text), NaverProvider.toPart(klass)));
          i += possible.indexOf('</span>') + '</span>'.length;
          continue;
        }
      }

      buffer += char;
      i += 1;
    }
    flushBufferIfNotEmpty();

    return tokens;
  }
}

module.exports = NaverProvider;
