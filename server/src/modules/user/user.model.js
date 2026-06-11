import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";


// ─── User Schema ───────────────────────────────────────────────────────────
const userSchema = new Schema(
  {
    // Display name shown across the platform
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [60, "Name cannot exceed 60 characters"],
    },

    // Unique login identifier – stored in lowercase
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    // bcrypt hash – never returned in query results (select: false)
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    // Optional profile picture URL
    avatar: {
      type: String,
      default: null,
    },

    // Platform role that drives route-level access control
    role: {
      type: String,
      enum: ["ADMIN", "SCORER", "USER"],
      default: "USER",
    },

    // Soft-delete flag – excluded from all queries via the pre hook below
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ─── Pre-save: hash password ───────────────────────────────────────────────
// Runs only when the password field has actually changed.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: compare candidate password with stored hash ──────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};



export default model("User", userSchema);
