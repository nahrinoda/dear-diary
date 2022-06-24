export const idlFactory = ({ IDL }) => {
  const Diary = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'diaryLabel' : IDL.Text,
    'createdAt' : IDL.Text,
  });
  return IDL.Service({
    'createDiary' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [],
        ['oneway'],
      ),
    'mint' : IDL.Func([IDL.Text, IDL.Text], [IDL.Principal], []),
    'readDiaries' : IDL.Func([], [IDL.Vec(Diary)], ['query']),
    'removeDiaries' : IDL.Func([IDL.Nat], [], ['oneway']),
  });
};
export const init = ({ IDL }) => { return []; };
