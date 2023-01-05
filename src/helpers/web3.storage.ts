import { Web3Storage } from "web3.storage";
import dotenv from "dotenv";

dotenv.config();

export const web3Storage = new Web3Storage({
  token: process.env.WEB3_STORAGE_API_KEY!,
});
