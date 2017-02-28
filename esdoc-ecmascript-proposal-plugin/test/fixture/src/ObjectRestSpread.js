export default class ObjectRestSpread {
  method1({x, y, ...z}){}

  /**
   * this is method1.
   * @param {Object} config - this is config.
   * @param {number} config.x - this is number x.
   * @param {string} config.y - this is string y.
   * @param {number[]} config.a - thi is number[] a.
   * @param {string[]} config.b - thi is number[] b.
   */
  method2({x, y, ...z}){}

  method3(){
    const a = 1;
    const obj = {};
    return {a, ...obj};
  }

  /**
   * @returns {{a: number, b: string, c: boolean}}
   */
  method4(){
    const a = 1;
    const obj = {b: 'text', c: true};
    return {a, ...obj};
  }
}
