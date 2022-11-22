import mongoose, { Document, Schema } from "mongoose";

export interface IProfile {
  picUrl: string;
  name: string;
  email: string;
  phone: string;
}

export interface IProfileModel extends IProfile, Document {}

const ProfileSchema: Schema = new Schema(
  {
    picUrl: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProfileModel>(`Profile`, ProfileSchema);
