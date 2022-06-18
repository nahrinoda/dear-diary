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
  'readDiaries' : () => Promise<Array<Diary>>,
  'removeDiaries' : (arg_0: bigint) => Promise<undefined>,
}
