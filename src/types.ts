import type { Node, NodeSpec, Attrs } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';

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

export type PlaceholderFieldNode = Record<'placeholderField', NodeSpec>

export interface PlaceholderFieldNodeOptions {
  defaultColor?: string,
  extraAttributes?: { [key: string]: PlaceholderFieldAttributes };
}

export interface NodeViewUserOptions {
  viewHandlers?: { [key: string]: { buildView?: () => void, updateView?: () => void } }
  extraAttributes?: { [key: string]: PlaceholderFieldAttributes }
  setDOMAttrs?: (node: Node) => Attrs,
}

export interface NodeViewSpec {
  node: Node
  view: EditorView
  getPos: () => number | undefined
  //
  options?: NodeViewUserOptions
}

export interface ReplacerProps {
  state: EditorState
  tr: Transaction
  node: Node
  pos: number
  from: number,
  to: number,
}

export type ReplacerFn = (props: ReplacerProps ) => void;
