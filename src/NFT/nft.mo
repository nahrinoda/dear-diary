import Principal "mo:base/Principal";

persistent actor class NFT (name: Text, owner: Principal, content: Text, coverImage: [Nat8]) = this {

    // Fields initialized from constructor parameters cannot be stable in Motoko.
    // Marked transient explicitly, as required by Motoko 0.11+.
    // NOTE: nftOwner changes via transferOwnership. If this canister is ever
    // upgraded, ownership state would reset. A future stage should address this
    // by persisting owner via a stable var + postupgrade hook.
    transient let diaryLabel = name;
    transient var nftOwner = owner;
    transient let diaryContent = content;
    transient let imageBytes = coverImage;

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
