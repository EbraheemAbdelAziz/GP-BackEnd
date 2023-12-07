const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const authorized = require("../middleware/authorize");
const util = require("util");

// unlocked skins list
router.get("/unlocked",authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;

    const skinsData = await query(
      "select * from skins INNER JOIN usersskins on skins.id = usersskins.skinId where usersskins.userid = ?",
      [userID]
    );
    res.status(200).json(skinsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
        
      error: error,
    });
  }
});
// locked skins list
router.get("/locked", authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;

    const skinsData = await query(
      "SELECT * FROM skins WHERE NOT EXISTS ( SELECT 1 FROM usersskins WHERE skins.id = usersskins.skinId and usersskins.userId = ?)",
      [userID]
    );
    res.status(200).json(skinsData);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
// user can buy a new skin
router.post("/buy/:skinid", authorized, async (req, res) => {
try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;
    const skinId = req.params.skinid
    const skinsData = await query(
      "SELECT * FROM skins WHERE NOT EXISTS ( SELECT 1 FROM usersskins WHERE skins.id = usersskins.skinId and usersskins.userId = ? ) and skins.id = ?",
      [userID, skinId]
    );
    if (skinsData.length == 0) {
        res.status(400).json({
          errors: [
            {
              msg: "Invaled skinId",
            },
          ],
        });
    }else{
        const buySkin = {
          userId: userID,
          skinId:skinId
        };
        await query("insert into usersskins set ?", buySkin);
        res.status(200).json({
          msg: "skin is now yours",
        });
    }
} catch (error) {
    res.status(500).json({
      error: error,
    });
}
});
module.exports = router;
