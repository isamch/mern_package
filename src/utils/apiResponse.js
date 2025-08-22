export const successResponse = (res, data, message = "Success") => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};


export const apiResponse = (res, status = "success", message = "", data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status,
    message,
    data,
  });
};


export const errorResponse = (res, error = null, message = null, statusCode = 500) => {

  return res.status(statusCode).json({
    status: "error",
    message: message || (error && error.message) || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : (error && error.stack)

  });

};
