
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
  buildLinkView, 
  updateLinkView,
  buildImageView,
  updateImageView,
  replaceLink,
  replaceImage,
} from './helpers';
import { 
  placeholderFieldNode,
  placeholderFieldEditing,
  placeholderFieldDrop,
  placeholderFieldPaste,
  insertPlaceholderField,
  updatePlaceholderFieldById,
  buildReplacePlaceholderFieldWithValue,
} from '../src';

const nodes = addListNodes(baseSchema.spec.nodes, 'paragraph block*', 'block');

const schema = new Schema({
  nodes: nodes.append(placeholderFieldNode()),
  marks: baseSchema.spec.marks,
});

const plugins = [
  ...exampleSetup({ schema }),
  placeholderFieldDrop(),
  placeholderFieldPaste(),
  placeholderFieldEditing({
    viewHandlers: {
      link: {
        buildView: buildLinkView,
        updateView: updateLinkView,
      },
      image: {
        buildView: buildImageView,
        updateView: updateImageView,
      },
    },
  }),
];

const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content") as HTMLElement),
  plugins,
});

const view = new EditorView(document.querySelector('#editor'), { state });
(window as any).view = view;

const replacePlaceholderFieldWithValue = buildReplacePlaceholderFieldWithValue({
  link: replaceLink,
  image: replaceImage,
});

// Example
// insertPlaceholderField(0, { label: 'Text field', id: `111` })(view.state, view.dispatch);

const inputName = document.querySelector('.demo-input--name');
inputName!.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  updatePlaceholderFieldById('1', { value })(view.state, view.dispatch);
});

const inputJob = document.querySelector('.demo-input--job');
inputJob!.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  updatePlaceholderFieldById('2', { value })(view.state, view.dispatch);
});

const inputCompany = document.querySelector('.demo-input--company');
inputCompany!.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  updatePlaceholderFieldById('3', { value })(view.state, view.dispatch);
});

const inputWebsite = document.querySelector('.demo-input--website');
inputWebsite!.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  updatePlaceholderFieldById('4', { value })(view.state, view.dispatch);
});

const inputImage = document.querySelector('.demo-input--image');
inputImage!.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  updatePlaceholderFieldById('5', { value })(view.state, view.dispatch);
});

const replaceButton = document.querySelector('.demo-button');
replaceButton!.addEventListener('click', (event: Event) => {
  replacePlaceholderFieldWithValue(null)(view.state, view.dispatch);
});
