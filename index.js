import scss from 'postcss-scss';
import merge from './lib/deepmerge.js';

function generateSheet(nodes) {
    const output = {};

    for (const key in nodes) {
        if (Object.hasOwnProperty.call(nodes, key)) {
            const element = nodes[key];

            if (element.type === 'comment') {
                let comment = '';

                if (element.raws.inline) {
                    if (element.raws.before) {
                        comment += element.raws.before;
                    }
                    comment += '//';
                    if (element.raws.left) {
                        comment += element.raws.left;
                    }
                    if (element.raws.text) {
                        comment += element.raws.text;
                    }
                    if (element.raws.right) {
                        comment += element.raws.right;
                    }
                } else {
                    if (element.raws.before) {
                        comment += element.raws.before;
                    }
                    comment += '/*';
                    if (element.raws.left) {
                        comment += element.raws.left;
                    }
                    if (element.text) {
                        comment += element.text;
                    }
                    if (element.raws.right) {
                        comment += element.raws.right;
                    }
                    comment += '*/';
                }

                if (comment) {
                    if (output[comment] === undefined) {
                        output[comment] = comment;
                    } else {
                        let i = 1;

                        while (true) {
                            const commentKey = `${comment}${i}`;
                            if (output[commentKey] === undefined) {
                                output[commentKey] = comment;
                                break;
                            }

                            i++;
                        }
                    }
                }
            } else if (element.type === 'rule') {
                const selector = element.selector.replace(/(\\n|\s|\n)+/g, ' ').replace(/\s+/, ' ').trim();
                const rule = {
                    _selector: element.selector,
                    _raws: element.raws,
                    _nodes: {},
                };

                if (element.nodes && element.nodes.length) {
                    rule._nodes = generateSheet(element.nodes);
                }

                if (output[selector] === undefined) {
                    output[selector] = rule;
                } else {
                    output[selector] = merge(output[selector], rule);
                }
            } else if (element.type === 'decl') {
                output[element.prop] = {
                    _raws: element.raws,
                    _property: element.prop,
                    _value: `${element.value}${element.important ? ' !important' : ''}`,
                };
            } else if (element.type === 'atrule') {
                let query = `@${element.name} ${element.params}`;
                const atrule = {
                    _query: query,
                    _raws: element.raws,
                    _nodes: {},
                };

                if (element.nodes && element.nodes.length) {
                    atrule._nodes = generateSheet(element.nodes);
                }

                if (output[query] === undefined) {
                    output[query] = atrule;
                } else {
                    output[query] = merge(output[query], atrule);
                }
            }
        }
    }

    return output;
}

function generateScss(nodes) {
    let output = '';
    let declaredVars = '';

    let firstNode = null;
    Object.keys(nodes).forEach((key, id) => {
        if (id === 0) {
            firstNode = nodes[key];
        }

        return false;
    });

    for (const key in nodes) {
        if (Object.hasOwnProperty.call(nodes, key)) {
            const element = nodes[key];

            if (typeof element === 'string') {
                output += element;
            } else {
                let content = '';
                let isVar = false;

                if (element._raws) {
                    if (element._raws.before) {
                        content += element._raws.before;
                    }
                }

                let trailing = '';

                if (element._selector !== undefined) {
                    if (content === '' && element !== firstNode) {
                        content += "\n";
                    }
                    content += `${element._selector} {`;
                    trailing = '}';

                    if (element._selector.indexOf('%') === 0) {
                        isVar = true;
                    }
                } else if (element._query !== undefined) {
                    if (content === '' && element !== firstNode) {
                        content += "\n";
                    }
                    content += element._query;
                    if (element._nodes && Object.keys(element._nodes).length) {
                        content += ' {';
                        trailing = '}';
                    } else {
                        trailing = ';';
                    }
                } else if (element._property !== undefined && element._value !== undefined) {
                    content += `${element._property}: ${element._value}`;
                    trailing = ';';

                    if (element._property.indexOf('$') === 0) {
                        isVar = true;
                    }
                }

                if (element._nodes) {
                    content += generateScss(element._nodes);
                }

                if (element._raws) {
                    if (element._raws.after) {
                        content += element._raws.after;
                    }
                }

                content += trailing;

                if (isVar) {
                    declaredVars += content;
                } else {
                    output += content;
                }
            }
        }
    }

    return `${declaredVars}${output}`;
}

export default function mergeSass(target = '', source = '') {
    try {
        return generateScss(
            merge(
                generateSheet(scss.parse(target).nodes),
                generateSheet(scss.parse(source).nodes),
                {
                    ignoreKeys: [
                        '_raws',
                    ],
                }
            )
        ) + "\n";
    } catch (error) {
        return error.message;
    }
}
