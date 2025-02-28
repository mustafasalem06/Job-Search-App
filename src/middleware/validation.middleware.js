
import { Types } from "mongoose";

const validation = (schema) => {
    return (req, res, next) => {
      const data = { ...req.body, ...req.query, ...req.params };
      const result = schema.validate(data, { abortEarly: false });
  
      if (req.file || req.files?.length) data.file = req.file || req.files;
  
      if (result.error) {
        const messageList = result.error.details.map((obj) => obj.message);
        return next(new Error(messageList), { cause: 400 });
      }
      return next();
    };
};

export const isValidObjectId = (value, helpers) => {
    if (Types.ObjectId.isValid(value)) return true;
    return helpers.error("Invalid ObjectId!");
}

export default validation
    