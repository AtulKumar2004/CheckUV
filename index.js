import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    headers: {
        'x-rapidapi-key': `4509b4138dmsh76d1c61132e9efcp163346jsne0053467a300`
    }
};

const config2 = {
    headers: {
        'x-access-token': `openuv-km2rm0jlulrh-io`
    }
};

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/check", async (req, res) => {
    try{
        let location = req.body.location;
        let date = req.body.dateandtime;
        let response = await axios.get(`https://forward-reverse-geocoding.p.rapidapi.com/v1/forward?format=json&city=${location}`, config);
        let uvForecast = await axios.get(`https://api.openuv.io/api/v1/forecast?lat=${response.data[0].lat}&lng=${response.data[0].lon}&dt=${req.body.dateandtime}Z`, config2);
        let uvInd = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${response.data[0].lat}&lng=${response.data[0].lon}&dt=${req.body.dateandtime}Z`,config2);
        console.log(uvForecast.data.result);
        console.log(uvInd.data.result.sun_info.sun_times);
        console.log(uvInd.data.result.safe_exposure_time);
        res.render("uvinfo.ejs",{ content: uvForecast.data.result, location: location, sundata:uvInd.data.result.sun_info.sun_times,skintype:uvInd.data.result.safe_exposure_time, date: date.slice(0,10)});
    } catch(error) {
        console.error("Please enter valid City name and date!",error.message);
        res.render("error.ejs");
    }

});

app.get("/home",(req,res) => {
    res.render("index.ejs");
});

app.get("/faqs",(req,res) => {
    res.render("faqs.ejs");
});

app.get("/about",(req,res) => {
    res.render("about.ejs");
})
app.listen(port, () => {
    console.log(`Successfully started on server ${port}`);
});