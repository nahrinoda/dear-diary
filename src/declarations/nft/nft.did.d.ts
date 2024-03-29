import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getCanisterId' : () => Promise<Principal>,
  'getContent' : () => Promise<string>,
  'getCoverImage' : () => Promise<Array<number>>,
  'getLabel' : () => Promise<string>,
  'getOwner' : () => Promise<Principal>,
  'transferOwnership' : (arg_0: Principal) => Promise<string>,
}
export interface _SERVICE extends NFT {}
