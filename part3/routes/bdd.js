var mongoose = require("mongoose");

//connection à la base de données
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(
    "mongodb+srv://test:test@cluster2.epmpp.mongodb.net/weatherapp?retryWrites=true&w=majority",
    options,
    function (err) {
        console.log("vous êtes bien connecté à mongoDB");
    }
);

//schéma
var citySchema = mongoose.Schema({
    name: String,
    img: String,
    desc: String,
    temp_min: Number,
    temp_max: Number,
});

var cityModel = mongoose.model("cities", citySchema);

module.exports = cityModel;
