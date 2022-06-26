# deardiary

Welcome to **Dear Diary** project and to the internet computer development community. This application is not deployed yet and you might want to run it locally.



## Running the project locally

https://user-images.githubusercontent.com/32439687/175837709-9519a4d2-3483-4958-ad04-b20cafeba0a7.mp4


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
