import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Gm {
  @Slash({
    description: "gm fren!",
    name: "gm",
  })
  async gm(interaction: CommandInteraction): Promise<void> {
    interaction.reply("gm!");
  }
}
