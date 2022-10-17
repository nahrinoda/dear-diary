import Cycles "mo:base/ExperimentalCycles";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor DDiary {

  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };

  public type Diary = {
    // id: Nat;
    title: Text;
    content: Text;
    // createdAt: Text;
  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

  stable var diaries: List.List<Diary> = List.nil<Diary>();

  public func createDiary(titleText: Text, contentText: Text) {
    let newDiary: Diary = {
      // id = idNumber;
      title = titleText;
      content = contentText;
      // createdAt = dateText;
    };

    diaries := List.push(newDiary, diaries);
    Debug.print(debug_show(diaries));
  };

  public query func readDiaries(): async [Diary] {
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

  public query func getListedNFTs() : async [Principal] {
    let ids = Iter.toArray(mapOfListings.keys());
    return ids;
  };

  public shared(msg) func listItem(id: Principal, price: Nat) : async Text {
    var item : NFTActorClass.NFT = switch (mapOfNFTs.get(id)) {
      case null return "NFT does not exist.";
      case (?result) result;
    };

    let owner = await item.getOwner();
    if (Principal.equal(owner, msg.caller)) {
      let newListing : Listing = {
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListings.put(id, newListing);
      return "Success";
    } else {
      return "You don't own this NFT."
    };

  };

  public query func getDearDiaryCanisterID() : async Principal {
    return Principal.fromActor(DDiary);
  };

  public query func isListed(id: Principal) : async Bool {
    if (mapOfListings.get(id) == null) {
      return false;
    } else {
      return true;
    }
  };

  public query func getOriginalOwner(id: Principal) : async Principal {
    var listing : Listing = switch (mapOfListings.get(id)) {
      case null return Principal.fromText("");
      case (?result) result;
    };

    return listing.itemOwner;
  };

  public query func getListedNFTPrice(id: Principal) : async Nat {
    var listing : Listing = switch (mapOfListings.get(id)) {
      case null return 0;
      case (?result) result;
    };

    return listing.itemPrice;
  };

};