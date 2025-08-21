
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import './style.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import { sayHello } from 'prosemirror-placeholder-field';

const nodes = addListNodes(schema.spec.nodes, 'paragraph block*', 'block');
const demoSchema = new Schema({
  nodes,
  marks: schema.spec.marks,
});

const plugins = [
  ...exampleSetup({ schema: demoSchema }),
];

const state = EditorState.create({
  doc: DOMParser.fromSchema(demoSchema).parse(document.querySelector("#content")),
  plugins,
});

const view = new EditorView(document.querySelector('#editor'), { state });
window.view = view;

sayHello('Joe');
