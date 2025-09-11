
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
  getRandomId,
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
  placeholderFieldDrop({ handleOutside: true }),
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

// Demo
// insertPlaceholderField(0, { label: 'Text field', id: `111` })(view.state, view.dispatch);

const demoInputs = [...document.querySelectorAll('.demo-input')] as HTMLInputElement[];
const demoDraggableField = document.querySelector('.demo-app__field') as HTMLElement;
const replaceButton = document.querySelector('.demo-button') as HTMLButtonElement;

demoInputs.forEach((input) => {
  input.addEventListener('input', (event: Event) => {
    const target = (event.target as HTMLInputElement);
    const value = target.value;
    const id = target.dataset.id!;
    updatePlaceholderFieldById(id, { value })(view.state, view.dispatch);
  });
});

replaceButton.addEventListener('click', (event: Event) => {
  replacePlaceholderFieldWithValue(null)(view.state, view.dispatch);
});

// Example with handleOutside === true
demoDraggableField.addEventListener('dragstart', (event) => {
  event.dataTransfer!.clearData('placeholderField');
  event.dataTransfer!.setData('placeholderField', JSON.stringify({
    sourceField: 'demo',
  }));
});

document.addEventListener('placeholderFieldDrop', (event) => {
  const { detail } = event as CustomEvent;
  const { pos, data } = detail;
  if (data.sourceField === 'demo') {
    insertPlaceholderField(pos, { 
      id: getRandomId(),
      kind: 'text',
      label: 'Demo field',
      value: 'Text value',
    })(view.state, view.dispatch);
  }
});

/*
// Example with handleOutside === false
demoDraggableField.addEventListener('dragstart', (event) => {
  event.dataTransfer!.clearData('placeholderField');
  event.dataTransfer!.setData('placeholderField', JSON.stringify({
    attrs: {
      id: getRandomId(),
      kind: 'text',
      label: 'Demo field',
      value: 'Text value',
    },
  }));
}); 
*/
