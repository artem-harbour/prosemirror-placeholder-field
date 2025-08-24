import type { Node } from 'prosemirror-model';

/**
 * @public
 */
export type MutableAttrs = Record<string, unknown>;

export type Predicate = (node: Node) => boolean;

export type NodeWithPos = {
  node: Node
  pos: number
};

const defaultBooleans = [
  'required',
  'readonly',
  'disabled',
  'checked',
  'multiple',
  'autofocus',
];

export function updateDOMAttributes(dom, attrs = {}, {
  customBooleans = [],
} = {}) {  
  const booleans = [...defaultBooleans, ...customBooleans];

  Object.entries(attrs).forEach(([key, value]) => {
    if (booleans.includes(key)) {
      if (!value) dom.removeAttribute(key);
      else dom.setAttribute(key, '');
      return;
    }
    
    if (value != null) {
      dom.setAttribute(key, value);
    } else {
      dom.removeAttribute(key);
    }
  });
}

export function isPlaceholderField(node) {
  return node.type.name === 'placeholderField';
}

function findChildren(node: Node, predicate: Predicate): NodeWithPos[] {
  const nodesWithPos: NodeWithPos[] = [];

  node.descendants((child, pos) => {
    if (predicate(child)) {
      nodesWithPos.push({
        node: child,
        pos,
      });
    }
  });

  return nodesWithPos;
}

export function getAllPlaceholderFields(state) {
  const result = findChildren(state.doc, (node) => isPlaceholderField(node));
  return result;
}

export function findPlaceholderFields(state, predicate) {
  const allPlaceholderFields = getAllPlaceholderFields(state);
  const placeholderFields: any = [];

  allPlaceholderFields.forEach((field) => {
    if (predicate(field.node)) {
      placeholderFields.push(field);
    }
  });

  return placeholderFields;
}

export function findPlaceholderFieldsById(state, idOrArray) {
  const placeholderFields = findPlaceholderFields(state, (node) => {
    if (Array.isArray(idOrArray)) {
      return isPlaceholderField(node) && idOrArray.includes(node.attrs.id);
    } else {
      return isPlaceholderField(node) && node.attrs.id === idOrArray;
    }
  });
  return placeholderFields;
}

export function findPlaceholderFieldsBetween(state, from, to) {
  const placeholderFields: any = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node || node?.nodeSize === undefined) {
      return;
    }

    if (isPlaceholderField(node)) {
      placeholderFields.push({ node, pos });
    }
  });

  return placeholderFields;
}
