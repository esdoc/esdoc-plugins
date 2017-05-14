export default class MyClass {
  /**
   * this is invalid param name.
   * @param xxx
   */
  invalidMeethod(p){}

  /**
   * @param {number} p
   */
  method1(p){}

  /**
   * @protected
   */
  method2(){}

  /**
   * @private
   */
  method3(){}

  _method4(p = 1){}
}
