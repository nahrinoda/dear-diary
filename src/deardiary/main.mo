import List "mo:base/List";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

persistent actor DDiary {

  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };

  public type Diary = {
    title: Text;
    content: Text;
  };

  // ---------------------------------------------------------------------------
  // Stable storage — persists across canister upgrades.
  // Actor references (NFTActorClass.NFT) cannot be stored in stable memory, so
  // we store the NFT canister Principals and reconstruct actors on upgrade.
  // Owner lists are stored as arrays ([Principal]) — List.List is not stable.
  // ---------------------------------------------------------------------------
  var nftPrincipalEntries : [Principal] = [];
  var ownerEntries : [(Principal, [Principal])] = [];
  var listingEntries : [(Principal, Listing)] = [];
  var diaries : List.List<Diary> = List.nil<Diary>();

  // ---------------------------------------------------------------------------
  // Runtime HashMaps — rebuilt from stable entries on each upgrade.
  // Marked transient because they contain non-stable types (actor refs, Lists).
  // ---------------------------------------------------------------------------
  transient var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  transient var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  transient var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

  // ---------------------------------------------------------------------------
  // Upgrade hooks
  // ---------------------------------------------------------------------------
  system func preupgrade() {
    nftPrincipalEntries := Iter.toArray(mapOfNFTs.keys());

    ownerEntries := Array.map<(Principal, List.List<Principal>), (Principal, [Principal])>(
      Iter.toArray(mapOfOwners.entries()),
      func ((owner, nftList)) { (owner, List.toArray(nftList)) }
    );

    listingEntries := Iter.toArray(mapOfListings.entries());
  };

  system func postupgrade() {
    for (nftId in nftPrincipalEntries.vals()) {
      let nftActor : NFTActorClass.NFT = actor(Principal.toText(nftId));
      mapOfNFTs.put(nftId, nftActor);
    };

    for ((owner, nftArray) in ownerEntries.vals()) {
      mapOfOwners.put(owner, List.fromArray(nftArray));
    };

    for ((nftId, listing) in listingEntries.vals()) {
      mapOfListings.put(nftId, listing);
    };

    nftPrincipalEntries := [];
    ownerEntries := [];
    listingEntries := [];
  };

  // ---------------------------------------------------------------------------
  // Diary CRUD
  // ---------------------------------------------------------------------------
  public func createDiary(titleText: Text, contentText: Text) {
    let newDiary: Diary = {
      title = titleText;
      content = contentText;
    };
    diaries := List.push(newDiary, diaries);
  };

  public query func readDiaries(): async [Diary] {
    return List.toArray(diaries);
  };

  public func removeDiaries(id: Nat) {
    let listFront = List.take(diaries, id);
    let listBack = List.drop(diaries, id + 1);
    diaries := List.append(listFront, listBack);
  };

  // ---------------------------------------------------------------------------
  // NFT minting
  // ---------------------------------------------------------------------------
  public shared(msg) func mint(name: Text, content: Text, coverImage: [Nat8]) : async Principal {
    let owner: Principal = msg.caller;

    // New Motoko syntax for attaching cycles to an async call
    let newNFT = await (with cycles = 100_500_000_000) NFTActorClass.NFT(name, owner, content, coverImage);

    let newNFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal;
  };

  private func addToOwnershipMap(owner: Principal, nftId: Principal) {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------
  public query func getOwnedNFTs(user: Principal) : async [Principal] {
    var userNFTs : List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(userNFTs);
  };

  public query func getListedNFTs() : async [Principal] {
    return Iter.toArray(mapOfListings.keys());
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
      return "You don't own this NFT.";
    };
  };

  public query func getDearDiaryCanisterID() : async Principal {
    return Principal.fromActor(DDiary);
  };

  public query func isListed(id: Principal) : async Bool {
    return mapOfListings.get(id) != null;
  };

  // Returns the anonymous principal ("2vxsx-fae") as a sentinel when the NFT
  // is not listed. This avoids the Principal.fromText("") trap from before.
  public query func getOriginalOwner(id: Principal) : async Principal {
    switch (mapOfListings.get(id)) {
      case null return Principal.fromText("2vxsx-fae");
      case (?listing) return listing.itemOwner;
    };
  };

  public query func getListedNFTPrice(id: Principal) : async Nat {
    switch (mapOfListings.get(id)) {
      case null return 0;
      case (?listing) return listing.itemPrice;
    };
  };

};
