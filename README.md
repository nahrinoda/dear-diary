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

dfx deploy --argument='("On a summer day!", principal "vwzf7-cgzpz-vmfqd-apotu-qgi6y-swyq6-bfgtq-w2oz6-2fkz4-qcgxd-gqe", "Lorem Ipsum is simply dummy text of the printing and typesetting industry.")'

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
