import { Request, Response } from "express";

import { prisma } from "@/helpers";

export const fetchAllMintAddresses = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.nft.findMany({
      select: {
        id: false,
        mint_address: true,
        public_key: true,
        user: true,
      },
    });

    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err,
    });
  }
};
