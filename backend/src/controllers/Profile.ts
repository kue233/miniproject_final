import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { generateUploadURL, deletePicUrl } from "../library/s3";
import Profile from "../models/Profile";

const createProfile = (req: Request, res: Response, next: NextFunction) => {
  const {
    _id = new mongoose.Types.ObjectId().toString(),
    picUrl,
    name,
    email,
    phone,
  } = req.body;
  const profile = new Profile({
    _id,
    picUrl,
    name,
    email,
    phone,
  });
  return profile
    .save()
    .then((prof) => res.status(201).json({ prof }))
    .catch((e) => res.status(500).json(e));
};

const readProfile = (req: Request, res: Response, next: NextFunction) => {
  const profileId = req.params.profileId;

  return Profile.findById(profileId)
    .then((profile) =>
      profile
        ? res.status(200).json({ profile })
        : res.status(404).json({ message: "profile not found" })
    )
    .catch((error) => res.status(500).json({ error }));
};

const readAllProfile = (req: Request, res: Response, next: NextFunction) => {
  return Profile.find()
    .then((profiles) => res.status(201).json({ profiles }))
    .catch((e) => res.status(500).json(e));
};

const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const profileId = req.params.profileId;

  return Profile.findById(profileId)
    .then((profile) => {
      if (profile) {
        profile.set(req.body);
        return profile
          .save()
          .then((profile) => res.status(201).json({ profile }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: "not profile found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteProfile = (req: Request, res: Response, next: NextFunction) => {
  const profileId = req.params.profileId;

  return Profile.findByIdAndDelete(profileId).then((profile) =>
    profile
      ? res.status(201).json({ message: "delete" })
      : res.status(404).json({ message: "not found" })
  );
};

const getS3Url = async (req: Request, res: Response, next: NextFunction) => {
  const url = await generateUploadURL();
  return res.send({ url });
};

const deleteS3Url = async (req: Request, res: Response, next: NextFunction) => {
  await deletePicUrl(req.params.key);
  return res.status(201).json({ message: "s3 url deleted!" });
};

export default {
  createProfile,
  readProfile,
  readAllProfile,
  updateProfile,
  deleteProfile,
  getS3Url,
  deleteS3Url,
};
