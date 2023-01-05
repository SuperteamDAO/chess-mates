import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { Discord, Slash } from "discordx";
import { PublicKey } from "@solana/web3.js";
import { File } from "web3.storage";
import { NoInstructionsToSendError } from "@metaplex-foundation/js";
import axios from "axios";

import {
  prisma,
  metaplex,
  web3Storage,
  addKeyToRedis,
  canRunCommand,
} from "@/helpers";
import { metadataGenerator } from "@/utils";
import { roles, WINNER } from "@/constants";

@Discord()
export class UpdateMetadata {
  @Slash({
    description: "Update metadata of your Chess Mates NFT",
    name: "update-nft",
  })
  async updateMetadata(interaction: CommandInteraction) {
    try {
      const userMetadata = await prisma.users.findFirst({
        where: {
          user: interaction.user.id,
        },
      });
      const nftMetadata = await prisma.nft.findFirst({
        where: {
          user: interaction.user.id,
        },
      });
      const ratelimitCheck = await canRunCommand(interaction.user.id);

      if (!ratelimitCheck) {
        const embed = new EmbedBuilder()
          .setDescription(
            "⚠ You can only update the NFT's metadata every 3 days"
          )
          .setColor("Red");

        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      if (!nftMetadata) {
        const embed = new EmbedBuilder()
          .setDescription("⚠ It seems that you don't have a Chess Mates NFT")
          .setColor("Red");

        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setDescription(
          `👀 Updating the NFT's metadata with the latest stats...`
        )
        .setColor("Green");

      await interaction.reply({
        embeds: [embed],
      });

      const nft = await metaplex
        .nfts()
        .findByMint({
          mintAddress: new PublicKey(nftMetadata?.mint_address!),
        });

      const user = interaction.member as GuildMember;

      if (!user) {
        return;
      }

      const image = await axios.post(`https://ccnfthosted.apxi.io/nft/create`, {
        role:
          userMetadata?.level! > 6 ? "king" : roles.get(userMetadata?.level!),
        rank: String(userMetadata?.rank),
        winner: String(user.roles.cache.has(WINNER)),
      });

      const metadata = metadataGenerator(
        image.data.url,
        String(userMetadata?.level!),
        String(userMetadata?.xp!),
        String(userMetadata?.rank!)
      );

      const cid = await web3Storage.put([
        new File([metadata], "metadata.json", {
          type: "application/json",
        }),
      ]);

      const { response } = await metaplex
        .nfts()
        .update({
          nftOrSft: nft,
          uri: `https://cloudflare-ipfs.com/ipfs/${cid}/metadata.json`,
          name: `Chess Mates`,
          symbol: "CPCP",
        })

      if (response.confirmResponse.value.err) {
        const transactionErrorEmbed = new EmbedBuilder()
          .setDescription(`😿 Transaction failed due to an error!`)
          .setColor("Red");

        return await interaction.channel?.send({
          embeds: [transactionErrorEmbed],
        });
      }

      const transactionSuccessfulEmbed = new EmbedBuilder()
        .setDescription(
          `🥳 Updated the NFT! Check it out at https://solana.fm/address/${nftMetadata?.mint_address}
        
        Transaction signature: https://solana.fm/tx/${response.signature}
        `
        )
        .setColor("Green");

      await addKeyToRedis(interaction.user.id);

      return await interaction.channel?.send({
        embeds: [transactionSuccessfulEmbed],
        content: `<@${interaction.user.id}>`,
      });
    } catch (err) {
      if (err instanceof NoInstructionsToSendError) {
        const embed = new EmbedBuilder().setDescription(
          `<@${interaction.user.id}> Reverting NFT metadata update operation as there isn't any change in the user's level stats`
        );

        return await interaction.channel?.send({
          embeds: [embed],
        });
      }

      console.log(err);

      const embed = new EmbedBuilder()
        .setDescription(
          `<@${interaction.user.id}> An error occurred while trying to update the NFT's metadata`
        )
        .setColor("Red");

      return await interaction.channel?.send({
        embeds: [embed],
      });
    }
  }
}
