import { Request, Response } from "express";

import { prisma } from "@/helpers";

/**
 * Takes in user's discord user id, public key and nft's mint address and stores it in the database
 */
const storeMintAddress = async (req: Request, res: Response) => {
  const { user, public_key, mint_address } = req.body;

  if (!(user || public_key || mint_address)) {
    return res.status(400).json({
      message: "Missing required parameters",
    });
  }

  try {
    await prisma.nft.create({
      data: {
        user,
        public_key,
        mint_address,
      },
    });

    return res.status(200).json({
      message: "Successfully stored the information in database",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { storeMintAddress };
