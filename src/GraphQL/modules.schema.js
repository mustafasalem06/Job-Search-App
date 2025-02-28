import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { AllDataForDashboardQuery } from "../modules/admin Dashboard/GraphQL Admin Dashboard/admin.query.js";


// defining the GraphQL schema
const schema = new GraphQLSchema({
  // all queries ("get") fields of users
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      ...AllDataForDashboardQuery,
    },
  }),
});

export default schema;
