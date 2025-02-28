import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: {
    public_id: { type: GraphQLString },
    secure_url: { type: GraphQLString },
  },
});

export const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString },
    gender: { type: GraphQLString },
    DOB: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    profilePic: { type: ImageType },
    coverPic: { type: ImageType },
  },
});

export const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    _id: { type: GraphQLString },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    logo: { type: ImageType },
    coverPic: { type: ImageType },
    HRs: { type: new GraphQLList(UserType) },
    legalAttachment: { type: ImageType },
  },
});

export const getAllDataResponse = new GraphQLObjectType({
  name: "getAllDataResponse",
  fields: {
    users: { type: new GraphQLList(UserType) },
    companies: { type: new GraphQLList(CompanyType) },
  },
});
