export { placeholderFieldNode } from './schema';

export { PlaceholderFieldView } from './node-view';

export {
  placeholderFieldEditing,
  placeholderFieldEditingKey,
  placeholderFieldDrop,
  placeholderFieldDropKey,
  placeholderFieldPaste,
  placeholderFieldPasteKey,
} from './plugins';

export {
  insertPlaceholderField,
  deletePlaceholderField,
  updatePlaceholderFieldAttrs,
  updatePlaceholderFieldById,
  deletePlaceholderFieldById,
  replacePlaceholderFieldWithValue,
  buildReplacePlaceholderFieldWithValue,
} from './commands';

export {
  updateDOMAttributes,
  isPlaceholderField,
  getAllPlaceholderFields,
  findPlaceholderFields,
  findPlaceholderFieldsById,
  findPlaceholderFieldsBetween,
} from './helpers';

export type {
  NodeWithPos,
  MutableAttrs,
  getFromDOM,
  setDOMAttr,
  PlaceholderFieldAttributes,
  PlaceholderFieldNode,
  PlaceholderFieldNodeOptions,
  NodeViewUserOptions,
  NodeViewSpec,
  ReplacerProps,
  ReplacerFn,
} from './types'
