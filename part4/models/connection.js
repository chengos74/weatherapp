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
        if (err) {
            console.log(
                `error, failed to connect to the database because --> ${err}`
            );
        } else {
            console.info("connexion à mongoDB réussie");
        }
    }
);
