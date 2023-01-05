import { Request, Response } from "express";
import { TransactionRequestURLFields, encodeURL } from "@solana/pay";
import nanoid from "nanoid";
import dotenv from "dotenv";

import { prisma } from "@/helpers";

dotenv.config();

/**
 * Generate a QR code to mint the NFT
 */
const generate = async (req: Request, res: Response) => {
  const { user, name, symbol, uri, label, icon, network, reference } = req.body;

  try {
    const id = nanoid();

    const transactionRequestURLFields: TransactionRequestURLFields = {
      link: new URL(`${process.env.STATIC_URL}/api/v1/mint?id=${id}`),
    };

    await prisma.qrCodes.create({
      data: {
        qr_code_id: id,
        user,
        reference,
        name,
        symbol,
        uri,
        label,
        icon,
        network,
        solana_url: encodeURL(transactionRequestURLFields).toString(),
      },
    });

    return res.status(200).json({
      message: `Successfully generated a QR code`,
      metadata: {
        qr_code_id: id,
        solana_url: transactionRequestURLFields.link.toString(),
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { generate };
