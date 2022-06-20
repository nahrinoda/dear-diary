# deardiary

Welcome to **Dear Diary** project and to the internet computer development community. This application is not deployed yet and you might want to run it locally.


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
dfx deploy

# start a development server with
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 8000.
