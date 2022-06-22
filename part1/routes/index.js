var express = require("express");
var router = express.Router();

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
    // ajout d'une ville avec valeurs fictives

    var exist = false;
    for (var i = 0; i < cityList.length; i++) {
        if (
            cityList[i].name.toLocaleLowerCase() ==
            req.body.cityname.toLocaleLowerCase()
        ) {
            exist = true;
        }
    }
    if (exist == false) {
        cityList.push({
            name: req.body.cityname,
            img: "url",
            desc: "temps magnifique",
            temp_min: "21",
            temp_max: "28",
        });
    }
    // console.log(cityList);

    res.render("weather", { cityList });
});

router.post("/doublon", function (req, res, next) {
    // ajout d'une ville avec valeurs fictives

    cityList.push({
        name: req.body.cityname,
        img: "url",
        desc: "temps magnifique",
        temp_min: "21",
        temp_max: "28",
    });

    res.render("weather", { cityList });
});

router.get("/delete-city", function (req, res, next) {
    // console.log(req.query);
    //suppression d'une ville
    cityList.splice(req.query.position, 1);

    res.render("weather", { cityList });
});

module.exports = router;
