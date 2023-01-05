import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import base58 from "bs58";

import { rpcUrls } from "@/constants";

dotenv.config();

const connection = new Connection(rpcUrls.get("mainnet")!);
const payer = Keypair.fromSecretKey(
  base58.decode(process.env.PAYER_SECRET_KEY!)!
);
const metaplex = Metaplex.make(connection).use(keypairIdentity(payer));

export { metaplex };
