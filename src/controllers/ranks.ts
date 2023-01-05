import { Request, Response } from "express";

import { prisma } from "@/helpers";

/**
 * Returns level ranks of an specific user
 */
const ranks = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    const data = await prisma.users.findFirst({
      where: {
        user: id as string,
      },
    });

    return res.status(200).json({
      metadata: data,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { ranks };
