import { Command } from 'prosemirror-state';
import { findPlaceholderFieldsById } from './helpers';
import { NodeWithPos, ReplacerFn } from './types';

/**
 * Inserts a field at the specified position in the document.
 * @param pos The position in the document.
 * @param attrs The field attributes.
 * @example
 * insertPlaceholderField(0, {id: '1', label: 'Text field'})(state, dispatch);
 */
export function insertPlaceholderField(
  pos: number, 
  attrs: Record<string, any> = {}
): Command {
  return (state, dispatch) => {
    if (dispatch) {
      const insertPos = pos;
      const $pos = state.doc.resolve(insertPos);
      const currentMarks = $pos.marks();
      const marks = currentMarks.length ? [...currentMarks] : undefined;
      const node = state.schema.nodes.placeholderField.create({ ...attrs }, null, marks);
      dispatch(state.tr.insert(insertPos, node));
    }
    return true;
  };
}

/**
 * Removes fields in a document.
 * @param fields The fields to remove.
 */
export function deletePlaceholderField(
  fields: NodeWithPos[]
): Command {
  return (state, dispatch) => {
    if (!fields.length) return true;
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posFrom = tr.mapping.map(pos);
        const posTo = tr.mapping.map(pos + node.nodeSize);
        const currentNode = tr.doc.nodeAt(posFrom);
        if (currentNode && node.eq(currentNode)) {
          tr.delete(posFrom, posTo);
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Updates fields attributes.
 * @param fields Fields to update.
 * @param attrs The field attributes.
 */
export function updatePlaceholderFieldAttrs(
  fields: NodeWithPos[], 
  attrs: Record<string, any> = {}
): Command {
  return (state, dispatch) => {
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posMapped = tr.mapping.map(pos);
        const currentNode = tr.doc.nodeAt(pos);
        if (node.type.name === currentNode?.type.name) {
          tr.setNodeMarkup(posMapped, undefined, {
            ...node.attrs,
            ...attrs,
          });
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Updates fields by ID.
 * @param id ID or list of field IDs.
 * @param attrs The field attributes.
 * @example
 * updatePlaceholderFieldById('1', {value: 'Updated'})(state, dispatch);
 * @example
 * updatePlaceholderFieldById(['1', ''2'], {value: 'Updated'})(state, dispatch);
 */
export function updatePlaceholderFieldById(
  id: string | string[], 
  attrs: Record<string, any> = {}
): Command {
  return (state, dispatch) => {
    const fields = findPlaceholderFieldsById(id, state);
    if (!fields.length) return true;
    if (dispatch) {
      return updatePlaceholderFieldAttrs(fields, attrs)(state, dispatch);
    }
    return true;
  };
}

/**
 * Removes fields in a document by ID.
 * @param id ID or list of field IDs.
 * @example
 * deletePlaceholderFieldById('1')(state, dispatch);
 * @example
 * deletePlaceholderFieldById(['1', '2'])(state, dispatch);
 */
export function deletePlaceholderFieldById(
  id: string | string[]
): Command {
  return (state, dispatch) => {
    const fields = findPlaceholderFieldsById(id, state);
    if (!fields.length) return true;
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posFrom = tr.mapping.map(pos);
        const posTo = tr.mapping.map(pos + node.nodeSize);
        const currentNode = tr.doc.nodeAt(posFrom);
        if (currentNode && node.eq(currentNode)) {
          tr.delete(posFrom, posTo);
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Replaces fields with the actual value.
 * @param id ID or list of field IDs.
 * @param replacers Replacer functions for different field kinds.
 * @example
 * replacePlaceholderFieldWithValue(['1', '2'], {link: replaceLink, image: replaceImage});
 */
export function replacePlaceholderFieldWithValue(
  id: string | string[],
  replacers: Record<string, ReplacerFn> = {},
): Command {
  return (state, dispatch) => {
    const fields = findPlaceholderFieldsById(id, state);
    if (!fields.length) return true;
    if (dispatch) {
      const tr = state.tr;
      tr.setMeta('addToHistory', false);
      fields.forEach((field) => {
        const { node, pos } = field;
        const posFrom = tr.mapping.map(pos);
        const $posFrom = tr.doc.resolve(posFrom);
        const posTo = tr.mapping.map(pos + node.nodeSize);
        const currentNode = tr.doc.nodeAt(posFrom);
        const currentMarks = $posFrom.marks();
        const marks = currentMarks.length ? [...currentMarks] : undefined;
        const replaceText = () => {
          const value = node.attrs.value || ' '; // empty text nodes are not allowed
          const textNode = state.schema.text(value, marks);
          tr.replaceWith(posFrom, posTo, textNode);
        };
        const handlers: Record<string, ReplacerFn> = { ...replacers, text: replaceText };
        const replace: ReplacerFn = handlers[node.attrs.kind] ?? handlers.text;
        if (currentNode && node.eq(currentNode)) {
          replace({
            state,
            tr,
            node,
            pos,
            from: posFrom,
            to: posTo,
          });
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

/**
 * Helper function for creating a command that remembers replacer functions.
 * @param replacers Replacer functions for different field kinds.
 */
export function buildReplacePlaceholderFieldWithValue(replacers: Record<string, ReplacerFn>) {
  return (id: string | string[]) => replacePlaceholderFieldWithValue(id, replacers);
}
