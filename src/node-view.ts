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
    this.options = { ...options };

    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos
    this.decorations = props.decorations;
    this.innerDecorations = props.innerDecorations;

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.mount();
  }

  get dom() {
    return this.root;
  }

  get contentDOM() {
    return null;
  }

  mount() {
    this.buildView();
    this.addEventListeners();
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

    const style = this.getElementStyle();
    const domAttrs = setPlaceholderFieldDOMAttrs(this.node, {}); // TODO
    updateDOMAttributes(element, { ...domAttrs, style });

    return { element, contentElement };
  }

  getElementStyle() {
    const { attrs } = this.node;
    const { color } = attrs;
    const style = [
      'padding: 1px 2px',
      'box-sizing: border-box',
      `background-color: ${color != null ? `${color}33` : 'none'}`,
    ].join('; ');
    return style;
  }

  buildView() {
    const handlers = {
      text: () => this.buildTextView(),
      default: () => this.buildTextView(),
    };

    const handleBuild = handlers[this.node.attrs.kind] ?? handlers.default;
    handleBuild();
  }

  buildTextView() {
    const { attrs } = this.node;
    const { element, contentElement } = this.createElement();
    contentElement.textContent = attrs.value || attrs.label;
    this.root = element;
  }

  update(node, decorations, innerDecorations) {
    if (node.type !== this.node.type) {
      return false;
    }

    this.node = node;
    this.decorations = decorations;
    this.innerDecorations = innerDecorations;

    const domAttrs = setPlaceholderFieldDOMAttrs(this.node, {}); // TODO
    const style = this.getElementStyle();
    updateDOMAttributes(this.root, { ...domAttrs, style });

    const handlers = {
      text: () => this.updateTextView(),
      default: () => this.updateTextView(),
    };

    const handleUpdate = handlers[this.node.attrs.kind] ?? handlers.default;
    handleUpdate();

    return true;
  }

  updateTextView() {
    const { attrs } = this.node;
    const contentElement = this.dom.firstElementChild;
    contentElement.textContent = attrs.value || attrs.label;
  }

  addEventListeners() {
    this.dom.addEventListener('click', this.handleClick);
    this.dom.addEventListener('dblclick', this.handleDoubleClick);
  }

  removeEventListeners() {
    this.dom.removeEventListener('click', this.handleClick);
    this.dom.removeEventListener('dblclick', this.handleDoubleClick);
  }

  handleClick(event) {
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

  handleDoubleClick(event) {
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

  destroy() {
    this.removeEventListeners();
    this.dom.remove();
  }

  stopEvent(event) { 
    return false;
  }

  ignoreMutation(mutation) {
    // A leaf/atom node is like a black box for ProseMirror
    // and should be fully handled by the node view.
    return true;
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
