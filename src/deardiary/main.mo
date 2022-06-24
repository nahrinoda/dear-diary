import Cycles "mo:base/ExperimentalCycles";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";

actor DDiary {

  public type Diary = {
    id: Nat;
    diaryLabel: Text;
    content: Text;
    createdAt: Text;
  };

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

    return newNFTPrincipal
  };

}