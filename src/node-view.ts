import { placeholderFieldClass, placeholderFieldContentClass } from './schema';
import { updateDOMAttributes } from './helpers';
import { setPlaceholderFieldDOMAttrs } from './schema';

export class PlaceholderFieldView {
  options;

  node;

  view;

  getPos;

  decorations;

  innerDecorations;

  root;

  constructor(props, options = {}) {
    this.options = {
      stopEvent: null,
      ...options,
    };

    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos
    this.decorations = props.decorations;
    this.innerDecorations = props.innerDecorations;

    this.mount(props, options);
    this.addEventListeners();
  }

  get dom() {
    return this.root;
  }

  get contentDOM() {
    return null;
  }

  mount(props, options) {
    this.buildView();
  }

  createElement() {
    const { attrs } = this.node;

    const element = document.createElement('span');
    element.classList.add(placeholderFieldClass);

    const contentElement = document.createElement('span');
    contentElement.classList.add(placeholderFieldContentClass);
    contentElement.style.pointerEvents = 'none';
    contentElement.contentEditable = 'false';

    element.append(contentElement);

    const color = attrs.color;
    const style = [
      'padding: 1px 2px',
      'box-sizing: border-box',
      `background-color: ${color != null ? `${color}33` : 'none'}`,
    ].join('; ');

    const domAttrs = setPlaceholderFieldDOMAttrs(this.node, {}); // TODO
    updateDOMAttributes(element, { ...domAttrs, style });

    return { element, contentElement };
  }

  buildView() {
    const { kind } = this.node.attrs;

    const handlers = {
      text: () => this.buildTextView(),
      default: () => this.buildTextView(),
    };

    const build = handlers[kind] ?? handlers.default;

    build();
  }

  buildTextView() {
    const { attrs } = this.node;
    const { element, contentElement } = this.createElement();
    contentElement.textContent = attrs.value || attrs.label;
    this.root = element;
  }

  addEventListeners() {}

  removeEventListeners() {}

  // Can be used to manually update the NodeView, 
  // otherwise the NodeView is recreated.
  // TODO: convert view to component to fully control with attrs?
  update(node, decorations, innerDecorations) {
    return false;
  }

  ignoreMutation(mutation) {
    // A leaf/atom node is like a black box for ProseMirror
    // and should be fully handled by the node view.
    return true;
  }

  destroy() {
    this.removeEventListeners();
    this.dom.remove();
  }

  updateAttributes(attrs) {
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
