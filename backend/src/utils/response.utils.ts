import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any = {},
  message: string = "Success",
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = "Something went wrong",
  statusCode: number = 400,
  errors: any = null
): Response => {
  const body: { success: boolean; message: string; errors?: any } = {
    success: false,
    message,
  };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
