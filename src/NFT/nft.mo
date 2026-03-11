import Principal "mo:base/Principal";

persistent actor class NFT (name: Text, owner: Principal, content: Text, coverImage: [Nat8]) = this {

    // Stable vars survive canister upgrades — ownership and content are never lost.
    stable var diaryLabel : Text = name;
    stable var nftOwner : Principal = owner;
    stable let diaryContent : Text = content;
    stable let imageBytes : [Nat8] = coverImage;

    public query func getLabel() : async Text {
        return diaryLabel;
    };

    public query func getOwner() : async Principal {
        return nftOwner;
    };

    public query func getContent() : async Text {
        return diaryContent;
    };

    public query func getCoverImage() : async [Nat8] {
        return imageBytes;
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
