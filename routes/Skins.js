const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const authorized = require("../middleware/authorize");

// unlocked skins list
router.get("/unlocked", authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;

    const skinsData = await query(
      "select * from skins INNER JOIN usersSkins on skins.id = usersskins.skinId where usersskins.userid = ?",
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
    const skinId = req.params.skinid;
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
    } else {
      const userCoins = await query("select coins from users where id = ?", [
        userID,
      ]);
      if (userCoins[0].coins < skinsData[0].price) {
        res.status(400).json({
          errors: [
            {
              msg: "you don't have enough coins",
            },
          ],
        });
      }else{
        const buySkin = {
          userId: userID,
          skinId: skinId,
        };
        const newCoins = {
          coins: userCoins[0].coins - skinsData[0].price,
        };
        await query("update users set ? where id = ?", [newCoins, userID]);
        await query("insert into usersskins set ?", buySkin);
        res.status(200).json({
          msg: "skin is now yours",
        });
      }
      
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
