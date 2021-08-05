const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const users = require("./router/users");
const auth = require("./router/auth");
const multer = require("multer");
const csv = require("fast-csv");
const mongodb = require("mongodb");
const fs = require("fs");
const cors = require("cors");

const app = express();

console.log(`Enviorment: ${process.env.NoDE_ENV}`);
const url =
  "mongodb+srv://sam:sam@cluster0.zd0y4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 3000,
});

app.use(express.json());

app.options("*", cors());
app.use(cors({ origin: "*", credentials: true }));

app.get("/", async (req, res) => {
  res.send("Build-back-end");
});
global.__basedir = __dirname;

// Multer Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

// Filter for CSV file
const csvFilter = (req, file, cb) => {
  if (file.mimetype.includes("csv")) {
    cb(null, true);
  } else {
    cb("Please upload only csv file.", false);
  }
};
const upload = multer({ storage: storage, fileFilter: csvFilter });

// Upload CSV file using Express Rest APIs
app.post("/api/upload-csv-file", upload.single("file"), (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send({
        message: "Please upload a CSV file!",
      });
    }

    // Import CSV File to MongoDB database
    let csvData = [];
    let filePath = __basedir + "/uploads/" + req.file.filename;
    console.log(filePath);
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        csvData.push(row);
      })
      .on("end", () => {
        // Establish connection to the database
        const url =
          "mongodb+srv://sam:sam@cluster0.zd0y4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        var dbConn;
        mongodb.MongoClient.connect(url, {
          useUnifiedTopology: true,
        })
          .then((client) => {
            console.log("DB Connected!");
            dbConn = client.db();

            //inserting into the table "employees"
            var collectionName = "csv";
            var collection = dbConn.collection(collectionName);
            collection.insertMany(csvData, (err, result) => {
              if (err) console.log(err);
              if (result) {
                console.log(result);
                console.log(csvData);
                res.status(200).send({
                  message:
                    "Upload/import the CSV data into database successfully: " +
                    req.file.originalname,
                });
                client.close();
              }
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Fail to import data into database!",
              error: err.message,
            });
          });
      });
  } catch (error) {
    console.log("catch error-", error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
});

app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on port ${port}`));
