/**
 * Enum for Part-type values
 * @enum {Symbol}
 */
const PartType = Object.freeze({
  /** 맞춤법검사 오류가 없음 */
  Perfect: Symbol('Perfect'),
  /** 표준어 의심단어 */
  Standard: Symbol('Standard'),
  /** 맞춤법 오류 */
  Spell: Symbol('Spell'),
  /** 띄어쓰기 오류 */
  Spacing: Symbol('Spacing'),
});

class Part {
  /**
   *
   * @param {String} content
   * @param {PartType} type
   */
  constructor(content, type) {
    this.content = content;
    this.type = type;
  }

  toString() {
    return this.content;
  }
}

module.exports = {
  PartType,
  Part,
};
