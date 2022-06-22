var express = require("express");
var router = express.Router();

//request
var request = require("sync-request");

//import de la variable de mongoose
var cityModel = require("./bdd");

/* GET home page. */
router.get("/", async function (req, res, next) {
    res.render("login");
});

router.post("/weather", async function (req, res, next) {
    //on cherche nos villes dans la base de donnée et on les affiches
    var cityList = await cityModel.find();

    res.render("weather", { cityList });
});

router.post("/add-city", async function (req, res, next) {
    //on va sur l'api meteo

    var requete = request(
        "GET",
        "https://api.openweathermap.org/data/2.5/weather?q=" +
            req.body.cityname +
            "&appid=f7078d94ba2c124e280e64c1f142851b&units=metric&lang=fr"
    );
    var dataAPI = JSON.parse(requete.body);

    const newCityList = new cityModel({
        name: req.body.cityname,
        img: dataAPI.weather[0].icon,
        desc: dataAPI.weather[0].description,
        temp_min: Math.round(dataAPI.main.temp_min),
        temp_max: Math.round(dataAPI.main.temp_max),
    });

    await newCityList.save();

    // on verifie qu'il n'y ai pas de doublons
    var cityExiste = await cityModel.findOne({ name: req.body.cityname });
    if (cityExiste == null && dataAPI.name) {
        var cityList = new cityModel({
            name: req.body.cityname,
            img:
                "http://openweathermap.org/img/w/" +
                dataAPI.weather[0].icon +
                ".png",
            desc: dataAPI.weather[0].description,
            temp_min: Math.round(dataAPI.main.temp_min),
            temp_max: Math.round(dataAPI.main.temp_max),
        });
    }

    // if (dataAPI.cod == 404) {
    //     console.log("City not found");
    //     cityList.push({
    //         erreur: "City not found",
    //     });
    // }
    var cityList = await cityModel.find();
    // console.log(error);
    res.render("weather", { cityList, dataAPI });
});

router.get("/delete-city", async function (req, res, next) {
    // console.log(req.query);
    //suppression d'une ville
    // cityList.splice(req.query.position, 1);
    await cityModel.findByIdAndDelete(req.query.id);
    // console.log(newCityList);
    var cityList = await cityModel.find();

    res.render("weather");§
});

router.get("/updatedata", async function (req, res, next) {
    //afficher ville de la BDD
    var cityList = await cityModel.find();

    //on met à jour la ville selectionner avec le openweather
    for (var i = 0; i < cityList.length; i++) {
        var requete = request(
            "GET",
            "https://api.openweathermap.org/data/2.5/weather?q=" +
                cityList[i].name +
                "&appid=f7078d94ba2c124e280e64c1f142851b&units=metric&lang=fr"
        );
        var dataAPI = JSON.parse(requete.body);

        //on met à jour les données
        await cityModel.updateOne(
            //on défini l'id qui va se mettre à jour
            { _id: cityList[i]._id },
            {
                name: cityList[i].name,
                img:
                    "http://openweathermap.org/img/w/" +
                    updateWeatherDataAPI.weather[0].icon +
                    ".png",
                desc: dataAPI.weather[0].description,
                temp_min: Math.round(dataAPI.main.temp_min),
                temp_max: Math.round(dataAPI.main.temp_max),
            }
        );
    }

    res.render("weather", { cityList });
});

module.exports = router;
