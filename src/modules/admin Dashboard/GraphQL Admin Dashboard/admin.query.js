import { isAuthenticatedGraphQL } from "../../../GraphQL/GraphQL Middlewares/authentication.js";
import { createResponseType } from "../../../GraphQL/GraphQL utils/responseType.js";
import { roles } from "../../../utils/constants/appConstants.js";
import { allMiddleware } from "./../../../GraphQL/GraphQL Middlewares/allMiddleware.js";
import * as adminService from "./admin.service.js";
import * as adminResponse from "./types/admin.types.response.js";

export const AllDataForDashboardQuery = {
  getAllData: {
    type: createResponseType("getAllData", adminResponse.getAllDataResponse),
    resolve: allMiddleware(
      adminService.getAllData,
      isAuthenticatedGraphQL(roles.ADMIN, roles.COMPANY_OWNER)
    ),
  },
};
