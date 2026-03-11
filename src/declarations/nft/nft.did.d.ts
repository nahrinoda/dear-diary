import type { Principal } from '@icp-sdk/core/principal';
import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export interface NFT {
  'getCanisterId' : ActorMethod<[], Principal>,
  'getContent' : ActorMethod<[], string>,
  'getCoverImage' : ActorMethod<[], Uint8Array | number[]>,
  'getLabel' : ActorMethod<[], string>,
  'getOwner' : ActorMethod<[], Principal>,
  'transferOwnership' : ActorMethod<[Principal], string>,
}
export interface _SERVICE extends NFT {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
