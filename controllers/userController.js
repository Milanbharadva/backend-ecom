const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    createdAt: { type: Date, expires: "5m", default: Date.now },
  },
  { collection: "Otps" }
);

const OTP = mongoose.model("Otp", otpSchema);

const createUser = async (req, res) => {
  try {
    const {
      user_id,
      username,
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      gender,
      role,
      status,
      address,
    } = req.body;

    //   const otp = otpGenerator.generate(6, {
    //     digits: true,
    //     alphabets: false,
    //     upperCase: false,
    //     specialChars: false,
    //   });
    //   await OTP.create({ email, otp });

    //   const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //       user: "milanbharadva1@gmail.com",
    //       pass: "xfvn wkxb fmdb mfug",
    //     },
    //   });

    //   await transporter.sendMail({
    //     from: "milanbharadva1@gmail.com",
    //     to: email,
    //     subject: "OTP Verification",
    //     text: `Your OTP for verification is: ${otp}`,
    //   });
    //  return res.status(200).send(`OTP sent successfully ${otp}`);

    const missingFields = [];
    if (!username) missingFields.push("Username");
    // if (!email) missingFields.push("Email");
    // if (!password_hash) missingFields.push("Password");
    // if (!first_name) missingFields.push("First Name");
    // if (!last_name) missingFields.push("Last Name");
    // if (!phone_number) missingFields.push("Phone Number");
    // if (!gender) missingFields.push("Gender");
    // if (!role) missingFields.push("Role");
    // if (!status) missingFields.push("Status");
    // if (
    //   !address ||
    //   !address.street ||
    //   !address.city ||
    //   !address.postal_code ||
    //   !address.country
    // ) {
    //   missingFields.push("Complete Address");
    // }

    if (missingFields.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        responseType: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required.`,
        data: {},
      });
    }

    const user = await User.create({
      user_id,
      username,
      email,
      password_hash,
      first_name,
      last_name,
      phone_number,
      gender,
      role,
      status,
      address,
    });

    res.status(201).json({
      statusCode: 201,
      responseType: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      responseType: false,
      message: error.message || "Internal Server Error",
      data: {},
    });
  }
};

const generateOTP = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        data: false,
        message: "Email is required",
      });
    }
    await OTP.deleteMany({ email });

    function generateNumericOTP(length) {
      let otp = "";
      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      return otp;
    }

    const otp = generateNumericOTP(6);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "milanbharadva1@gmail.com",
        pass: "xfvn wkxb fmdb mfug",
      },
    });

    await transporter.sendMail({
      from: "milanbharadva1@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
    });

    await OTP.create({ email, otp });

    return res.status(200).json({
      data: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      responseType: false,
      message: error.message || "Internal Server Error",
      data: {},
    });
  }
};

const jwt = require("jsonwebtoken");

const authenticUser = async (req, res) => {
  try {
    const { email, otp } = req.query;

    const missingFields = [];
    if (!email) missingFields.push("Email");
    if (!otp) missingFields.push("OTP");

    if (missingFields.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        responseType: false,
        message: `${missingFields.join(", ")} ${
          missingFields.length > 1 ? "are" : "is"
        } required.`,
        data: {},
      });
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        statusCode: 400,
        responseType: false,
        message: "Invalid or expired OTP.",
        data: {},
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: `User_${Date.now()}`,
      });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, "milan", {
      expiresIn: "1h",
    });

    user.token = token;
    await user.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(201).json({
      statusCode: 201,
      responseType: true,
      message: "User authenticated successfully.",
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      responseType: false,
      message: error.message || "Internal Server Error",
      data: {},
    });
  }
};

module.exports = { createUser, generateOTP, authenticUser };
