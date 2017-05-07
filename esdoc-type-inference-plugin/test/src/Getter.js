export default class TestGetter {
  get getLiteral () {
    return 123;
  }

  get getArray () {
    return [123, 456];
  }

  get getObject() {
    return {x1: 123, x2: 'text'};
  }

  get getTemplateLiteral() {
    return `text`;
  }
}
