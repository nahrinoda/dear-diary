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

dfx deploy --argument='("On a summer day!", principal "<YOUR OWN PRINCIPAL>", "Lorem Ipsum is simply dummy text of the printing and typesetting industry.")'

npm start
```
