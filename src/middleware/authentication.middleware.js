
import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error handling/asynchandler.js";
import { verifyToken } from "../utils/token/token.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization)
        return next(new Error("Token is required!"), { cause: 403 });
    if (!authorization.startsWith("Bearer"))
        return next(new Error("Invalid token!"), { cause: 403 });

    const Token = authorization.split(" ")[1];
    const { id } = verifyToken({ token: Token });

    const user = await User.findById(id).select("-password").lean();
    if (!user) return next(new Error("User not found!"), { cause: 404 });

    if (!user.isLoggedIn) 
        return next(new Error("try to login again!"), { cause: 401 });

    req.user = user;
    return next()
})

export default isAuthenticated
    