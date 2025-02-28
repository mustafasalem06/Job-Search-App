import User from "../../DB/models/user.model.js";
import { verifyToken } from "../../utils/token/token.js";

// Middleware to check if the user is authenticated based on the token and confirm user permissions.
export const isAuthenticatedGraphQL = (allowedRoles) => {
  return (resolver) => {
    return async (parent, args, context) => {
      const { authorization } = context;
      if (!authorization)
        throw new Error("Token is required!", { cause: 403 });
      if (!authorization.startsWith("Bearer"))
        throw new Error("Invalid token!", { cause: 403 });

      const Token = authorization.split(" ")[1];
      const { id } = verifyToken({ token: Token });

      const user = await User.findById(id).select("-password").lean();
      if (!user) throw new Error("User not found!", { cause: 404 });
      
      if (!allowedRoles.includes(user.role))
        throw new Error("Not authorized!", { cause: 401 });

      context.user = user;
      return resolver(parent, args, context);
    };
  };
};
