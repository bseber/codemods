
module.exports = function transformer(file, api) {
    const j = api.jscodeshift;
    const { statement } = j.template;

    const root = j(file.source);

    return root
            .find(j.Program)
            .find(j.ExpressionStatement, {
                expression: {
                    type: j.CallExpression.name,
                    callee: {
                        type: j.Identifier.name,
                        name: 'it'
                    }
                }
            })
            .forEach(p => {
                const specContainsOnlyOneWaitsFor = j(p).find(j.ExpressionStatement, {
                        expression: {
                            type: j.CallExpression.name,
                            callee: {
                                name: 'waitsFor'
                            }
                        }
                    }).size() === 1;

                if (!specContainsOnlyOneWaitsFor) {
                    return;
                }

                // const specTitle = p.node.expression.arguments[0];
                const specCallee = p.node.expression.arguments[1];

                // add 'done' parameter
                specCallee.params.push(statement`done`);

                // replace 'done = true' with done() invocation
                j(p).find(j.ExpressionStatement, {
                    expression: {
                        type: j.AssignmentExpression.name,
                        left: {
                            name: 'done'
                        }
                    }
                }).replaceWith(p => statement`done();`);

                // get rid of 'var done = false'
                j(p).find(j.VariableDeclaration, {
                    declarations: [
                        {
                            type: j.VariableDeclarator.name,
                            id: {
                                name: 'done'
                            }
                        }
                    ]
                }).remove();

                // get rid of obsolete waitsFor block
                j(p).find(j.ExpressionStatement, {
                    expression: {
                        type: j.CallExpression.name,
                        callee: {
                            name: 'waitsFor'
                        }
                    }
                }).remove();
            })
            .toSource();
};
