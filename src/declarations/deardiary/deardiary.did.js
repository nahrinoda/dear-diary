export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'createDiary' : IDL.Func([IDL.Text, IDL.Text], [], ['oneway']),
  });
};
export const init = ({ IDL }) => { return []; };
