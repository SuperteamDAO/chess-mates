import { Request, Response } from "express";

import { prisma } from "@/helpers";

export const canMint = async (req: Request, res: Response) => {
  const { user } = req.query;

  try {
    const data = await prisma.nft.findFirst({
      where: {
        user: user as string,
      },
    });

    if (data) {
      return res.status(400).json({
        message: "The user has already minted 1 NFT",
      });
    } else {
      return res.status(200).json({
        message: "The user haven't minted any NFT yet",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
