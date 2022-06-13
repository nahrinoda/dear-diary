import List "mo:base/List";
import Debug "mo:base/Debug";

actor DDiary {

  public type Diary = {
    title: Text;
    content: Text;
  };

  var diaries: List.List<Diary> = List.nil<Diary>();

  public func createDiary(titleText: Text, contentText: Text) {
    let newDiary: Diary = {
      title = titleText;
      content = contentText;
    };

    diaries := List.push(newDiary, diaries);
    Debug.print(debug_show(diaries));

  };

}