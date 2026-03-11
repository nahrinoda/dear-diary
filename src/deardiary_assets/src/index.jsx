import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import '../assets/styles.css';
import { AuthClient } from "@icp-sdk/auth/client";
import { HttpAgent } from "@icp-sdk/core/agent";

const init = async () => {
  const authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: () => {
        handleAuthenticated(authClient);
      }
    });
  }
};

async function handleAuthenticated(authClient) {
  const identity = authClient.getIdentity();
  const principal = identity.getPrincipal();

  const host = process.env.DFX_NETWORK === "ic"
    ? "https://icp-api.io"
    : "http://localhost:8000";

  const isLocal = process.env.DFX_NETWORK !== "ic";

  const agent = new HttpAgent({
    identity,
    host,
    // Disable query signature verification in local dev.
    // Local replica keys change on every restart, making cert verification
    // unreliable. This has no security impact on localhost.
    ...(isLocal && { verifyQuerySignatures: false }),
  });

  if (isLocal) {
    await agent.fetchRootKey();
  }

  ReactDOM.render(
    <App identity={identity} principal={principal} agent={agent} />,
    document.getElementById("root")
  );
}

init();
