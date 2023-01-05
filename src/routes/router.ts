import express, { Router } from "express";

import {
  generate,
  mint,
  roles,
  ranks,
  fetchAllMintAddresses,
  storeMintAddress,
  canMint,
} from "@/controllers";
import { authentication } from "@/middleware";

const router: Router = express.Router();

router.post("/roles", roles);
router.get("/ranks", [authentication], ranks);
router.post("/generate", [authentication], generate);
router.all("/mint", mint);
router.get("/mint-addresses", [authentication], fetchAllMintAddresses);

router.post("/utils/mint-address", [authentication], storeMintAddress);
router.get("/utils/can-mint", [authentication], canMint);

export default router;
