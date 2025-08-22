import { errorResponse } from './../utils/apiResponse.js'

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return errorResponse(res, err, null, statusCode);
};

export default errorHandler;
