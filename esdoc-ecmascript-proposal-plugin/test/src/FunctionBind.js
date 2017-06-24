function foo(){}

export default class FunctionBind {
  method() {
    this::foo();
  }
}
