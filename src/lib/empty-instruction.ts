import * as anchor from "@project-serum/anchor";
import base58 from "bs58";
import dotenv from "dotenv";

import { prisma } from "@/helpers";
import { rpcUrls } from "@/constants";

dotenv.config();

const emptyInstruction = async (id: string) => {
  const metadata = await prisma.qrCodes.findFirst({
    where: {
      qr_code_id: id,
    },
  });
  const connection = new anchor.web3.Connection(
    rpcUrls.get(metadata!.network)!
  );
  const dummy = anchor.web3.Keypair.fromSecretKey(
    base58.decode(process.env.DUMMY_KEYPAIR!)
  );

  const greetedPubkey = await anchor.web3.PublicKey.createWithSeed(
    dummy.publicKey,
    "CandyPay",
    anchor.web3.SystemProgram.programId
  );

  const space = 0;

  const rentExemptionAmount =
    await connection.getMinimumBalanceForRentExemption(space);

  const { blockhash } = await connection.getLatestBlockhash("finalized");
  const transaction = new anchor.web3.Transaction({
    recentBlockhash: blockhash,
    feePayer: dummy.publicKey,
  });

  transaction.partialSign(dummy);

  transaction.add(
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: dummy.publicKey,
      newAccountPubkey: greetedPubkey,
      lamports: rentExemptionAmount,
      space,
      programId: anchor.web3.SystemProgram.programId,
    })
  );

  const serializedTransaction = transaction.serialize({
    requireAllSignatures: false,
  });
  const base64 = serializedTransaction.toString("base64");

  return base64;
};

export { emptyInstruction };
