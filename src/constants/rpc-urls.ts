import dotenv from "dotenv";

dotenv.config();

const rpcUrls = new Map<string, string>([
  ["mainnet", process.env.MAINNET_RPC_URL!],
  ["devnet", process.env.DEVNET_RPC_URL!],
]);

export { rpcUrls };
