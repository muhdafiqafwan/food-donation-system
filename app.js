const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());

app.use(cookieParser());

const { formatError } = require("./helpers/constants");
const errorName = formatError.errorName;

app.use(isAuth);

app.use("/graphql", (req, res) => {
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    context: { req, res, errorName },
    formatError: (err) => {
      return formatError.getError(err);
    },
  })(req, res);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(
        `Server started on port:${PORT}, URL:\"http://localhost:${PORT}/graphql\"`
      )
    );
  })
  .catch((err) => {
    console.log(err);
  });
