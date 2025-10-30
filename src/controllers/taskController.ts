import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

import prisma from '../configs/prisma';
import catchAsync from '../utils/catchAsync';
import { retrieveS3Url, uploadMultipleToS3 } from '../utils/imageUpload';

export const PostTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get task details from request body and images from request files and user from request user
    const user = req.user;

    const {
      title,
      description,
      tags,
      duration,
      startDate,
      endDate,
      price,
      negotiable,
    } = req.body;
    const imageFiles = req.files as Express.Multer.File[];

    const images = await uploadMultipleToS3(imageFiles);

    // make sure that negotiable is a boolean
    const parseBoolean = (value: string) =>
      typeof value === 'string' ? JSON.parse(value) : value;

    // check if start date is in the past or before end date
    const today = new Date();
    if (new Date(startDate) < today) {
      return next(createError(400, 'Start date cannot be in the past'));
    }
    if (new Date(endDate) < new Date(startDate)) {
      return next(createError(400, 'End date must be after start date'));
    }

    // send details to prisma to create a new task record
    const newTask = await prisma.task.create({
      data: {
        title,
        userId: user!.id,
        description,
        tags,
        duration: Number(duration),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: Number(price),
        negotiable: parseBoolean(negotiable),
        images,
      },
    });

    // return response
    res.status(201).send({
      status: 'success',
      message: 'Task created successfully',
      data: newTask,
    });
  },
);

// Implement search and pagination inside here, for now
export const GetAllTasks = catchAsync(async (_: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    select: {
      title: true,
      id: true,
      description: true,
      status: true,
      duration: true,
      tags: true,
      price: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
  });

  res.status(200).send({
    status: 'success',
    data: tasks,
  });
});

export const GetUserTasks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const tasks = await prisma.task.findMany({
      where: { userId: user!.id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        price: true,
        createdAt: true,
        startDate: true,
        endDate: true,
      },
    });

    if (tasks.length === 0) return next(createError(404, 'No tasks found'));

    res.status(200).send({
      status: 'success',
      data: tasks,
    });
  },
);

export const GetTaskById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;

    let task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        title: true,
        id: true,
        images: true,
        description: true,
        tags: true,
        duration: true,
        startDate: true,
        endDate: true,
        negotiable: true,
        status: true,
        price: true,
        createdAt: true,
      },
    });

    if (!task) return next(createError(404, 'Task not found'));

    //   get and sign each image URL from S3
    const signedImageUrls = await Promise.all(
      task?.images.map((imgUrl) => retrieveS3Url(imgUrl)) || [],
    );

    task.images = signedImageUrls;

    res.status(200).send({
      status: 'success',
      data: task,
    });
  },
);

// export const ApplyForTaskHelper = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // get user and taskId from request
//     const user = req.user;
//     const { taskId } = req.params;

//     //get task from database

//     // check if task is in progress or has been completed

//     // get req.body; {price offered}

//     // add user as helper to task

//   })
