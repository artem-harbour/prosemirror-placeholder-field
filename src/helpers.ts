import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { NodeWithPos } from './types';

const defaultBooleans = [
  'required',
  'readonly',
  'disabled',
  'checked',
  'multiple',
  'autofocus',
];

/**
 * Updates attributes for DOM element.
 * @param dom DOM element.
 * @param attrs Attributes to update.
 * @param options Additional options.
 */
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

/**
 * Checks if it is a "placeholderField" node.
 * @param node PM node.
 */
export function isPlaceholderField(node: Node): boolean {
  return node.type.name === 'placeholderField';
}

function findChildren(
  node: Node, 
  predicate: (node: Node) => boolean,
): NodeWithPos[] {
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

/**
 * Gets all fields in the state.
 * @param state Editor state.
 */
export function getAllPlaceholderFields(
  state: EditorState,
): NodeWithPos[] {
  const result = findChildren(state.doc, (node) => isPlaceholderField(node));
  return result;
}

/**
 * Finds fields in the state by predicate.
 * @param predicate Predicate fn.
 * @param state Editor state.
 */
export function findPlaceholderFields(
  predicate: (node: Node) => boolean,
  state: EditorState,
): NodeWithPos[] {
  const allPlaceholderFields = getAllPlaceholderFields(state);
  const placeholderFields: any = [];

  allPlaceholderFields.forEach((field) => {
    if (predicate(field.node)) {
      placeholderFields.push(field);
    }
  });

  return placeholderFields;
}

/**
 * Finds fields in the state by ID attr.
 * @param id ID or list of IDs.
 * @param state Editor state.
 */
export function findPlaceholderFieldsById(
  id: string | string[], 
  state: EditorState,
): NodeWithPos[] {
  const placeholderFields = findPlaceholderFields((node) => {
    if (Array.isArray(id)) {
      return isPlaceholderField(node) && id.includes(node.attrs.id);
    } else {
      return isPlaceholderField(node) && node.attrs.id === id;
    }
  }, state);
  return placeholderFields;
}

/**
 * Finds fields in the state by name attr.
 * @param name Name or list of names.
 * @param state Editor state.
 */
export function findPlaceholderFieldsByName(
  name: string | string[], 
  state: EditorState,
): NodeWithPos[] {
  const placeholderFields = findPlaceholderFields((node) => {
    if (Array.isArray(name)) {
      return isPlaceholderField(node) && name.includes(node.attrs.name);
    } else {
      return isPlaceholderField(node) && node.attrs.name === name;
    }
  }, state);
  return placeholderFields;
}

/**
 * Finds fields in the state between positions.
 * @param from From pos.
 * @param to To pos.
 * @param state Editor state.
 */
export function findPlaceholderFieldsBetween(
  from: number, 
  to: number, 
  state: EditorState,
): NodeWithPos[] {
  const placeholderFields: NodeWithPos[] = [];

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
