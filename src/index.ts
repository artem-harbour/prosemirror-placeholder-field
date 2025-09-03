import { 
  NodeWithPos,
  MutableAttrs,
  getFromDOM,
  setDOMAttr,
  PlaceholderFieldAttributes,
  PlaceholderFieldNodeOptions,
} from './types';

import { placeholderFieldNode } from './schema';
import { PlaceholderFieldView } from './node-view';

import {
  placeholderFieldDrop,
  placeholderFieldDropKey,
  placeholderFieldPaste,
  placeholderFieldPasteKey,
} from './plugins';

import { 
  insertPlaceholderField,
  deletePlaceholderField,
  updatePlaceholderFieldAttrs,
  updatePlaceholderFieldById,
  deletePlaceholderFieldById,
  replacePlaceholderFieldWithValue,
} from './commands';

import { 
  updateDOMAttributes,
  isPlaceholderField,
  getAllPlaceholderFields,
  findPlaceholderFields,
  findPlaceholderFieldsById,
  findPlaceholderFieldsBetween,
} from './helpers';

export {
  // types
  NodeWithPos,
  MutableAttrs,
  getFromDOM,
  setDOMAttr,
  PlaceholderFieldAttributes,
  PlaceholderFieldNodeOptions,

  // schema
  placeholderFieldNode,

  // view
  PlaceholderFieldView,

  // plugins
  placeholderFieldDrop,
  placeholderFieldDropKey,
  placeholderFieldPaste,
  placeholderFieldPasteKey,

  // commands
  insertPlaceholderField,
  deletePlaceholderField,
  updatePlaceholderFieldAttrs,
  updatePlaceholderFieldById,
  deletePlaceholderFieldById,
  replacePlaceholderFieldWithValue,

  // helpers
  updateDOMAttributes,
  isPlaceholderField,
  getAllPlaceholderFields,
  findPlaceholderFields,
  findPlaceholderFieldsById,
  findPlaceholderFieldsBetween,
};
