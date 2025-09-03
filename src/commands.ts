import { Command } from 'prosemirror-state';
import { NodeWithPos } from './types';
import { findPlaceholderFieldsById } from './helpers';

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

// TODO: Field kinds, replacer node/func?
export function replacePlaceholderFieldWithValue(
  id: string | string[],
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
        if (currentNode && node.eq(currentNode)) {
          if (node.attrs.kind === 'text') {
            const value = node.attrs.value || ' '; // empty text nodes are not allowed
            const textNode = state.schema.text(value, marks);
            tr.replaceWith(posFrom, posTo, textNode);
          }
        }
      });
      dispatch(tr);
    }
    return true;
  };
}
