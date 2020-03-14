const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");


app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req1, res1) {
  const fname = req1.body.Fname;
  const lname = req1.body.Lname;
  const email = req1.body.email;
  const phn = req1.body.phnNo;
  const gender = req1.body.gender;
  console.log(gender);
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname,
        PHONE: phn
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/a13c7f1245";
  const options = {
    method: "POST",
    auth: "deepak:e922ae371cf180458f24fc2c89e61a81-us19"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      var url = "https://joeschmoe.io/api/v1/" + gender + "/" + fname + " " + lname
      res1.render("success", {
        apiUrl: url,
        userName: fname + " " + lname
      });

    } else {
      res1.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req2, res2) {
  res2.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("server is running in port 3000....");
});