const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  const { name, surname, email, phone } = req.body;

  const addData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          LNAME: surname,
          PHONE: phone,
        },
      },
    ],
  };
  const addDataJSON = JSON.stringify(addData);

  let url = "https://us1.api.mailchimp.com/3.0/lists/780daf7ad0";
  let options = {
    method: "POST",
    auth: "ayan:685fc330d2fd7ddd4f71ae098ae2e2ea-us1",
    server: "us1",
  };

  const mailChimp = https.request(url, options, (res) => {
    console.log(res.statusCode);

    res.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  mailChimp.write(addDataJSON);
  mailChimp.end();
  res.send("ty tochno down");
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));

//
