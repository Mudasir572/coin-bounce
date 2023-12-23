const JWTService = require("../services/JWTService");
const User = require("../models/user");
const userDto = require("../dto/user");
const UserDto = require("../dto/user");

const auth = async (req, res, next) => {
  //1. refresh and access token validation
  try {
    const { refreshToken, accessToken } = req.cookies;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "unauthorized",
      };
      return next(error);
    }

    let _id;
    try {
      _id = JWTService.varifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }
    let user;
    try {
      user = await User.findOne({ _id: _id });
    } catch (error) {
      return next(error);
    }

    const userDto = new UserDto(user);

    req.user = userDto;

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
