import type { Principal } from '@dfinity/principal';
export interface Diary {
  'id' : bigint,
  'content' : string,
  'diaryLabel' : string,
  'createdAt' : string,
}
export interface _SERVICE {
  'createDiary' : (
      arg_0: bigint,
      arg_1: string,
      arg_2: string,
      arg_3: string,
    ) => Promise<undefined>,
  'getDearDiaryCanisterID' : () => Promise<Principal>,
  'getOwnedNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: string, arg_1: string) => Promise<Principal>,
  'readDiaries' : () => Promise<Array<Diary>>,
  'removeDiaries' : (arg_0: bigint) => Promise<undefined>,
}
