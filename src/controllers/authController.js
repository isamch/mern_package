import { successResponse, apiResponse } from './../utils/apiResponse.js'


export const singUpController = (req, res) => {

  const { email, password } = req.body;

  try {
    
    
    // validation :
    // return successResponse(res, {email, password}, "from auth controller");
    
    return apiResponse(res, "success", "this is message", {email, password}, 201);
    


  } catch (error) {
    
  }


};