import { Plugin, PluginKey } from 'prosemirror-state';
import { insertPlaceholderField } from './commands';

export const placeholderFieldDropKey = new PluginKey('placeholderFieldDrop');

export function placeholderFieldDrop({
  handleOutside = false,
} = {}): Plugin {
  return new Plugin({
    key: placeholderFieldDropKey,
    props: {
      handleDrop: (view, event, slice, moved) => {
        if (moved || !view.editable) {
          return false;
        }

        const placeholderField = event?.dataTransfer?.getData('placeholderField');

        if (placeholderField) {
          if (handleOutside) {
            handleDropOutside({
              placeholderField,
              view,
              event,
            });
          } else {
            let placeholderFieldData;

            try {
              placeholderFieldData = JSON.parse(placeholderField);
            } catch {
              return false;
            }

            const coordinates = view.posAtCoords({ 
              left: event.clientX,
              top: event.clientY,
            });

            if (coordinates) {
              const { attrs } = placeholderFieldData;
              insertPlaceholderField(coordinates.pos, { ...attrs })(view.state, view.dispatch);
            }
          }

          return true;
        }
    
        return false;
      },
    },
  });
}

function handleDropOutside({ placeholderField, view, event }) {
  let placeholderFieldData;
  try {
    placeholderFieldData = JSON.parse(placeholderField);
  } catch {
    return;
  }

  let coordinates = view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  });

  if (coordinates) {
    document.dispatchEvent(new CustomEvent('placeholderFieldDrop', {
      bubbles: true,
      detail: {
        view,
        event,
        pos: coordinates.pos,
        data: placeholderFieldData,
      },
    }));
  }
}

export const placeholderFieldPasteKey = new PluginKey('placeholderFieldPaste');

export function placeholderFieldPaste(): Plugin {
  return new Plugin({
    key: placeholderFieldPasteKey,
    props: {
      handlePaste(view, event, slice) {
        const content = slice.content.content.filter((item) => item.type.name === 'placeholderField');
        if (content.length) {
          document.dispatchEvent(new CustomEvent('placeholderFieldPaste', {
            bubbles: true,
            detail: {
              view,
              event,
              content,
            },
          }));
        }
        return false;
      },
    },
  });
}
