import { PAYER } from "@/constants";

const metadataGenerator = (
  image: string,
  level: string,
  xp: string,
  rank: string
) => {
  return `{
    "name": "Chess Champs",
    "symbol": "CPCP",
    "description": "Chess Mates is a dynamic NFT that represents your reputation in the Chess Champs community on-chain.",
    "seller_fee_basis_points": 10000,
    "image": "${image}",
    "external_url": "https://chesschamps.io",
    "attributes": [
     {
        "trait_type": "powered by",
        "value": "CandyPay"
     },
     {
         "trait_type":"level",
         "value":"${level}"
      },
      {
         "trait_type":"xp",
         "value":"${xp}"
      },
      {
         "trait_type":"rank",
         "value":"${rank}"
      }
    ],
    "collection": { "name": "Chess Mates", "family": "Chess Mates" },
    "properties": {
      "files": [
        {
          "uri": "${image}",
          "type": "image/png"
        }
      ],
      "category": "image",
      "creators": [
        {
          "address": "${PAYER.publicKey.toString()}",
          "share": 100
        }
      ]
    }
  }
  `;
};

export { metadataGenerator };
