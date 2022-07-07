var express = require("express");
var router = express.Router();

//request
var request = require("sync-request");

//import de la variable de mongoose
var cityModel = require("../models/cities");
var userModel = require("../models/users");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("login", { title: "Express" });
});

/* GET weather page. */
router.get("/weather", async function (req, res, next) {
    //on bloque l'acces à weather si on est pas identifié
    if (req.session.user == null) {
        res.redirect("/");
    } else {
        var cityList = await cityModel.find();
        res.render("weather", { cityList });
    }
});

/* POST add-city page. */
router.post("/add-city", async function (req, res, next) {
    var data = request(
        "GET",
        `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&units=metric&lang=fr&appid=0c815b9455235455a301668a56c67b18`
    );
    var dataAPI = JSON.parse(data.body);

    if (dataAPI.name) {
        dataAPI.name =
            dataAPI.name.charAt(0).toUpperCase() +
            dataAPI.name.substr(1).toLowerCase();
        req.body.newcity =
            req.body.newcity.charAt(0).toUpperCase() +
            req.body.newcity.substr(1).toLowerCase();
    }

    var alreadyExist = await cityModel.findOne({
        name: req.body.newcity.toLowerCase(),
    });

    if (alreadyExist == null && dataAPI.name) {
        var newCity = new cityModel({
            name: req.body.newcity.toLowerCase(),
            desc: dataAPI.weather[0].description,
            img:
                "http://openweathermap.org/img/wn/" +
                dataAPI.weather[0].icon +
                ".png",
            temp_min: dataAPI.main.temp_min,
            temp_max: dataAPI.main.temp_max,
        });

        await newCity.save();
    }

    var cityList = await cityModel.find();

    res.render("weather", { cityList });
});

/* GET delete-city page. */
router.get("/delete-city", async function (req, res, next) {
    await cityModel.deleteOne({
        _id: req.query.id,
    });

    var cityList = await cityModel.find();

    res.render("weather", { cityList });
});

/* GET update-city page. */
router.get("/update-cities", async function (req, res, next) {
    //on instancie les villes avant la boucle
    var cityList = await cityModel.find();

    for (var i = 0; i < cityList.length; i++) {
        var data = request(
            "GET",
            `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&units=metric&lang=fr&appid=0c815b9455235455a301668a56c67b18`
        );
        var dataAPI = JSON.parse(data.body);

        //on update la ou les villes qui sont dans mongoDB
        await cityModel.updateOne(
            {
                _id: cityList[i].id,
            },
            {
                name: cityList[i].name,
                desc: dataAPI.weather[0].description,
                img:
                    "http://openweathermap.org/img/wn/" +
                    dataAPI.weather[0].icon +
                    ".png",
                temp_min: dataAPI.main.temp_min,
                temp_max: dataAPI.main.temp_max,
            }
        );
    }

    var cityList = await cityModel.find();

    res.render("weather", { cityList });
});

/* POST signUp page. */
router.post("/sign-up", async function (req, res, next) {
    var searchUser = await userModel.findOne({
        email: req.body.emailFromFront,
    });

    if (!searchUser) {
        var newUser = new userModel({
            username: req.body.usernameFromFront,
            email: req.body.emailFromFront,
            password: req.body.passwordFromFront,
        });

        var newUserSave = await newUser.save();

        req.session.user = {
            name: newUserSave.username,
            id: newUserSave._id,
        };

        console.log(req.session.user);

        res.redirect("/weather");
    } else {
        res.redirect("/");
    }
});

/* POST signIn page. */
router.post("/sign-in", async function (req, res, next) {
    //on cherche s'il y a un email dans la base de donnée
    var searchUser = await userModel.findOne({
        email: req.body.emailFromFront,
        password: req.body.passwordFromFront,
    });

    if (searchUser != null) {
        req.session.user = {
            name: searchUser.username,
            id: searchUser._id,
        };
        // console.log(req.session.user);
        res.redirect("/weather");
    } else {
        res.render("login");
    }
});

/* GET logout page. */
router.get("/logout", function (req, res, next) {
    //on detruit la session
    req.session.user = null;

    res.redirect("/");
});
module.exports = router;
