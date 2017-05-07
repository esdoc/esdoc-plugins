export default class ObjectRestSpread {
  /**
   * this is method1.
   * @param {Object} config - this is config.
   * @param {number} config.x - this is number x.
   * @param {string} config.y - this is string y.
   * @param {number[]} config.a - thi is number[] a.
   * @param {string[]} config.b - thi is number[] b.
   */
  method1({x, y, ...z}){}

  /**
   * @returns {{a: number, b: string, c: boolean}}
   */
  method2(){
    const a = 1;
    const obj = {b: 'text', c: true};
    return {a, ...obj};
  }
}
