import type { Principal } from '@dfinity/principal';
export interface Diary { 'title' : string, 'content' : string }
export interface _SERVICE {
  'createDiary' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'getDearDiaryCanisterID' : () => Promise<Principal>,
  'getListedNFTPrice' : (arg_0: Principal) => Promise<bigint>,
  'getListedNFTs' : () => Promise<Array<Principal>>,
  'getOriginalOwner' : (arg_0: Principal) => Promise<Principal>,
  'getOwnedNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: string, arg_1: string, arg_2: Array<number>) => Promise<
      Principal
    >,
  'readDiaries' : () => Promise<Array<Diary>>,
  'removeDiaries' : (arg_0: bigint) => Promise<undefined>,
}
