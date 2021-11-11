import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: `2d`,
    }
  );
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).json({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).json({ message: "No Authorization Token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "You are Unauthorized for this action" });
  }
};

const comparePassword = async (userPassword, password) => {
  return userPassword === (await hashPassword(password));
};

const hashPassword = async (password) => {
  let config = {
    salt: process.env.SALT,
    iterations: 1000,
  };
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      config.salt,
      config.iterations,
      32,
      "sha512",
      (err, derivedKey) =>
        err ? reject(err) : resolve(derivedKey.toString("hex"))
    );
  });
};

function emailData(token) {
  return {
    from: "noreply@gmail.com",
    to: email,
    subject: "Account Activaton Link",
    html: `
            <h2>Please click on given link to activate account</h2>
            <a href="${process.env.CLIENT_URL}/authentication/activate/${token}">
            ${process.env.CLIENT_URL}/authentication/activate/${token}</a>
        `,
  };
}

export {
  hashPassword,
  comparePassword,
  generateToken,
  isAuth,
  emailData,
  isAdmin,
};
