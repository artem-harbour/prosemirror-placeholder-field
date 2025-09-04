
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import './style.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { 
  placeholderFieldNode,
  placeholderFieldEditing,
  placeholderFieldDrop,
  placeholderFieldPaste,
  insertPlaceholderField,
  updatePlaceholderFieldById,
  replacePlaceholderFieldWithValue,
} from '../src';

const nodes = addListNodes(baseSchema.spec.nodes, 'paragraph block*', 'block');

const schema = new Schema({
  nodes: nodes.append(placeholderFieldNode()),
  marks: baseSchema.spec.marks,
});

const plugins = [
  ...exampleSetup({ schema }),
  placeholderFieldEditing(),
  placeholderFieldDrop(),
  placeholderFieldPaste(),
];

const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content") as HTMLElement),
  plugins,
});

const view = new EditorView(document.querySelector('#editor'), { state });
window.view = view;



/// Testing.

// insertPlaceholderField(10, { label: 'Text field', id: `111` })(view.state, view.dispatch);

const input = document.querySelector('.demo-input');
input!.addEventListener('input', (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  updatePlaceholderFieldById(['111'], { value })(view.state, view.dispatch);
});

// setTimeout(() => {
//   replacePlaceholderFieldWithValue(['111'])(view.state, view.dispatch);
// }, 5000);
