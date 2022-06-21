export const idlFactory = ({ IDL }) => {
  const NFT = IDL.Service({
    'getContent' : IDL.Func([], [IDL.Text], ['query']),
    'getLabel' : IDL.Func([], [IDL.Text], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Text];
};
