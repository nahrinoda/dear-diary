import type { Principal } from '@icp-sdk/core/principal';
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface Diary { 'title' : string, 'content' : string }
export interface _SERVICE {
  'createDiary' : ActorMethod<[string, string], undefined>,
  'getDearDiaryCanisterID' : ActorMethod<[], Principal>,
  'getListedNFTPrice' : ActorMethod<[Principal], bigint>,
  'getListedNFTs' : ActorMethod<[], Array<Principal>>,
  'getOriginalOwner' : ActorMethod<[Principal], Principal>,
  'getOwnedNFTs' : ActorMethod<[Principal], Array<Principal>>,
  'isListed' : ActorMethod<[Principal], boolean>,
  'listItem' : ActorMethod<[Principal, bigint], string>,
  'mint' : ActorMethod<[string, string, Uint8Array | number[]], Principal>,
  'readDiaries' : ActorMethod<[], Array<Diary>>,
  'removeDiaries' : ActorMethod<[bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
