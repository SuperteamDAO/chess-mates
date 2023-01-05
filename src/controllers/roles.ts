import { Request, Response } from "express";
import { bot } from "@/services/bot";

/**
 * Returns all roles of an specific user
 */
const roles = async (req: Request, res: Response) => {
  const { guild, user, role } = req.body;

  try {
    bot.guilds.fetch(guild).then((guild) => {
      guild.members
        .fetch(user)
        .then((user) => {
          if (!user) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          if (user.roles.cache.has(role)) {
            return res.status(200).json({
              message: "User found and has the required role",
              user: user,
            });
          } else {
            return res.status(200).json({
              message: "User found but missing the required role",
              user: [],
            });
          }
        })
        .catch((_err) => {
          return res.status(404).json({
            message: "User not found",
          });
        });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

export { roles };
