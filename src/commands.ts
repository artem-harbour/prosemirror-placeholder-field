export const commands = true;

// export const insertFormElement = 
//   (typeName, pos, attrs = {}) => 
//   ({ editor, tr, dispatch }) => {
//     const { schema } = editor;

//     if (dispatch) {
//       const insertPos = tr.mapping.map(pos);
//       const node = schema.nodes[typeName].create({ id: uuidv4(), ...attrs }, null, null);
//       tr.insert(insertPos, node);
//     }

//     return true;
// };
