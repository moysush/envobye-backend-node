// src/models/Contact.ts
import mongoose, { InferSchemaType, Schema } from "mongoose";

const ContactSchema: Schema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    is_favorite: {
      type: Boolean,
      default: false,
    },
    personal_note: {
      type: String,
      default: null,
    },
    user_id: {
      type: String,
      required: [true, "User ID is required to associate the contact"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export type IContact = InferSchemaType<typeof ContactSchema>;

export default mongoose.model<IContact>("Contact", ContactSchema);
