import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js";
import userManagemntValidator from "../schema/userManagementValidator.js";
import calculateAge from "../utils/calculateAge.js";

import {STATUS_CODE} from '../utils/httpStatusCode.js'


import dotenv from "dotenv";
import catchAsync from "../utils/catchAsync.js";
dotenv.config();

export const test = (req, res) => {
  res.status(200).json({
    message: "Api route is working",
  });
};

// Update user
export const updateUser = catchAsync(async (req, res, next) => {

  const { name, email } = req?.body;

  const errorInValidation = userManagemntValidator("updateUser", req.body);

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

    if (req.user.userId !== req?.params?.id) {
    return next(
      new ErrorResponse("user.only_update_own_account", 401)
    );
  }

      let user = await User.findById(req.user.userId);

    if (!user) {
      return next(new ErrorResponse("user.not_found", 404));
    }


  const profileImage = req.file ? req.file.filename : null; // Handle profile image update if provided


  
    // Update fields

    if (name ) {
      user.name = name;
    }

    if (email) {
      email
    }
    user.avatar = profileImage
      ? process.env.BASE_URL + `/uploads/${profileImage}`
      : user.avatar;


    await user.save();
    const { password: pwd, ...userData } = user._doc;

    const age = calculateAge(user.birthDate);

    res.status(200).json({
      data: {...userData, age},
      status: STATUS_CODE.SUCCESS,
      message: req.t('use.updated'),
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (req.user.userId !== req.params.id && !user.isAdmin)
      return next(
        new ErrorResponse("user.only_delete_own_account", 401)
      );

      if(user?.isAdmin && !user?.approved) {
        return next(new ErrorResponse("user.upproved_first_to_delete", 401));
      }

    await User.findByIdAndDelete(req.params.id);
    if (req.user.userId === req.params.id) {
      res.clearCookie("token");
    }
    res.status(200).json({
      status: STATUS_CODE.SUCCESS,
      message: req.t('user.message'),
    });
});

export const getUser = catchAsync(async (req, res, next) => {

    const {userId} = req.params

    const errorInValidation = userManagemntValidator("idOnly", {userId});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }

    const user = await User.findById(userId);


    if (!user) return next(new ErrorResponse("user.not_found", 404));

    const { password: pass, ...rest } = user._doc;
const age = calculateAge(user.birthDate);

res.status(200).json({ data: {...rest, age,}, status: STATUS_CODE.SUCCESS,
  message: req.t('user.founded') });

});

export const getUsers = catchAsync(async (req, res, next) => {
  console.log("userId in get users ====>", req.user.userId)
    const user = await User.findById(req.user.userId);
    console.log("user in get users ====>", user)
    if (!user?.isAdmin) {
      return next(
        new ErrorResponse("user.not_allowd_to_get_all", 403)
      );
    }

    if(user?.isAdmin && !user?.approved) {
          return next(new ErrorResponse("user.upproved_first_to_get_all", 401));
        }

    const {startIndex, limit, sort} = req.query

    const errorInValidation = userManagemntValidator("getUsers", {startIndex, limit, sort});

  if (errorInValidation !== true) {
    return next(errorInValidation);
  }


    const safe_startIndex = parseInt(startIndex) || 0;
    const safe_limit = parseInt(limit) || 9;
    const safe_sortDirection = sort === "asc" ? 1 : -1;



    const users = await User.find()
      .sort({ createdAt: safe_sortDirection })
      .skip(safe_startIndex)
      .limit(safe_limit);

      const data = users.map((user) => {
        const { password, ...rest } = user._doc;
        const age = calculateAge(user.birthDate);
        return { ...rest, age };
      });
      

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      data,
      status: STATUS_CODE.SUCCESS,
      message: req.t('user.all_users'),
      totalUsers,
      lastMonthUsers,
    });
});

export const searchUser = catchAsync(async (req, res, next) => {
    const { search } = req.body;

    const query = new RegExp(search, "i", "g");

    const user = await User.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    const data = user.map((user) => {
      const userObj = user._doc;
      const age = calculateAge(user.birthDate);
      return { ...userObj, age };
    });

    return res.json({
      data,
      status: STATUS_CODE.SUCCESS,
      message: req.t('user.founded'),
    });

});

export const userDetails = catchAsync(async (req, res) => {

    const token = req.cookies["token"] || "";

    const user = await getUserDetailsFromToken(token);
    // console.log("token", token);
    const age = calculateAge(user.birthDate);

    return res.status(200).json({
      data: {...user, age},
      status: STATUS_CODE.SUCCESS,
      message: "user founded successfully",
    });
  });



