const axios = require('axios').default;
const qs = require('qs');

const { Part } = require('../common/Part');

/**
 * @typedef {Object} ProviderRequestFormat
 * @prop {String} [url] - Request URL without querystrings
 * @prop {String} [method="GET"] - Request method
 * @prop {*} [body] - Request body
 * @prop {Object} [querystring={}] - Querystring to build
 * @prop {Object} [headers={}] - Request headers
 */

class Provider {
  constructor() {
    this.client = axios.create();
  }

  /**
   *
   * @param {String} content
   * @returns {ProviderRequestFormat}
   */
  formatRequest(content) {
    throw new Error('formatRequest must be implemented');
  }

  /**
   *
   * @param {*} data
   * @returns {Part[]}
   */
  parse(data) {
    throw new Error('parse must be implemented');
  }

  /**
   *
   * @param {String} content
   * @returns {Promise<Part[]>}
   */
  async execute(content) {
    const request = this.formatRequest(content);

    const url = [
      request.url,
      (Object.keys(request.querystring || {}).length > 0 ? qs.stringify(request.querystring, { addQueryPrefix: true }) : ''),
    ].join('');

    const options = {
      method: request.method || 'GET',
      headers: request.headers,
      body: request.body,
      url,
    };

    const resp = await this.client(options);
    return this.parse(resp.data);
  }
}

module.exports = Provider;
