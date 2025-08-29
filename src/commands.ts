import { findPlaceholderFieldsById } from './helpers';

export function insertPlaceholderField(pos, attrs = {}) {
  return (state, dispatch) => {
    if (dispatch) {
      const insertPos = pos;
      const $pos = state.doc.resolve(insertPos);
      const currentMarks = $pos.marks();
      const marks = currentMarks.length ? [...currentMarks] : null;
      const node = state.schema.nodes.placeholderField.create({ ...attrs }, null, marks);
      dispatch(state.tr.insert(insertPos, node));
    }
    return true;
  };
}

export function deletePlaceholderField(fields) {
  return (state, dispatch) => {
    if (!fields.length) return true;
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posFrom = tr.mapping.map(pos);
        const posTo = tr.mapping.map(pos + node.nodeSize);
        const currentNode = tr.doc.nodeAt(posFrom);
        if (node.eq(currentNode)) {
          tr.delete(posFrom, posTo);
        }
      });
      dispatch(tr);
    }
    return true;
  };
}

export function updatePlaceholderFieldAttrs(fields, attrs = {}) {
  return (state, dispatch) => {
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posMapped = tr.mapping.map(pos);
        const currentNode = tr.doc.nodeAt(pos);
        if (node.type.name === currentNode.type.name) {
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

export function updatePlaceholderFieldById(idOrArray, attrs = {}) {
  return (state, dispatch) => {
    const fields = findPlaceholderFieldsById(idOrArray, state);
    if (!fields.length) return true;
    if (dispatch) {
      return updatePlaceholderFieldAttrs(fields, attrs)(state, dispatch);
    }
    return true;
  };
}

export function deletePlaceholderFieldById(idOrArray) {
  return (state, dispatch) => {
    const fields = findPlaceholderFieldsById(idOrArray, state);
    if (!fields.length) return true;
    if (dispatch) {
      const tr = state.tr;
      fields.forEach((field) => {
        const { node, pos } = field;
        const posFrom = tr.mapping.map(pos);
        const posTo = tr.mapping.map(pos + node.nodeSize);
        const currentNode = tr.doc.nodeAt(posFrom);
        if (node.eq(currentNode)) {
          tr.delete(posFrom, posTo);
        }
      });
      dispatch(tr);
    }
    return true;
  };
}
