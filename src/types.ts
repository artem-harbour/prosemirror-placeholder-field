import type { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

export type NodeWithPos = {
  node: Node
  pos: number
}

export type MutableAttrs = Record<string, unknown>;

export type getFromDOM = (dom: HTMLElement) => unknown;

export type setDOMAttr = (value: unknown, attrs: MutableAttrs) => void;

export interface PlaceholderFieldAttributes {
  default: unknown;

  validate?: string | ((value: unknown) => void);

  getFromDOM?: getFromDOM;

  setDOMAttr?: setDOMAttr;
}

export interface PlaceholderFieldNodeOptions {
  color?: string,
  extraAttributes?: { [key: string]: PlaceholderFieldAttributes };
}

export interface NodeViewUserOptions {}

export interface NodeViewSpec {
  node: Node
  view: EditorView
  getPos: () => number | undefined
  //
  options: NodeViewUserOptions
}
