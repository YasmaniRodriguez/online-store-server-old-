const PRIVATE_KEY = "miclaveultrasecreta123*";
const PORT = 8080;
const DATA_PERSISTANCE_MODE = 4;
const MONGO_LOCAL_OPTIONS = {
	authSource: "admin",
	user: "root",
	pass: "qwerty456",
};
const MONGO_CLOUD_URI =
	"mongodb+srv://root:masterinc@online-store-server.ocmyz.mongodb.net/ecommerce";
const MONGO_LOCAL_URI = "mongodb://localhost:27017/ecommerce";
module.exports = {
	PRIVATE_KEY,
	PORT,
	DATA_PERSISTANCE_MODE,
	MONGO_CLOUD_URI,
	MONGO_LOCAL_URI,
	MONGO_LOCAL_OPTIONS,
};
