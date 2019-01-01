const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const { mongoose } = require("./db/mongoose");
const { Temp } = require("./models/temp");

const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const publicPath = path.join(__dirname, "..", "public");
const views = path.join(__dirname, "..", "public", "views");
const layouts = path.join(__dirname, "..", "public", "views", "layouts");
const partials = path.join(__dirname, "..", "public", "views", "partials");

hbs.registerPartials(partials);

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.set("views", views);
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: layouts,
    partialsDir: partials
  })
);

app.get("/api/temp", (request, response) => {
  Temp.findOne()
    .sort({ createdAt: -1 })
    .limit(1)
    .then(temp => {
      response.send(temp);
    });
});

app.get("/", (request, response) => {
  Temp.findOne()
    .sort({ createdAt: -1 })
    .limit(1)
    .then(
      doc => {
        const temp = {
          ...doc.toObject()
        };
        response.render("home", {
          ...temp
        });
      },
      error => {
        response.status(400).send(error);
      }
    );
});

app.post("/api/temp", (request, response) => {
  if (request.body.key !== "secretsauce") {
    console.log({ error: "invalid key" });
    return response.status(400).send({ error: "invalid key" });
  }
  const date = new Date();

  const temp = new Temp({
    temp: request.body.temp,
    humid: request.body.humid,
    loc: request.body.loc,
    temp_f: request.body.temp_f,
    createdAt: date.getTime()
  });

  temp.save().then(
    doc => {
      data = request.body;
      console.log("OK");
      response.status(200).send("OK");
    },
    error => {
      response.status(400).send(error);
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
