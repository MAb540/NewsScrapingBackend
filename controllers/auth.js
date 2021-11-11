import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";

import {
  hashPassword,
  comparePassword,
  generateToken,
  emailData,
} from "../utils/helpers.js";

const DOMAIN = "sandbox665ffd3e07fb4fbb95da0a02aa91f502.mailgun.org";
const API_KEY = "ee8c77459a6d42371a5b8f4c78d80edd-24e2ac64-098b0e44";
const mg = mailgun({
  apiKey: process.env.MAINGUN_API_KEY || API_KEY,
  domain: process.env.DOMAIN || DOMAIN,
});

const signup = async (req, res, next) => {
  console.log(req.body);

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    const data = emailData(token);
    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      res
        .status(200)
        .json({ message: "Email has been sent, kindly activte your account" });
    });
  } catch (err) {
    next(err);
  }
};

const activateAccount = (req, res, next) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decodedToken) {
        if (err) {
          return res.status(400).json({ error: "Incorrect or Expired token" });
        }
        const { name, email, password } = decodedToken;

        try {
          const user = await User.findOne({ email });
          if (user) {
            return res
              .status(400)
              .json({ error: "This email is already registered" });
          }

          try {
            let newUser = new User({
              name,
              email,
              password: await hashPassword(password),
            });
            let userCreated = await newUser.save();

            res.status(201).json({
              message: "Signup Success",
              token: generateToken(userCreated),
            });
          } catch (err) {
            console.log("Error in saving user");
            next(err);
          }
        } catch (err) {
          next(err);
        }
      }
    );
  }
};

const login = async (req, res, next) => {
  console.log(req.body);

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    if (!user || !(await comparePassword(user.password, password))) {
      return res.status(409).json({ error: "Invalid Email or Password" });
    }

    res.status(200).json({
      message: "login Success",
      token: generateToken(user),
      username: user.name,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export { signup, activateAccount, login };
