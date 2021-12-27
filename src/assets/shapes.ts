import { dia, shapes } from '@clientio/rappid';

const memberButtonBody = {
    width: 20,
    height: 20,
    rx: 20,
    ry: 20,
    x: -10,
    y: -10,
};

const Member = dia.Element.define('Member', {
    size: { width: 333, height: 98 },
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#FFFFFF',
            stroke: '#e4e4e4',
            rx: 40,
            ry: 40,
        },
        label: {
            refX: 86,
            refY: 31,
            fontFamily: 'Montserrat',
            fontWeight: 700,
            fontSize: 16,
            lineHeight: 19,
            fill: '#241332',
            text: 'Label',
            textWrap: {
                width: -120,
                maxLineCount: 1,
                ellipsis: true
            },
            textVerticalAnchor: 'top',
        },
        description: {
            refX: 86,
            refY: 51,
            fontFamily: 'Montserrat',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: 15,
            opacity: 0.56,
            fill: '#352641',
            textVerticalAnchor: 'top',
            text: 'Description',
            textWrap: {
                width: -95,
                maxLineCount: 1,
                ellipsis: true
            }
        },
        icon: {
            width: 36,
            height: 36,
            refX: 30,
            refY: 30
        },
        memberAddButton: {
            class: 'member-button',
            cursor: 'pointer',
            fill: '#4666E5',
            event: 'element:member:add',
            refX: '50%',
            refX2: -20,
            refY: '100%',
            z: 3
        },
        memberAddButtonBody: memberButtonBody,
        memberAddButtonIcon: {
            d: 'M -4 0 4 0 M 0 -4 0 4',
            stroke: '#FFFFFF',
            strokeWidth: 2
        },
        memberRemoveButton: {
            class: 'member-button',
            height: 10,
            width: 10,
            cursor: 'pointer',
            fill: '#FF4365',
            event: 'element:remove',
            refX: '50%',
            refX2: +20,
            refY: '100%'
        },
        memberRemoveButtonBody: memberButtonBody,
        memberRemoveButtonIcon: {
            d: 'M -4 0 4 0',
            stroke: '#FFFFFF',
            strokeWidth: 2
        },
        memberEditIconContainer: {
            height: 14,
            width: 14,
            cursor: 'pointer',
            event: 'element:edit',
            fill: 'none',
            refX: 293,
            refY: 28,
        },
        memberEditIcon: {
            d: 'M -6 0 L 0 6 L 6 0',
            stroke: '#78849E',
            strokeWidth: 3,
            cursor: 'pointer',
            event: 'element:edit',
            refX: 300,
            refY: 33,
            fill: '#FFFFFF'
        },
    }
}, {

    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label',
    }, {
        tagName: 'text',
        selector: 'description',
    }, {
        tagName: 'image',
        selector: 'icon',
    }, {
        tagName: 'g',
        selector: 'memberAddButton',
        children: [{
            tagName: 'rect',
            selector: 'memberAddButtonBody'
        }, {
            tagName: 'path',
            selector: 'memberAddButtonIcon'
        }]
    }, {
        tagName: 'g',
        selector: 'memberRemoveButton',
        children: [{
            tagName: 'rect',
            selector: 'memberRemoveButtonBody'
        }, {
            tagName: 'path',
            selector: 'memberRemoveButtonIcon'
        }]
    }, {
        tagName: 'rect',
        selector: 'memberEditIconContainer'
    }, {
        tagName: 'path',
        selector: 'memberEditIcon'
    }]
});

export const Link = dia.Link.define('Link', {
    attrs: {
        root: {
            cursor: 'pointer'
        },
        line: {
            fill: 'none',
            connection: true,
            stroke: '#78849E',
            strokeWidth: 1
        }
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'line'
    }]
});

declare module '@clientio/rappid' {
    namespace shapes {
        namespace app {
            class Member extends dia.Element {
            }

            class Link extends  dia.Link {
            }
        }
    }
}

Object.assign(shapes, {
    app: {
        Member,
        Link
    }
});
