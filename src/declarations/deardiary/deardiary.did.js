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
    'getDearDiaryCanisterID' : IDL.Func([], [IDL.Principal], ['query']),
    'getListedNFTPrice' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getListedNFTs' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getOriginalOwner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'getOwnedNFTs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'isListed' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'listItem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
    'mint' : IDL.Func([IDL.Text, IDL.Text], [IDL.Principal], []),
    'readDiaries' : IDL.Func([], [IDL.Vec(Diary)], ['query']),
    'removeDiaries' : IDL.Func([IDL.Nat], [], ['oneway']),
  });
};
export const init = ({ IDL }) => { return []; };
