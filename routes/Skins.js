const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const authorized = require("../middleware/authorize");
const upload = require("../middleware/uploadImages");
const { body, validationResult } = require("express-validator");

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
router.post("/createSkin",upload.single("image"),
body("name")
    .isString()
    .withMessage("Please enter the valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("password shold be between 3 - 20 character"),
    async (req, res) =>{
      try {
        // 1- validation the request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        if (!req.file) {
          return res.status(404).json({
              errors : [
                  {
                      msg:"image is reqiered",
                  },
              ],
          })
        }
        res.status(200).json({
          msg : req.file ,
      })
      }
      } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
      }
    }
)
module.exports = router;
