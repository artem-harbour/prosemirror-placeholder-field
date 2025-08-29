import { placeholderFieldNode } from './schema';
import { PlaceholderFieldView } from './node-view';

import {
  placeholderFieldDrop,
  placeholderFieldPaste,
} from './plugins';

import { 
  insertPlaceholderField,
  deletePlaceholderField,
  updatePlaceholderFieldAttrs,
  updatePlaceholderFieldById,
  deletePlaceholderFieldById,
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
  // schema
  placeholderFieldNode,

  // view
  PlaceholderFieldView,

  // plugins
  placeholderFieldDrop,
  placeholderFieldPaste,

  // commands
  insertPlaceholderField,
  deletePlaceholderField,
  updatePlaceholderFieldAttrs,
  updatePlaceholderFieldById,
  deletePlaceholderFieldById,

  // helpers
  updateDOMAttributes,
  isPlaceholderField,
  getAllPlaceholderFields,
  findPlaceholderFields,
  findPlaceholderFieldsById,
  findPlaceholderFieldsBetween,
};
