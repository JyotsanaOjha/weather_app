const express = require("express")
const app = express();
const https = require('node:https');             //native node module to make https get request to an external server(for API call to external server )
const bodyParser = require("body-parser");

app.use(express.static("public"));//it is needed if we want our server to serve up our static files such as css and images.We have to keep our static files under a folder named as "public". Now we can refer to these static files by the URL relative to the public folder.
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");

})

app.post("/", function (req, res) {

    let query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    let unit = "metric";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit
    https.get(url, function (response) {                // making an https get request to an external server 
       console.log("Status Code: "+response.statusCode)
        //console.log('statusCode:', response.statusCode);
        // console.log("following is the response we got")
        console.log("Status Message: "+response.statusMessage);
        // console.log('headers:', res.headers);

        response.on("data", function (d) {                  //tap into the response that we get back from the external server and call a method called "on", to search through the response for some data. This will correspond to the actual message body that we got back, that OpenWeatherMap has actually sent us. 

            const weatherData = JSON.parse(d);               //To convert JSON data(we got in any format hexadecimal/binary/text) into a JavaScript Object use JSON.parse(d).    
            // Steps to get different data items from the java script object(data recieved using API)
            //  step1: copy the url for api and paste it in the browser 
            //   step2: now we can see the recieved data using JSON Viewer Pro chrome plug-in
            //   step3: here we can select any data item and copy its path for further use as follows

            // let city = weatherData.name
            let temp = weatherData.main.temp;
            let weatherDescription = weatherData.weather[0].description;
            let icon = weatherData.weather[0].icon;
            let imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            // res.sendFile(__dirname + "/result.html?q=" + query);

            res.write("<h1>The temprature in " + query + " is " + temp + " degrees celcius.</h1>"); // there can be only one res.send(). So to send multiple lines as response, keep adding those lines to response using res.write() and at last use res.send(). 
            res.write("<h2>The weather is currently " + weatherDescription + " </h2>");
            res.write("<img src=" + imageURL + ">");
            res.send();




            //console.log("Following is the data fetched using API");
            //console.log(d);   // this will give data in hexadecimal format.. it will be more useful to have data as javascript object. so we need to convert it into javascript object.


            // IMPORTANT NOTE1: To convert JSON data(we got in any format hexadecimal/binary/text) into a JavaScript Object use JSON.parse(d).   
            // IMPORTANT NOTE2: To convert JavaScript object into JSON format use JSON.stringfy(object) .following is the example-->
            //  const object ={
            //     name : "jyotsana",
            //     favouriteFood :"chamcham"
            // }
            // console.log("the JSON format is"+ JSON.stringify(object));
        });

    })



    // res.send("server is up to respond get request");







})







app.listen(process.env.PORT || 3000, function () {

    console.log("server is running on port 3000.")


})

