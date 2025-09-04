
import { Attrs, Node, DOMOutputSpec, AttributeSpec } from 'prosemirror-model';
import { 
  MutableAttrs,
  PlaceholderFieldNode,
  PlaceholderFieldNodeOptions,
} from './types';

export const placeholderFieldTypeName = 'placeholderField';
export const placeholderFieldClass = 'placeholder-field';
export const placeholderFieldContentClass = 'placeholder-field__content';

export function placeholderFieldNode(options: PlaceholderFieldNodeOptions = {}): PlaceholderFieldNode {
  const extraAttrs = options.extraAttributes || {};
  const defaultColor = options.defaultColor || '#7c3aed';

  const attrs: Record<string, AttributeSpec> = {
    id: { default: null, validate: 'string|null' },
    kind: { default: 'text', validate: 'string|null' },
    name: { default: null, validate: 'string|null' },
    value: { default: null, validate: 'string|null' },
    label: { default: null, validate: 'string|null' },
    color: { default: defaultColor, validate: 'string|null' },
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

function getPlaceholderFieldAttrs(dom: HTMLElement | string, extraAttrs: Attrs = {}): Attrs {
  if (typeof dom === 'string') {
    return {};
  }

  const result: MutableAttrs = {
    id: dom.getAttribute('data-id'),
    kind: dom.getAttribute('data-kind'),
    name: dom.getAttribute('data-name'),
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

function placeholderFieldToDOM(node: Node, extraAttrs: Attrs = {}): DOMOutputSpec {
  const attrs = node.attrs;
  const domAttrs = setPlaceholderFieldDOMAttrs(node, extraAttrs);

  const contentAttrs = {
    class: placeholderFieldContentClass,
    contenteditable: 'false',
  };

  const contentContainer = ['span', contentAttrs, attrs.label ?? ''];
  return ['span', domAttrs, contentContainer];
}

export function setPlaceholderFieldDOMAttrs(node: Node, extraAttrs: Attrs = {}): Attrs {
  const attrs = node.attrs;

  const result: MutableAttrs = {
    class: placeholderFieldClass,
    'data-placeholder-field': '',
    'data-id': attrs.id != null ? String(attrs.id) : undefined,
    'data-kind':  attrs.kind != null ? String(attrs.kind) : undefined,
    'data-name':  attrs.name != null ? String(attrs.name) : undefined,
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
