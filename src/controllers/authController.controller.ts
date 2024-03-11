import { Request, Response } from "express";
import { rmSync } from "fs";
import * as jwt from "jsonwebtoken";
const { User } = require("@schemas/users");
const bcrypt = require("bcrypt");
const random = require("randomstring");
const moment = require("moment");
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
        // if (user.changePassword === false) {
        //   return res.status(401).send({ message: "Xin vui lòng đổi mật khẩu" });
        // }
        const token = jwt.sign(
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
        user.lock.lockWrongPassword = 0;
        user.lock.lockCount = 0;
        await user.save();
        return res.status(200).send({
          accessToken: token,
        });
      }
      if (moment(user.lock.date).valueOf() > moment(new Date()).valueOf()) {
        return res.status(401).send({
          message:
            "Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút",
        });
      }

      if (user.status === UserStatus.Locked) {
        return res.status(401).send({
          message:
            "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ",
        });
      }

      if (user.lock.lockWrongPassword === 3 && user.lock.lockCount === 1) {
        user.status = UserStatus.Locked;
        await user.save();
        return res.status(401).send({
          message:
            "Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ",
        });
      }
      if (user.lock.lockWrongPassword === 3) {
        user.lock.lockCount = 1;
        user.lock.lockWrongPassword = 0;
        user.lock.date = moment(user.lock.date).add(1, "minutes").toDate();
        await user.save();
        return res.status(401).send({
          message:
            "Tài khoản hiện đang bị tạm khóa, vui lòng thử lại sau 1 phút",
        });
      }
      user.lock.lockWrongPassword += 1;

      await user.save();
      return res.status(401).send({ message: "Mật khẩu không chính xác" });
    }
    return res.status(401).send({ message: "Tài khoản không hợp lệ" });
  } catch (error) {}
}

async function create(req: Request, res: Response) {
  const { phone, email, name, dateOfBirth, address } = req.body;
  // username là một dãy gồm 10 chữ số từ 0-9,
  // password chuỗi bất kỳ gồm 6 ký tự.'
  const username = random.generate({
    length: 10,
    charset: "numeric",
  });
  const password = random.generate({
    length: 6,
    charset: "hex",
  });

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  const hashPassword = await bcrypt.hashSync(password.toString(), salt);
  try {
    await User.create({
      phone,
      email,
      name,
      dateOfBirth: new Date(dateOfBirth),
      address,
      username,
      password: hashPassword,
      role: UserRole.User,
      changePassword: true,
      status: UserStatus.Unactive,
      currentbudget: 0,
    });
    const mailOptions = {
      from: "Bbinhtony@gmail.com",
      to: email,
      subject: `Tài khoảng của bạn`,
      html: `
        <div style="padding: 10px; background-color: white;">
            <h4 style="color: #0085ff">Cảm ơn bạn đã sử dụng ví điện tử</h4>
            <span style="color: black">Đây là username và password của bạn</span>
            <p style="color: black">username: ${username} </p>
            <p style="color: black">password: ${password}</p>
        </div>
      `,
    };
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

    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      return res.status(200).send({
        username,
        password,
        token,
      });
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
    email,
    phone,
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
            <h4 style="color: #0085ff">Cảm ơn bạn đã sử dụng ví điện tử</h4>
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
  const { email, phone, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    phone,
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
