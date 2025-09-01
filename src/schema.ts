import {
  Attrs,
  Node,
} from 'prosemirror-model';

type MutableAttrs = Record<string, unknown>;

/**
 * @public
 */
export type getFromDOM = (dom: HTMLElement) => unknown;

/**
 * @public
 */
export type setDOMAttr = (value: unknown, attrs: MutableAttrs) => void;

/**
 * @public
 */
export interface PlaceholderFieldAttributes {
  default: unknown;

  validate?: string | ((value: unknown) => void);

  getFromDOM?: getFromDOM;

  setDOMAttr?: setDOMAttr;
}

/**
 * @public
 */
export interface PlaceholderFieldNodeOptions {
  color?: string,
  extraAttributes?: { [key: string]: PlaceholderFieldAttributes };
}

export const placeholderFieldTypeName = 'placeholderField';

export const placeholderFieldClass = 'placeholder-field';
export const placeholderFieldContentClass = 'placeholder-field__content';

/**
 * @public
 */
export function placeholderFieldNode(options: PlaceholderFieldNodeOptions = {}) {
  const extraAttrs = options.extraAttributes || {};
  const defaultColor = options.color || '#7c3aed';
  
  const attrs = {
    id: { default: null, validate: 'string|null' },
    kind: { default: 'text', validate: 'string|null' },
    value: { default: null, validate: 'string|null' },
    label: { default: null, validate: 'string|null' },
    color: { default: defaultColor, validate: 'string|null' },
    // TODO: hidden, highlighted, fieldKind
  };

  for (const prop in extraAttrs) {
    attrs[prop] = {
      default: extraAttrs[prop].default,
      validate: extraAttrs[prop].validate,
    };
  }

  return {
    placeholderField: {
      group: `placeholderField inline`,
      inline: true,
      atom: true,
      selectable: true,
      draggable: true,
      attrs,
      parseDOM: [{ 
        tag: `span[data-placeholder-field]`,
        getAttrs: (dom: HTMLElement) => getPlaceholderFieldAttrs(dom, extraAttrs),
      }],
      toDOM: (node: Node) => placeholderFieldToDOM(node, extraAttrs),
    }
  };
}

function getPlaceholderFieldAttrs(dom: HTMLElement | string, extraAttrs: Attrs): Attrs {
  if (typeof dom === 'string') {
    return {};
  }

  const result: MutableAttrs = {
    id: dom.getAttribute('data-id'),
    kind: dom.getAttribute('data-kind'),
    value: dom.getAttribute('data-value'),
    label: dom.getAttribute('data-label'),
    color: dom.getAttribute('data-color'),
  };

  for (const prop in extraAttrs) {
    const getter = extraAttrs[prop].getFromDOM;
    const value = getter && getter(dom);
    if (value != null) result[prop] = value;
  }

  return result;
}

function placeholderFieldToDOM(node, extraAttrs) {
  const attrs = node.attrs;
  const domAttrs = setPlaceholderFieldDOMAttrs(node, extraAttrs);

  const contentAttrs = {
    class: placeholderFieldContentClass,
    contenteditable: 'false',
  };
  const contentContainer = ['span', contentAttrs, attrs.label ?? ''];

  return ['span', domAttrs, contentContainer];
}

export function setPlaceholderFieldDOMAttrs(node: Node, extraAttrs: Attrs): Attrs {
  const attrs = node.attrs;

  const result: MutableAttrs = {
    class: placeholderFieldClass,
    'data-placeholder-field': '',
    'data-id': attrs.id != null ? String(attrs.id) : undefined,
    'data-kind':  attrs.kind != null ? String(attrs.kind) : undefined,
    'data-value': attrs.value != null ? String(attrs.value) : undefined,
    'data-label': attrs.label != null ? String(attrs.label) : undefined,
    'data-color': attrs.color != null ? String(attrs.color) : undefined,
  };

  for (const prop in extraAttrs) {
    const setter = extraAttrs[prop].setDOMAttr;
    if (setter) setter(node.attrs[prop], result);
  }

  return result;
}
