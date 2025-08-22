import User from "./../models/User.js";
import { signToken } from "./../utils/jwt.js";
import { successResponse, apiResponse } from './../utils/apiResponse.js'
import { sendCookies, clearCookie } from '../utils/Cookies.js'
import { doHash, doHashValidation, hmacHash } from './../utils/hashing.js';



export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('already');
    throw { message: "User already exists", statusCode: 409 };
  }
  // hach pass :
  const hashedPassword = await doHash(password);
  const user = await User.create(
    {
      name,
      email,
      password: hashedPassword
    }
  );
  user.password = undefined;
  return successResponse(res, 201, user, "user created");

};


export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email }).select("+password");

  if (!existingUser) {
    throw { statusCode: 404, message: "user not exist" }
  }

  const result = doHashValidation(password, existingUser.password);

  if (!result) {
    throw { statusCode: 401, message: "Invalid credentials!" }
  }


  // jwt work :
  const jwtToken = signToken(
    {
      name: existingUser.name,
      email: existingUser.email,
      verified: existingUser.verified,

    }, 2);



  // send cookies :
  sendCookies(res, {
    name: "Authorization",
    value: "Bearer " + jwtToken,
    options: {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      // path: '/auth'
       path: '/api/auth'
    }
  });


  return successResponse(res, 201, { token: jwtToken, }, "login created");

};



export const logoutController = (req, res) => {
  clearCookie(res, "Authorization");
  return successResponse(res, 200, req.cookies, "logged out successfully");
};