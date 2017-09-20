@annotation1
export default class Decorators {
  @annotation1
  static method1(){}

  @annotation1
  get value1(){}

  @annotation1
  set value2(v){}

  @annotation1
  @annotation2(true)
  method1(){}

  @annotation1.bar
  @annotation1.foo(1, 2)
  method2() {}
}

export function annotation1(){}

export function annotation2(){}
