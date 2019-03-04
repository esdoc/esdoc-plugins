'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iceCap = require('ice-cap');

var _iceCap2 = _interopRequireDefault(_iceCap);

var _DocBuilder = require('./DocBuilder.js');

var _DocBuilder2 = _interopRequireDefault(_DocBuilder);

var _util = require('./util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class Output Builder class.
 */
class ClassDocBuilder extends _DocBuilder2.default {
  exec(writeFile) {
    const ice = this._buildLayoutDoc();
    ice.autoDrop = false;
    const docs = this._find({ kind: ['class'] });
    for (const doc of docs) {
      const fileName = this._getOutputFileName(doc);
      const baseUrl = this._getBaseUrl(fileName);
      const title = this._getTitle(doc);
      ice.load('content', this._buildClassDoc(doc), _iceCap2.default.MODE_WRITE);
      ice.attr('baseUrl', 'href', baseUrl, _iceCap2.default.MODE_WRITE);
      ice.text('title', title, _iceCap2.default.MODE_WRITE);
      writeFile(fileName, ice.html);
    }
  }

  /**
   * build class output.
   * @param {DocObject} doc - class doc object.
   * @returns {IceCap} built output.
   * @private
   */
  _buildClassDoc(doc) {
    const expressionExtends = this._buildExpressionExtendsHTML(doc);
    const mixinClasses = this._buildMixinClassesHTML(doc);
    const extendsChain = this._buildExtendsChainHTML(doc);
    const directSubclass = this._buildDirectSubclassHTML(doc);
    const indirectSubclass = this._buildIndirectSubclassHTML(doc);
    const instanceDocs = this._find({ kind: 'variable' }).filter(v => {
      return v.type && v.type.types.includes(doc.longname);
    });

    const ice = new _iceCap2.default(this._readTemplate('class.html'));

    // header
    if (doc.export && doc.importPath && doc.importStyle) {
      const link = this._buildFileDocLinkHTML(doc, doc.importPath);
      ice.into('importPath', `import ${doc.importStyle} from '${link}'`, (code, ice) => {
        ice.load('importPathCode', code);
      });
    }
    ice.text('access', doc.access);
    ice.text('kind', doc.interface ? 'interface' : 'class');
    ice.load('source', this._buildFileDocLinkHTML(doc, 'source'), 'append');
    ice.text('since', doc.since, 'append');
    ice.text('version', doc.version, 'append');
    ice.load('variation', this._buildVariationHTML(doc), 'append');

    ice.into('expressionExtends', expressionExtends, (expressionExtends, ice) => ice.load('expressionExtendsCode', expressionExtends));
    ice.load('mixinExtends', mixinClasses, 'append');
    ice.load('extendsChain', extendsChain, 'append');
    ice.load('directSubclass', directSubclass, 'append');
    ice.load('indirectSubclass', indirectSubclass, 'append');
    ice.load('implements', this._buildDocsLinkHTML(doc.implements, null, false, ', '), 'append');
    ice.load('indirectImplements', this._buildDocsLinkHTML(doc._custom_indirect_implements, null, false, ', '), 'append');
    ice.load('directImplemented', this._buildDocsLinkHTML(doc._custom_direct_implemented, null, false, ', '), 'append');
    ice.load('indirectImplemented', this._buildDocsLinkHTML(doc._custom_indirect_implemented, null, false, ', '), 'append');

    // self
    ice.text('name', doc.name);
    ice.load('description', doc.description);
    ice.load('deprecated', this._buildDeprecatedHTML(doc));
    ice.load('experimental', this._buildExperimentalHTML(doc));
    ice.load('see', this._buildDocsLinkHTML(doc.see), 'append');
    ice.load('todo', this._buildDocsLinkHTML(doc.todo), 'append');
    ice.load('decorator', this._buildDecoratorHTML(doc), 'append');

    ice.into('instanceDocs', instanceDocs, (instanceDocs, ice) => {
      ice.loop('instanceDoc', instanceDocs, (i, instanceDoc, ice) => {
        ice.load('instanceDoc', this._buildDocLinkHTML(instanceDoc.longname));
      });
    });

    ice.into('exampleDocs', doc.examples, (examples, ice) => {
      ice.loop('exampleDoc', examples, (i, example, ice) => {
        const parsed = (0, _util.parseExample)(example);
        ice.text('exampleCode', parsed.body);
        ice.text('exampleCaption', parsed.caption);
      });
    });

    ice.into('tests', doc._custom_tests, (tests, ice) => {
      ice.loop('test', tests, (i, test, ice) => {
        const testDoc = this._find({ longname: test })[0];
        ice.load('test', this._buildFileDocLinkHTML(testDoc, testDoc.testFullDescription));
      });
    });

    // summary
    ice.load('staticMemberSummary', this._buildSummaryHTML(doc, 'member', 'Members', true));
    ice.load('staticMethodSummary', this._buildSummaryHTML(doc, 'method', 'Methods', true));
    ice.load('constructorSummary', this._buildSummaryHTML(doc, 'constructor', 'Constructor', false));
    ice.load('memberSummary', this._buildSummaryHTML(doc, 'member', 'Members', false));
    ice.load('methodSummary', this._buildSummaryHTML(doc, 'method', 'Methods', false));

    ice.load('inheritedSummary', this._buildInheritedSummaryHTML(doc), 'append');

    // detail
    ice.load('staticMemberDetails', this._buildDetailHTML(doc, 'member', 'Members', true));
    ice.load('staticMethodDetails', this._buildDetailHTML(doc, 'method', 'Methods', true));
    ice.load('constructorDetails', this._buildDetailHTML(doc, 'constructor', 'Constructors', false));
    ice.load('memberDetails', this._buildDetailHTML(doc, 'member', 'Members', false));
    ice.load('methodDetails', this._buildDetailHTML(doc, 'method', 'Methods', false));

    return ice;
  }

  /**
   * build variation of doc.
   * @param {DocObject} doc - target doc object.
   * @returns {string} variation links html.
   * @private
   * @experimental
   */
  _buildVariationHTML(doc) {
    const variationDocs = this._find({ memberof: doc.memberof, name: doc.name });
    const html = [];
    for (const variationDoc of variationDocs) {
      if (variationDoc.variation === doc.variation) continue;

      html.push(this._buildDocLinkHTML(variationDoc.longname, `(${variationDoc.variation || 1})`));
    }

    return html.join(', ');
  }

  /**
   * build mixin extends html.
   * @param {DocObject} doc - target class doc.
   * @return {string} mixin extends html.
   */
  _buildMixinClassesHTML(doc) {
    if (!doc.extends) return '';
    if (doc.extends.length <= 1) return '';

    const links = [];
    for (const longname of doc.extends) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }

  /**
   * build expression extends html.
   * @param {DocObject} doc - target class doc.
   * @return {string} expression extends html.
   */
  _buildExpressionExtendsHTML(doc) {
    if (!doc.expressionExtends) return '';

    const html = doc.expressionExtends.replace(/[A-Z_$][a-zA-Z0-9_$]*/g, v => {
      return this._buildDocLinkHTML(v);
    });

    return `class ${doc.name} extends ${html}`;
  }

  /**
   * build class ancestor extends chain.
   * @param {DocObject} doc - target class doc.
   * @returns {string} extends chain links html.
   * @private
   */
  _buildExtendsChainHTML(doc) {
    if (!doc._custom_extends_chains) return '';
    if (doc.extends.length > 1) return '';

    const links = [];
    for (const longname of doc._custom_extends_chains) {
      links.push(this._buildDocLinkHTML(longname));
    }

    links.push(doc.name);

    return `<div>${links.join(' → ')}</div>`;
  }

  /**
   * build in-direct subclass list.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of in-direct subclass links.
   * @private
   */
  _buildIndirectSubclassHTML(doc) {
    if (!doc._custom_indirect_subclasses) return '';

    const links = [];
    for (const longname of doc._custom_indirect_subclasses) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }

  /**
   * build direct subclass list.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of direct subclass links.
   * @private
   */
  _buildDirectSubclassHTML(doc) {
    if (!doc._custom_direct_subclasses) return '';

    const links = [];
    for (const longname of doc._custom_direct_subclasses) {
      links.push(this._buildDocLinkHTML(longname));
    }

    return `<div>${links.join(', ')}</div>`;
  }

  /**
   * build inherited method/member summary.
   * @param {DocObject} doc - target class doc.
   * @returns {string} html of inherited method/member from ancestor classes.
   * @private
   */
  _buildInheritedSummaryHTML(doc) {
    if (['class', 'interface'].indexOf(doc.kind) === -1) return '';

    const longnames = [...(doc._custom_extends_chains || [])
    // ...doc.implements || [],
    // ...doc._custom_indirect_implements || [],
    ];

    const html = [];
    for (const longname of longnames) {
      const superDoc = this._find({ longname })[0];

      if (!superDoc) continue;

      const targetDocs = this._find({ memberof: longname, kind: ['member', 'method', 'get', 'set'] });

      targetDocs.sort((a, b) => {
        if (a.static !== b.static) return -(a.static - b.static);

        let order = { get: 0, set: 0, member: 1, method: 2 };
        if (order[a.kind] !== order[b.kind]) {
          return order[a.kind] - order[b.kind];
        }

        order = { public: 0, protected: 1, private: 2 };
        if (a.access !== b.access) return order[a.access] - order[b.access];

        if (a.name !== b.name) return a.name < b.name ? -1 : 1;

        order = { get: 0, set: 1, member: 2 };
        return order[a.kind] - order[b.kind];
      });

      const title = `<span class="toggle closed"></span> From ${superDoc.kind} ${this._buildDocLinkHTML(longname, superDoc.name)}`;
      const result = this._buildSummaryDoc(targetDocs, '----------');
      if (result) {
        result.load('title', title, _iceCap2.default.MODE_WRITE);
        html.push(result.html);
      }
    }

    return html.join('\n');
  }
}
exports.default = ClassDocBuilder;