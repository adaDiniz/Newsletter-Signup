const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
  const fNameValue = req.body.fName
  const lNameValue = req.body.lName
  const emailValue = req.body.email

  const data = {
      members: [
        {
          email_address: emailValue,
          status: "subscribed",
          merge_fields: {
            FNAME: fNameValue,
            LNAME: lNameValue
          },
        }
      ]
  }
  const jsonData = JSON.stringify(data)

  const url = "https://us11.api.mailchimp.com/3.0/lists/c36600115b"

  const options = {
    method: "POST",
    auth: "ada:31e1ecdf8aaf98e42f810a2b53c0b607-us11"
  }

  const request =  https.request(url , options, function(response){
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
      } else {
        res.sendFile(__dirname + "/failure.html") 
      }

      response.on("data", function(data) {
        console.log(JSON.parse(data))
      })
    })

    request.write(jsonData)
    request.end()
})

app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running!")
})
