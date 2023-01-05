import { Request, Response } from "express";
import * as anchor from "@project-serum/anchor";
import { PublicKey, Connection } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import dotenv from "dotenv";
import { isExpired } from "../utils/expire";
import { prisma } from "@/helpers";
import { PAYER, rpcUrls } from "@/constants";
dotenv.config();

const mint = async (req: Request, res: Response) => {
  const id = req.query.id;
  const { account } = req.body;

  try {
    const metadata = await prisma.qrCodes.findFirst({
      where: {
        qr_code_id: id as string,
      },
    });

    if (!metadata) {
      return res.status(404).json({
        message: "No QR code was found",
      });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        label: metadata.label,
        icon: metadata.icon,
      });
    }

    if (req.method === "POST") {
      if (!account) {
        return res.status(400).json({ error: "No account provided" });
      }

      if (await isExpired(metadata.network, metadata.reference)) {
        return res.status(400).json({ error: "QR Code expired" });
   }

      const connection = new Connection(rpcUrls.get(metadata.network!)!);
      const user = new PublicKey(account);
      const mintKey = anchor.web3.Keypair.generate();
      const metaplex = Metaplex.make(connection).use(keypairIdentity(PAYER));
      const reference = new PublicKey(metadata.reference!);

      const transactionBuilder = await metaplex.nfts().builders().create({
        uri: metadata.uri,
        name: metadata.name,
        symbol: metadata.symbol,
        sellerFeeBasisPoints: 10000,
        useNewMint: mintKey,
        tokenOwner: user,
      });

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const transaction = transactionBuilder.toTransaction({
        blockhash,
        lastValidBlockHeight,
      });

      transaction.instructions[0].keys.push({
        pubkey: user,
        isSigner: true,
        isWritable: false,
      });
      transaction.instructions[0].keys.push({
        pubkey: reference,
        isSigner: false,
        isWritable: false,
      });

      transaction.partialSign(mintKey, PAYER);

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
      });

      const base64 = serializedTransaction.toString("base64");

      return res.status(200).json({
        transaction: base64,
        message: "Powered by CandyPay",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { mint };
