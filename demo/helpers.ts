
import type { ReplacerFn } from '../src';

export function buildLinkView() {
  const { attrs } = this.node;
  const { element, contentElement } = this.createElement();
  if (attrs.value) {
    const link = document.createElement('a');
    link.href = attrs.value;
    link.target = '_blank';
    link.textContent = attrs.value;
    link.style.textDecoration = 'none';
    contentElement.append(link);
  } else {
    contentElement.textContent = attrs.label;
  }
  this.root = element;
}

export function updateLinkView() {
  const { attrs } = this.node;
  const contentElement = this.dom.firstElementChild;
  if (attrs.value) {
    const link = document.createElement('a');
    link.href = attrs.value;
    link.target = '_blank';
    link.textContent = attrs.value;
    link.style.textDecoration = 'none';
    contentElement.replaceChildren(link)
  } else {
    contentElement.textContent = attrs.label;
  }
}

export function buildImageView() {
  const { attrs } = this.node;
  const { element, contentElement } = this.createElement();
  if (attrs.value) {
    const img = document.createElement('img');
    img.src = attrs.value;
    img.style.height = 'auto';
    img.style.maxWidth = '100%';
    img.style.pointerEvents = 'none';
    img.style.verticalAlign = 'middle';
    
    element.style.display = 'inline-block';
    contentElement.style.display = 'inline-block';

    contentElement.append(img);
  } else {
    contentElement.textContent = attrs.label;
  }
  this.root = element;
}

export function updateImageView() {
  const { attrs } = this.node;
  const contentElement = this.dom.firstElementChild;
  if (attrs.value) {
    const img = document.createElement('img');
    img.src = attrs.value;
    img.style.height = 'auto';
    img.style.maxWidth = '100%';
    img.style.pointerEvents = 'none';
    img.style.verticalAlign = 'middle';

    this.dom.style.display = 'inline-block';
    contentElement.style.display = 'inline-block';

    contentElement.replaceChildren(img);
  } else {
    this.dom.style.display = '';
    contentElement.style.display = '';

    contentElement.textContent = attrs.label;
  }
}

export const replaceLink: ReplacerFn = ({
  state,
  tr,
  node,
  from,
  to,
}) => {
  const value = node.attrs.value || ' ';
  const link = state.schema.marks.link.create({ href: value, title: '' });
  const textNode = state.schema.text(value, [link]);
  tr.replaceWith(from, to, textNode);
}

export const replaceImage: ReplacerFn = ({
  state,
  tr,
  node,
  from,
  to,
}) => {
  const value = node.attrs.value;
  const image = state.schema.nodes.image.create({ src: value });
  if (value) {
    tr.replaceWith(from, to, image);
  } else {
    tr.replaceWith(from, to, state.schema.text(' '));
  }
}
