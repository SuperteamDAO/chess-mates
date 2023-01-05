import * as anchor from "@project-serum/anchor";
import { findReference, FindReferenceError } from "@solana/pay";

import { rpcUrls } from "@/constants";
import { ScanMetadata } from "../types/scan";

export class VerifyTransaction {
  static gasless = async (
    data: any,
    reference: string,
    confirmedScans: ScanMetadata[],
    failedScans: ScanMetadata[],
    network: string
  ) => {
    return await Promise.all(
      data.map(async (scan: any) => {
        const connection = new anchor.web3.Connection(rpcUrls.get(network)!);
        const referencee = new anchor.web3.PublicKey(reference);
        try {
          const sigInfo = await findReference(connection, referencee, {
            finality: "confirmed",
          });

          if (sigInfo.signature) {
            scan.status = "confirmed";
            confirmedScans.push(scan);
          } else {
            scan.status = "failed";
            failedScans.push(scan);
          }
        } catch (e) {
          if (e instanceof FindReferenceError) {
            return;
          }
        }
      })
    );
  };
}
