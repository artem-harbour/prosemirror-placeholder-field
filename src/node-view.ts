
import { NodeViewSpec, NodeViewUserOptions } from './types';
import { Node } from 'prosemirror-model';
import { EditorView, NodeView, ViewMutationRecord } from 'prosemirror-view';
import { placeholderFieldClass, placeholderFieldContentClass } from './schema';
import { updateDOMAttributes } from './helpers';
import { setPlaceholderFieldDOMAttrs } from './schema';

// TODO: add kinds, build/update handlers to options?
export class PlaceholderFieldView implements NodeView {
  // options: NodeViewUserOptions;

  node: Node;

  view: EditorView;

  getPos: () => number | undefined;

  root!: HTMLElement;

  constructor(props: NodeViewSpec) {
    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos;
    // this.options = props.options;

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.mount();
  }

  get dom(): HTMLElement {
    return this.root;
  }

  mount(): void {
    this.buildView();
    this.addEventListeners();
  }

  createElement(): {
    element: HTMLSpanElement
    contentElement: HTMLSpanElement
  } {
    const element = document.createElement('span');
    element.classList.add(placeholderFieldClass);

    const contentElement = document.createElement('span');
    contentElement.classList.add(placeholderFieldContentClass);
    contentElement.contentEditable = 'false';
    contentElement.style.pointerEvents = 'none';

    element.append(contentElement);

    const style = this.getElementStyle();
    const domAttrs = setPlaceholderFieldDOMAttrs(this.node);
    updateDOMAttributes(element, { ...domAttrs, style });

    return { element, contentElement };
  }

  getElementStyle(): string {
    const { attrs } = this.node;
    const { color } = attrs;
    const style = [
      'padding: 1px 2px',
      'box-sizing: border-box',
      `background-color: ${color != null ? `${color}33` : 'none'}`,
    ].join('; ');
    return style;
  }

  buildView(): void {
    const handlers: Record<string, () => void> = {
      text: () => this.buildTextView(),
      default: () => this.buildTextView(),
    };

    const handleBuild = handlers[this.node.attrs.kind] ?? handlers.default;
    handleBuild();
  }

  buildTextView(): void {
    const { attrs } = this.node;
    const { element, contentElement } = this.createElement();
    contentElement.textContent = attrs.value || attrs.label;
    this.root = element;
  }

  update(node: Node) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;

    const domAttrs = setPlaceholderFieldDOMAttrs(this.node);
    const style = this.getElementStyle();
    updateDOMAttributes(this.root, { ...domAttrs, style });

    const handlers: Record<string, () => void> = {
      text: () => this.updateTextView(),
      default: () => this.updateTextView(),
    };

    const handleUpdate = handlers[this.node.attrs.kind] ?? handlers.default;
    handleUpdate();

    return true;
  }

  updateTextView(): void {
    const { attrs } = this.node;
    const contentElement = this.dom.firstElementChild as HTMLElement;
    contentElement.textContent = attrs.value || attrs.label;
  }

  addEventListeners(): void {
    this.dom.addEventListener('click', this.handleClick);
    this.dom.addEventListener('dblclick', this.handleDoubleClick);
  }

  removeEventListeners(): void {
    this.dom.removeEventListener('click', this.handleClick);
    this.dom.removeEventListener('dblclick', this.handleDoubleClick);
  }

  handleClick(event: Event): void {
    if (!this.view.editable) {
      return;
    }

    document.dispatchEvent(new CustomEvent('placeholderFieldClick', {
      bubbles: true,
      detail: {
        view: this.view,
        node: this.node,
        getPos: this.getPos,
        event,
      },
    }));
  }

  handleDoubleClick(event: Event): void {
    if (!this.view.editable) {
      return;
    }

    document.dispatchEvent(new CustomEvent('placeholderFieldDoubleClick', {
      bubbles: true,
      detail: {
        view: this.view,
        node: this.node,
        getPos: this.getPos,
        event,
      },
    }));
  }

  destroy(): void {
    this.removeEventListeners();
    this.dom.remove();
  }

  stopEvent(event: Event) { 
    return false;
  }

  ignoreMutation(mutation: ViewMutationRecord) {
    // A leaf/atom node is like a black box for ProseMirror
    // and should be fully handled by the node view.
    return true;
  }

  updateAttributes(attrs: Record<string, any>): void {
    const pos = this.getPos();

    if (typeof pos !== 'number') {
      return;
    }

    return this.view.dispatch(
      this.view.state.tr.setNodeMarkup(pos, undefined, {
        ...this.node.attrs,
        ...attrs,
      })
    );
  }
}
