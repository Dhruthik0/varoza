const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = async (emailInput = "") => {
  const normalizedEmail = String(emailInput).toLowerCase().trim();
  if (!normalizedEmail) return null;

  let user = await User.findOne({ email: normalizedEmail });
  if (user) return user;

  // Fallback for legacy rows that may have mixed-case emails
  user = await User.findOne({
    email: {
      $regex: `^${escapeRegex(normalizedEmail)}$`,
      $options: "i"
    }
  });

  return user;
};

const getSignedAuthPayload = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    role: user.role,
    name: user.name,
    email: user.email
  };
};

const verifyGoogleCredential = async (credential) => {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      credential
    )}`
  );

  if (!response.ok) {
    throw new Error("Invalid Google token");
  }

  return response.json();
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || "").toLowerCase().trim();

    if (!name || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const userExists = await findUserByEmail(normalizedEmail);
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        authProvider: "local"
      });
    } catch (createError) {
      // Legacy local users may have googleId: null, which can collide with unique index.
      if (createError?.code === 11000 && createError?.keyPattern?.googleId) {
        await User.updateMany(
          { authProvider: "local", googleId: null },
          { $unset: { googleId: 1 } }
        );

        await User.create({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
          authProvider: "local"
        });
      } else {
        throw createError;
      }
    }

    res.status(201).json({
      message: "User registered successfully"
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = String(email || "").toLowerCase().trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(normalizedEmail);
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        message: "This account uses Google login. Continue with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const requestedRole = role === "seller" ? "seller" : role === "buyer" ? "buyer" : null;
    if (requestedRole && user.role !== "admin" && user.role !== requestedRole) {
      return res.status(403).json({
        message: `This account is registered as ${user.role}. Please choose Login as ${user.role}.`
      });
    }

    res.json(getSignedAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GOOGLE SIGNUP / LOGIN
exports.googleAuth = async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res
        .status(500)
        .json({ message: "Server missing GOOGLE_CLIENT_ID configuration" });
    }

    const googleData = await verifyGoogleCredential(credential);

    if (googleData.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Google token audience mismatch" });
    }

    if (googleData.email_verified !== "true") {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    const normalizedEmail = String(googleData.email || "")
      .toLowerCase()
      .trim();

    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ message: "Google account did not return an email" });
    }

    let user = await findUserByEmail(normalizedEmail);
    const requestedRole = role === "seller" ? "seller" : "buyer";

    if (!user) {
      user = await User.create({
        name:
          googleData.name ||
          googleData.given_name ||
          normalizedEmail.split("@")[0],
        email: normalizedEmail,
        role: requestedRole,
        authProvider: "google",
        googleId: googleData.sub
      });
    } else {
      if (user.role !== "admin" && user.role !== requestedRole) {
        return res.status(403).json({
          message: `This account is registered as ${user.role}. Please continue as ${user.role}.`
        });
      }

      if (user.authProvider !== "google" && !user.googleId) {
        return res.status(409).json({
          message:
            "Account already exists with password login. Please login with email/password."
        });
      }

      user.authProvider = "google";
      user.googleId = googleData.sub;
      if (!user.name && googleData.name) {
        user.name = googleData.name;
      }
      await user.save();
    }

    res.json(getSignedAuthPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
