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
                    output[comment] = comment;
                }
            } else if (element.type === 'rule') {
                const selector = element.selector.replace(/(\\n|\s)+/g, ' ').replace(/\s+/, ' ').trim();

                output[selector] = {
                    _selector: element.selector,
                    _raws: element.raws,
                    _nodes: {},
                };

                if (element.nodes && element.nodes.length) {
                    output[selector]._nodes = generateSheet(element.nodes);
                }
            } else if (element.type === 'decl') {
                output[element.prop] = {
                    _raws: element.raws,
                    _property: element.prop,
                    _value: element.value,
                };
            } else if (element.type === 'atrule') {
                let rule = `@${element.name} ${element.params}`;
                output[rule] = {
                    _rule: rule,
                    _raws: element.raws,
                    _nodes: {},
                };

                if (element.nodes && element.nodes.length) {
                    output[rule]._nodes = generateSheet(element.nodes);
                }
            }
        }
    }

    return output;
}

function generateScss(nodes) {
    let output = '';

    for (const key in nodes) {
        if (Object.hasOwnProperty.call(nodes, key)) {
            const element = nodes[key];

            if (typeof element === 'string') {
                output += element;
            } else {
                let content = '';

                if (element._raws) {
                    if (element._raws.before) {
                        content += element._raws.before;
                    }
                }

                let trailing = '';

                if (element._selector !== undefined) {
                    if (content === '') {
                        content += "\n";
                    }
                    content += `${element._selector} {`;
                    trailing = '}';
                } else if (element._rule !== undefined) {
                    if (content === '') {
                        content += "\n";
                    }
                    content += `${element._rule} {`;
                    trailing = '}';
                } else if (element._property !== undefined && element._value !== undefined) {
                    content += `${element._property}: ${element._value}`;
                    trailing = ';';
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
                output += content;
            }
        }
    }

    return output;
}

function mergeSass(target, source) {
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
    );
}

export default mergeSass;
