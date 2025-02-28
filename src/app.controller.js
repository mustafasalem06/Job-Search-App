import connectDB from "./DB/connection.js";
import globalErrorHandler from "./utils/error handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error handling/notFoundHandler.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import adminRouter from "./modules/admin Dashboard/adminDashboard.controller.js";
import jobRouter from "./modules/job/job.controller.js";
import companyRouter from "./modules/company/company.controller.js";
import chatRouter from "./modules/chat/chat.controller.js";
import applicationsRouter from "./modules/applications/applications.controller.js";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./GraphQL/modules.schema.js";
import morgan from "morgan";

const bootstrap = async (app, express) => {
  // Connect to database
  await connectDB();
  app.use(express.json());

  // Use Morgan middleware for logging HTTP requests in the "dev" format
  app.use(morgan("dev"));

  // Serve static files from the "uploads" directory when accessing the "/uploads" route
  app.use("/uploads", express.static("uploads"));

  // Routes
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/chat", chatRouter);
  app.use("/applications", applicationsRouter);

  // GraphQL Router
  app.use(
    "/graphql",
    createHandler({
      schema,
      // Pass the authorization header to the context object in the resolvers
      context: (req) => {
        const { authorization } = req.headers;
        return { authorization };
      },
      // Handle GraphQL errors and responses
      formatError: (error) => {
        return {
          success: false,
          message: error.originalError?.message,
          stack: error.originalError?.stack,
          statusCode: error.originalError?.cause || 500,
        };
      },
    })
  );

  // Handle all undefined routes with a custom "not found" handler
  app.all("*", notFoundHandler);

  // Use a global error handler for centralized error management
  app.use(globalErrorHandler);
};

export default bootstrap;
