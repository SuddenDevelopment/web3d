/*
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import fs from 'fs';
*/
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const fs = require('fs');

function modifyCameraProperties(filename, newProperties) {
    const code = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });

    traverse(ast, {
        JSXOpeningElement(path) {
            /*if (path.node.name.name === 'Camera') {
                path.node.attributes = newProperties.map(({ name, value }) => ({
                    type: 'JSXAttribute',
                    name: { type: 'JSXIdentifier', name },
                    value: { type: 'StringLiteral', value },
                }));
            }*/
            if (path.node.name.name === 'mesh') {
                path.node.attributes.forEach(attribute => {
                    if (attribute.name.name === 'scale') {
                        let scaleValue;
                        if (attribute.value.type === 'StringLiteral') {
                            scaleValue = attribute.value.value;
                        } else if (attribute.value.type === 'JSXExpressionContainer') {
                            scaleValue = generate(attribute.value.expression).code;
                            attribute.value.expression = parser.parseExpression('1');
                        }
                        console.log(scaleValue);
                    }
                });
            }
        },
    });

    const output = generate(ast, {}, code);
    fs.writeFileSync(filename, output.code);
}

modifyCameraProperties('./pages/untitled.js', [{ name: 'default', value: true }]);