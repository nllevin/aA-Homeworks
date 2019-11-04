const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = graphql;
const mongoose = require("mongoose");

const UserType = require("./user_type");
const User = mongoose.model("user");
const PostType = require("./post_type");
const Post = mongoose.model("post");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    newUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { name, email, password }) {
        return new User({ name, email, password }).save();
      }
    },
    newPost: {
      type: PostType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { title, body, author }) {
        return new Post({ title, body, author }).save()
          .then(post => {
            return User.findById(author)
              .then(user => {
                user.posts.push(post);
                return user.save()
                  .then(() => post);
              });
          });
      }
    }
  }
});

module.exports = mutation;