import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
const { User } = require("@schemas/users");
const bcrypt = require("bcrypt");

const { UserRole, UserStatus } = require("../utils/enum/user");
const nodemailer = require("nodemailer");
const { generateOTP } = require("../utils/otp/otp");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d35bf6c3042f21",
    pass: "fdaaa0437401a0",
  },
  tls: { rejectUnauthorized: false },
  secure: false,
});

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const token = await jwt.sign(
          {
            role: user.role,
            username: user.username,
            id: user._id,
            changePassword: user.changePassword,
            status: user.status,
          },
          process.env.SECRET,
          { expiresIn: 24 * 60 * 60 }
        );

        await user.save();
        return res.status(200).send({
          accessToken: token,
        });
      }
    }

    return res.status(401).send({ message: "This account is invalid" });
  } catch (error) {
    throw error;
  }
}

async function create(req: Request, res: Response) {
  const { phone, email, name, address, password, username } = req.body;

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashPassword = await bcrypt.hashSync(password.toString(), salt);
  try {
    await User.create({
      phone,
      email: email.toLowerCase(),
      name,
      address,
      username,
      password: hashPassword,
      role: UserRole.User,
      changePassword: true,
      status: UserStatus.Unactive,
      currentbudget: 0,
    });

    const token = jwt.sign(
      {
        role: UserRole.User,
        username: username,
        // id: user._id,
        changePassword: true,
      },
      process.env.SECRET,
      { expiresIn: 24 * 60 * 60 }
    );

    return res.status(200).send({
      accessToken: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(409).send({ message: "Tài khoản đã tồn tại" });
  }
}

async function changePassword(req: Request, res: Response) {
  const { username, password, newPassword } = req.body;
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashPassword = await bcrypt.hashSync(newPassword, salt);
  try {
    const user = await User.findOne({ username });
    if (user) {
      const isValidPassword = await bcrypt.compareSync(password, user.password);
      if (isValidPassword) {
        const token = await jwt.sign(
          {
            role: user.role,
            username,
            id: user._id,
            changePassword: false,
          },
          process.env.SECRET,
          { expiresIn: 24 * 60 * 60 }
        );
        user.password = hashPassword;
        user.changePassword = false;
        await user.save();
        return res.status(200).send({
          message: "Đổi mật khẩu thành công",
          token,
        });
      }
      return res.status(409).send({ message: "Tài khoản không hợp lệ" });
    }
  } catch (error) {
    console.log(error);
    return res.status(409).send({ message: "Tài khoản không hợp lệ" });
  }
}

async function forgotPassword(req: Request, res: Response) {
  const { email, phone } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (user) {
    const otp = generateOTP(6);
    user.phoneOtp = otp;
    await user.save();

    const mailOptions = {
      from: "Bbinhtony@gmail.com",
      to: email,
      subject: `OTP code của số điện thoại ${phone}`,
      html: `
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Cảm ơn bạn đã sử dụng ứng dụng đọc sách</h4>
            <span style="color: black">Đây là otp code bạn :${otp}</span>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      return res.json({
        message: "Email successfully sent.",
      });
    });
  } else {
    return res.status(400).send({ message: "Tài khoảng không tồn tại" });
  }
}

async function verifyForgotPassword(req: Request, res: Response) {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  if (user && user.phoneOtp === otp) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashPassword = await bcrypt.hashSync(newPassword.toString(), salt);
    user.password = hashPassword;
    user.phoneOtp = null;
    await user.save();

    const token = await jwt.sign(
      {
        role: user.role,
        username: user.username,
        id: user._id,
      },
      process.env.SECRET,
      { expiresIn: 24 * 60 * 60 }
    );
    return res.json({
      message: "Đổi mật khẩu thành công",
      accessToken: token,
    });
  }
  return res.status(400).send({ message: "Mã OTP không hợp lệ" });
}

module.exports = {
  login,
  create,
  changePassword,
  forgotPassword,
  verifyForgotPassword,
};

export {};
