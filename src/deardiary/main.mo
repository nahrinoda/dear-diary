import Cycles "mo:base/ExperimentalCycles";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";

actor DDiary {

  public type Diary = {
    id: Nat;
    diaryLabel: Text;
    content: Text;
    createdAt: Text;
  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

  stable var diaries: List.List<Diary> = List.nil<Diary>();

  public func createDiary(idNumber: Nat, labelText: Text, contentText: Text, dateText: Text) {
    let newDiary: Diary = {
      id = idNumber;
      diaryLabel = labelText;
      content = contentText;
      createdAt = dateText;
    };

    diaries := List.push(newDiary, diaries);
    // Debug.print(debug_show(diaries));
  };

  public query func readDiaries(): async [Diary] {
    let test = List.toArray(diaries);
    // Debug.print(debug_show(test));
    return List.toArray(diaries);
  };

  public func removeDiaries(id: Nat) {
    let listFront = List.take(diaries, id);
    let listBack = List.drop(diaries, id + 1);
    diaries := List.append(listFront, listBack);
    //  Debug.print(debug_show(diaries))
  }; 

  public shared(msg) func mint(name: Text, content: Text) : async Principal {
    let owner: Principal = msg.caller;

    Debug.print(debug_show(Cycles.balance()));
    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, content);
    Debug.print(debug_show(Cycles.balance()));

    let newNFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal
  };

  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
      var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
        case null List.nil<Principal>();
        case (?result) result;
      };

      ownedNFTs := List.push(nftId, ownedNFTs);
      mapOfOwners.put(owner, ownedNFTs);

  };

  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };

    return List.toArray(userNFTs);
  };

};