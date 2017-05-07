// literal
export const testVariableLiteral = 123;

// array
export const testVariableArray = [123, 456];

// object
export const testVariableObject = {x1: 123, x2: "text"};

// template literal
export const testVariableTemplateLiteral = `text`;

// new expression with same file
export class TestVariableNewExpression {}
export default new TestVariableNewExpression();

// new expression with other file
import TestMember from './Member';
export const testVariableNewExpressionOtherFile = new TestMember();
