const jwt = require("jsonwebtoken");
const Token = require("./models/Token");

function verifyToken(req, res, next) {
  if (req.headers.authorization != undefined) {
    var token = req.headers.authorization.split(" ")[1];
  } else {
    return res.status(401).json({ error: "Token not provided" });
  }
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  jwt.verify(token, "milan", async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        await Token.findOneAndDelete({ token: token }).exec();
        return res.status(401).json({ error: "Token expired" });
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    }
    const existingToken = await Token.findOne({ token: token }).exec();
    if (!existingToken) {
      return res.status(401).json({ error: "Token not valid" });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;