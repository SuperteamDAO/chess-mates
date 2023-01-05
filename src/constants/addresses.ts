import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const PAYER = Keypair.fromSecretKey(
  base58.decode(process.env.PAYER_SECRET_KEY!)
);

export { TOKEN_METADATA_PROGRAM_ID, PAYER };
