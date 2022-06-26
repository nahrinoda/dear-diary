import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: Text) = this {

    private let diaryLabel = name;
    private var nftOwner = owner;
    private let diaryContent = content;

    public query func getLabel() : async Text {
        return diaryLabel;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getContent() : async Text {
        return diaryContent;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
        if (msg.caller == nftOwner) {
            nftOwner := newOwner;
            return "Success";
        } else {
            return "Error: Not initiated by owner."
        };
    };

};