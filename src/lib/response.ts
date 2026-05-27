import type { Response } from "express";

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
