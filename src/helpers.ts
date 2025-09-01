import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

const defaultBooleans = [
  'required',
  'readonly',
  'disabled',
  'checked',
  'multiple',
  'autofocus',
];

export function updateDOMAttributes(
  dom: HTMLElement, 
  attrs: Record<string, any> = {}, 
  options: { customBooleans?: string[] } = {},
): void {  
  const customBooleans = options.customBooleans || [];
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

export function isPlaceholderField(node: Node): boolean {
  return node.type.name === 'placeholderField';
}

function findChildren(
  node: Node, 
  predicate: (node: Node) => boolean,
): Array<{ node: Node, pos: number }> {
  const nodesWithPos: Array<{ node: Node, pos: number }> = [];

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

export function getAllPlaceholderFields(
  state: EditorState,
): Array<{ node: Node, pos: number }> {
  const result = findChildren(state.doc, (node) => isPlaceholderField(node));
  return result;
}

export function findPlaceholderFields(
  predicate: (node) => boolean, 
  state: EditorState,
): Array<{ node: Node, pos: number }> {
  const allPlaceholderFields = getAllPlaceholderFields(state);
  const placeholderFields: any = [];

  allPlaceholderFields.forEach((field) => {
    if (predicate(field.node)) {
      placeholderFields.push(field);
    }
  });

  return placeholderFields;
}

export function findPlaceholderFieldsById(
  id: string | string[], 
  state: EditorState,
): Array<{ node: Node, pos: number }> {
  const placeholderFields = findPlaceholderFields((node) => {
    if (Array.isArray(id)) {
      return isPlaceholderField(node) && id.includes(node.attrs.id);
    } else {
      return isPlaceholderField(node) && node.attrs.id === id;
    }
  }, state);
  return placeholderFields;
}

export function findPlaceholderFieldsBetween(
  from: number, 
  to: number, 
  state: EditorState,
): Array<{ node: Node, pos: number }> {
  const placeholderFields: Array<{ node: Node, pos: number }> = [];

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
