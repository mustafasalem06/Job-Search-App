import User from "../../../DB/models/user.model.js";
import { verifyToken } from "../../../utils/token/token.js";

const socketAuth = async (socket, next) => {
    const { authorization } = socket.handshake.headers;
    if (!authorization)
        return next(new Error("Token is required!"));
    if (!authorization.startsWith("Bearer"))
        return next(new Error("Invalid token!"));

    const Token = authorization.split(" ")[1];
    const { id } = verifyToken({ token: Token });

    const user = await User.findById(id).select("-password").lean();
    if (!user) return next(new Error("User not found!"));

    if (!user.isLoggedIn) 
        return next(new Error("try to login again!"));

    socket.user = user;
    socket.id = user.id;
    return next()
}

export default socketAuth
    