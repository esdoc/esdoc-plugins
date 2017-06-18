/**
 * this is MyClass
 */
export default class MyClass {
  /**
   * this is constructor
   */
  constructor() {
    /**
     * this is member1.
     * @type {number}
     */
    this.member1 = 10;

    /**
     * this is member2.
     * @type {string}
     */
    this.member2 = 'foo';
  }

  /**
   * this is method1.
   * @param {...number} p1 - this is p1
   * @return {boolean} return boolean
   */
  method1(...p1){}

  /**
   * this is method2.
   * @param {number} [p1=10] - this is p1
   */
  method2(p1 = 10){}
}
