import ErrorResponse from "../utils/errorResponse.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

import commentManagementValidator from "../schema/commentManagmentValidator.js";

import {STATUS_CODE} from "../utils/httpStatusCode.js"
import catchAsync from "../utils/catchAsync.js";


export const createComment = catchAsync(async (req, res, next) => {
    const { content, postId } = req.body;

    const userId = req.user.userId

        const errorInValidation = commentManagementValidator("create", req.body);
    
      if (errorInValidation !== true) {
        return next(errorInValidation);
      }


    if (!userId) {
      return next(
        new ErrorResponse("comment.not_allowd_to_create", 403)
      );
    }

    const data = new Comment({
      content,
      postId,
      userId,
    });
    await data.save();

    res.status(200).json({data, 
      status: STATUS_CODE.SUCCESS,
      message: req.t('comment.created'),});
});

export const getPostComments = catchAsync(async (req, res, next) => {

    const {startIndex, limit} = req.query

    const errorInValidation = commentManagementValidator("getPostComments", {startIndex, limit});
    
      if (errorInValidation !== true) {
        return next(errorInValidation);
      }
    
    const safe_startIndex = parseInt(req.query.startIndex) || 0;

    const safe_limit = parseInt(req.query.limit) || 2;

    const data = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .skip(safe_startIndex)
      .limit(safe_limit);

    return res.status(200).json({data, status: STATUS_CODE.SUCCESS,
      message: req.t('comment.all_comments'),});
});

export const likeComment = catchAsync(async (req, res, next) => {
    const data = await Comment.findById(req.params.id);
    if (!data) {
      return next(new ErrorResponse("comment.not_found", 404));
    }
    const userIndex = data.likes.indexOf(req.user.userId);
    if (userIndex === -1) {
      data.numberOfLikes += 1;
      data.likes.push(req.user.userId);
    } else {
      data.numberOfLikes -= 1;
      data.likes.splice(userIndex, 1);
    }
    await data.save();
    res.status(200).json({
      data,
      status: STATUS_CODE.SUCCESS,
      message: req.t('comment.liked_successfully'),
    });
});

export const editComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(new ErrorResponse("comment.not_found", 404));
    }
    const userIn = await User.findById(req.user.userId)

    if (comment.userId !== req.user.userId && !userIn.isAdmin) {
      return next(
        new ErrorResponse("comment.not_allowd_to_edit", 403)
      );
    }

    if(userIn?.isAdmin && !userIn?.approved) {
        return next(new ErrorResponse("comment.upproved_first_to_edit", 401));
      }

    const data = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json({
      data,
      status: STATUS_CODE.SUCCESS,
        message: req.t('comment.edited'),
    });
});

export const deleteComment = catchAsync(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(new ErrorResponse("comment.not_found", 404));
    }
    const userIn = await User.findById(req.user.userId)
    if (comment.userId !== req.user.userId && !userIn.isAdmin) {
      return next(
        new ErrorResponse("comment.not_allowd_to_delete", 403)
      );
    }

    if(userIn?.isAdmin && !userIn?.approved) {
      return next(new ErrorResponse("comment.upproved_first_to_delete", 401));
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: STATUS_CODE.SUCCESS,
        message: req.t('comment.deleted'),
    });
});

export const getcomments = catchAsync(async (req, res, next) => {
    if (!req.user.userId)
      return next(
        new ErrorResponse("comment.not_allowd_to_get_all", 403)
      );
    const user = await User.findById(req.user.userId);
    if (!user?.isAdmin) {
      return next(
        new ErrorResponse("comment.not_allowd_to_get_all", 403)
      );
    }

    if(user?.isAdmin && !user?.approved) {
      return next(new ErrorResponse("comment.upproved_first_to_get_all", 401));
    }

    

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const data = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ data, totalComments, lastMonthComments, status: STATUS_CODE.SUCCESS,
      message: req.t('comment.all'), });
});
