# deardiary

Welcome to **Dear Diary** project and to the internet computer development community. This application is not deployed yet and you might want to run it locally.



https://user-images.githubusercontent.com/32439687/175838012-58fc740d-4be1-40e4-a5c4-e32c6ff3bfc4.mp4



## Running the project locally

You can use the following commands:

```bash
# Clone this repo
git clone https://github.com/nahrinoda/dear-diary.git

# Starts the replica, running in the background
dfx start --background

# Install packages
npm install

# Deploys your canisters to the replica and generates your candid interface
dfx deploy deardiary

# start a development server with
npm start
```

## To Mint NFT canister locally

```
let <YOUR OWN PRINCIPAL> = dfx identity get-principal

dfx deploy --argument='("Khalil Gibran", principal "vwzf7-cgzpz-vmfqd-apotu-qgi6y-swyq6-bfgtq-w2oz6-2fkz4-qcgxd-gqe", "Let there be spaces in your togetherness And let the winds of the heavens dance between you Love one another but make not a bond of love Let it rather be a moving sea between the shores of your souls Fill each other s cup but drink not from one cup Give one another of your bread but eat not from the same loaf Sing and dance together and be joyous but let each one of you be alone Even as the strings of a lute are alone though they quiver with the same music Give your hearts but not into each other s keeping For only the hand of Life can contain your hearts And stand together yet not too near together For the pillars of the temple stand apart And the oak tree and the cypress grow not in each other s shadow", (vec {137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 10; 0; 0; 0; 10; 8; 6; 0; 0; 0; 141; 50; 207; 189; 0; 0; 0; 1; 115; 82; 71; 66; 0; 174; 206; 28; 233; 0; 0; 0; 68; 101; 88; 73; 102; 77; 77; 0; 42; 0; 0; 0; 8; 0; 1; 135; 105; 0; 4; 0; 0; 0; 1; 0; 0; 0; 26; 0; 0; 0; 0; 0; 3; 160; 1; 0; 3; 0; 0; 0; 1; 0; 1; 0; 0; 160; 2; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 160; 3; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 0; 0; 0; 0; 59; 120; 184; 245; 0; 0; 0; 113; 73; 68; 65; 84; 24; 25; 133; 143; 203; 13; 128; 48; 12; 67; 147; 94; 97; 30; 24; 0; 198; 134; 1; 96; 30; 56; 151; 56; 212; 85; 68; 17; 88; 106; 243; 241; 235; 39; 42; 183; 114; 137; 12; 106; 73; 236; 105; 98; 227; 152; 6; 193; 42; 114; 40; 214; 126; 50; 52; 8; 74; 183; 108; 158; 159; 243; 40; 253; 186; 75; 122; 131; 64; 0; 160; 192; 168; 109; 241; 47; 244; 154; 152; 112; 237; 159; 252; 105; 64; 95; 48; 61; 12; 3; 61; 167; 244; 38; 33; 43; 148; 96; 3; 71; 8; 102; 4; 43; 140; 164; 168; 250; 23; 219; 242; 38; 84; 91; 18; 112; 63; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130;}))'

npm start
```

# Creating NFT for Testing

1. Mint an NFT on the command line to get NFT into mapOfNFTs:

```
dfx canister call deardiary mint '("Kahlil Gibran", "I have found both freedom and safety in my madness; the freedom of loneliness and the safety from being understood, for those who understand us enslave something in us")'
```

2. List the item into mapOfListings:

```
dfx canister call deardiary listItem '(principal "rdmx6-jaaaa-aaaaa-aaadq-cai", 2)'
```

3. Get OpenD canister ID:

```
dfx canister id deardiary
```

4. Transfer NFT to OpenD:

```
dfx canister call q3fc5-haaaa-aaaaa-aaahq-cai transferOwnership '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", true)'
```
