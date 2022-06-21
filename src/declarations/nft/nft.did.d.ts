import type { Principal } from '@dfinity/principal';
export interface NFT {
  'getContent' : () => Promise<string>,
  'getLabel' : () => Promise<string>,
  'getOwner' : () => Promise<Principal>,
}
export interface _SERVICE extends NFT {}