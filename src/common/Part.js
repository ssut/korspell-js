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
  constructor(content, type = PartType.Perfect) {
    this.content = content;
    this.type = type;
  }

  toString() {
    return this.content;
  }
}

class PartList extends Array {
  push(...items) {
    if (items.filter(item => !(item instanceof Part)).length > 0) {
      throw new Error('only instance of Part is allowed to push');
    }

    return super.push(...items);
  }

  toString() {
    return this.map(item => item.toString()).join('');
  }
}

module.exports = {
  PartType,
  Part,
  PartList,
};
