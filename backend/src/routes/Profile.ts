import express from "express";
import controller from "../controllers/Profile";
import { Schemas, validateSchema } from "../middlewares/ValidateSchema";

const router = express.Router();

router.post(
  "/create",
  validateSchema(Schemas.profile.create),
  controller.createProfile
);
router.get("/get/:profileId", controller.readProfile);
router.get("/get", controller.readAllProfile);
router.patch(
  "/update/:profileId",
  validateSchema(Schemas.profile.create),
  controller.updateProfile
);
router.delete("/delete/:profileId", controller.deleteProfile);

/** s3 image */
router.get("/s3Url", controller.getS3Url);
router.delete("/s3delete/:key", controller.deleteS3Url);

export = router;
