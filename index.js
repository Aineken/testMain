const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
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
    auth: "ayan:922fd0cc812dc993f54345d33b293a60-us1",
  };

  const mailChimp = https.request(url, options, (respond) => {
    if (respond.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    res.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  mailChimp.write(addDataJSON);
  mailChimp.end();
});

app.get("/reset", (req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`server is running on ${PORT}`));

//
