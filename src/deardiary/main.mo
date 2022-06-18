import List "mo:base/List";
import Debug "mo:base/Debug";

actor DDiary {

  public type Diary = {
    id: Nat;
    diaryLabel: Text;
    content: Text;
    createdAt: Text;
  };

  var diaries: List.List<Diary> = List.nil<Diary>();

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

}