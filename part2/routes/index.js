var express = require("express");
var router = express.Router();

var request = require("sync-request");

const cityList = [
    {
        name: "paris",
        img: "url",
        desc: "il faut super beau",
        temp_min: "18",
        temp_max: "22",
    },
];

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("login");
});

router.post("/weather", function (req, res, next) {
    res.render("weather", { cityList });
});

router.post("/add-city", function (req, res, next) {
    //on va sur l'api meteo

    var requete = request(
        "GET",
        "https://api.openweathermap.org/data/2.5/weather?q=" +
            req.body.cityname +
            "&appid=f7078d94ba2c124e280e64c1f142851b&units=metric&lang=fr"
    );
    var dataAPI = JSON.parse(requete.body);
    // console.log(dataAPI);

    // ajout d'une ville avec valeurs fictives

    var exist = false;
    for (var i = 0; i < cityList.length; i++) {
        if (cityList[i].name == req.body.cityname) {
            exist = true;
        }
    }
    if (exist == false && dataAPI.name) {
        cityList.push({
            name: req.body.cityname,
            img: dataAPI.weather[0].icon,
            desc: dataAPI.weather[0].description,
            temp_min: Math.round(dataAPI.main.temp_min),
            temp_max: Math.round(dataAPI.main.temp_max),
        });
    }
    console.log(dataAPI);

    if (dataAPI.cod == 404) {
        console.log("City not found");
        cityList.push({
            erreur: "City not found",
        });
    }

    // console.log(error);
    res.render("weather", { cityList, dataAPI });
});

// router.post("/doublon", function (req, res, next) {
//     // ajout d'une ville avec valeurs fictives

//     cityList.push({
//         name: req.body.cityname,
//         img: "/images/picto-1.png",
//         desc: "dataAPI.description",
//         temp_min: "dataAPI.main.temp_min",
//         temp_max: "dataAPI.main.temp_max",
//     });

//     res.render("weather", { cityList });
// });

router.get("/delete-city", function (req, res, next) {
    // console.log(req.query);
    //suppression d'une ville
    cityList.splice(req.query.position, 1);

    res.render("weather", { cityList });
});

module.exports = router;
