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
      "select * from skins INNER JOIN userskins on skins.id = userskins.skinId where userskins.userid = ?",
      [userID]
    );
    skinsData.map((item)=>{
      item.imageUrl = "http://" + req.hostname +":4000/"+ item.imageUrl ;
      item.scale = JSON.parse(item.scale);
      item.positionPlane = JSON.parse(item.positionPlane)
    })
    res.status(200).json(skinsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
// get all skins
router.get("/allSkins", authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;

    const skinsData = await query(
      "select * from skins "
    );
    skinsData.map((item)=>{
      item.imageUrl = "http://" + req.hostname +":4000/"+ item.imageUrl ;
    })
    res.status(200).json(skinsData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
    });
  }
});
// git spacific skin
router.get("/spacificSkins/:skinid", authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const skinId = req.params.skinid;
    const skinsData = await query(
      "select * from skins where id=?",[skinId]
    );
    skinsData.map((item)=>{
      item.imageUrl = "http://" + req.hostname +":4000/"+ item.imageUrl ;
      item.scale = JSON.parse(item.scale);
      item.positionPlane = JSON.parse(item.positionPlane)
    })
    res.status(200).json(skinsData[0]);
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
      "SELECT * FROM skins WHERE NOT EXISTS ( SELECT 1 FROM userskins WHERE skins.id = userskins.skinId and userskins.userId = ?)",
      [userID]
    );
    skinsData.map((item)=>{
      item.imageUrl = "http://" + req.hostname +":4000/"+ item.imageUrl ;
      item.scale = JSON.parse(item.scale);
      item.positionPlane = JSON.parse(item.positionPlane)
    })
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
    const skinId = req.params.skinid;
    const userID = req.body.userId ;
    const skinsData = await query(
      "SELECT * FROM skins WHERE NOT EXISTS ( SELECT 1 FROM userskins WHERE skins.id = userskins.skinId and userskins.userId = ? ) and skins.id = ?",
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
        await query("insert into userskins set ?", buySkin);
        res.status(200).json({
          msg: "skin is now yours",
        });
      }
      
    }
  } catch (error) {
    console.log(error);
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
    body("price")
    .isString()
    .withMessage("Please enter the valid scale"),
    async (req, res) =>{
      try {
        const query = util.promisify(conn.query).bind(conn); // for multiple query

        // 1- validation the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        } else {
          if (!req.file) {
            return res.status(404).json({
                errors : [
                    {
                        msg:"image is required",
                    },
                ],
            })
          }
          const name = req.body.name;
          const skinData = {
            name : name,
            url : req.file.filename,
            scale : JSON.stringify({
              x: 1,
              y: 1,
              z: 1
            }),
          }  
          const a = await query("insert into skins set ?",skinData)
          res.status(200).json({
            msg : "skin created succesfullly",
        })
        }
      } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
      }
    }
)
module.exports = router;
