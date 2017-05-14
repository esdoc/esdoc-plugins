// hack: depends on esdoc internal class
const AbstractDoc = require('esdoc/out/src/Doc/AbstractDoc').default;
const ParamParser = require('esdoc/out/src/Parser/ParamParser').default;

/**
 * Doc Class from test code file.
 */
class TestDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    this._$testTarget();

    Reflect.deleteProperty(this._value, 'export');
    Reflect.deleteProperty(this._value, 'importPath');
    Reflect.deleteProperty(this._value, 'importStyle');
  }

  /** use name property of self node. */
  _$kind() {
    super._$kind();

    this._value.kind = 'test';
  }

  /** set name and testId from special esdoc property. */
  _$name() {
    super._$name();

    this._value.name = this._node._esdocTestName;
    this._value.testId = this._node._esdocTestId;
  }

  /** set memberof to use parent test nod and file path. */
  _$memberof() {
    super._$memberof();

    const chain = [];
    let parent = this._node.parent;
    while (parent) {
      if (parent._esdocTestName) chain.push(parent._esdocTestName);
      parent = parent.parent;
    }

    const filePath = this._pathResolver.filePath;

    if (chain.length) {
      this._value.memberof = `${filePath}~${chain.reverse().join('.')}`;
      this._value.testDepth = chain.length;
    } else {
      this._value.memberof = filePath;
      this._value.testDepth = 0;
    }
  }

  /** set describe by using test node arguments. */
  _$desc() {
    super._$desc();
    if (this._value.description) return;

    this._value.description = this._node.arguments[0].value;
  }

  /** for @testTarget. */
  _$testTarget() {
    const values = this._findAllTagValues(['@test', '@testTarget']);
    if (!values) return;

    this._value.testTargets = [];
    for (const value of values) {
      const {typeText} = ParamParser.parseParamValue(value, true, false, false);
      this._value.testTargets.push(typeText);
    }
  }

  _$test() {
    // alias of testTarget
  }
}

module.exports = TestDoc;
