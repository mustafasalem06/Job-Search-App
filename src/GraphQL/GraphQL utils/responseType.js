import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from "graphql";

export const createResponseType = (name, resultsType) => {
  return new GraphQLObjectType({
    name: name,
    fields: {
      success: { type: GraphQLBoolean },
      statusCode: { type: GraphQLInt },
      results: { type: resultsType },
    },
  });
};
