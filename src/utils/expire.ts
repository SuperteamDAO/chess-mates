import dotenv from "dotenv";
import * as anchor from "@project-serum/anchor";
import { findReference, FindReferenceError } from "@solana/pay";
import { rpcUrls } from "@/constants";
dotenv.config();
const isExpired = async (
  network: string,
  reference: string
) => {
  const confirmedScans = [];
  const failedScans = [];

  // await VerifyTransaction.gasless(scans, reference, confirmedScans, failedScans, network);

  const connection = new anchor.web3.Connection(rpcUrls.get(network)!);
  const referencee = new anchor.web3.PublicKey(reference);
  try {
    const sigInfo = await findReference(connection, referencee, {
      finality: "confirmed",
    });

    if (sigInfo.signature) {
      confirmedScans.push('success');
    } else {
      failedScans.push('fail');
    }
  } catch (e) {
    if (e instanceof FindReferenceError) {
      return;
    }
  }

  if (confirmedScans.length < 1) {
    return false;
  } else {
    return true;
  }
};

export { isExpired };
