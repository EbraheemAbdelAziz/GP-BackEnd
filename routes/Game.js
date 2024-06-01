const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const authorized = require("../middleware/authorize");
const { body, validationResult } = require("express-validator");

// get user round
router.get("/rounds",authorized,
    async (req,res) =>{
        try {
            const query = util.promisify(conn.query).bind(conn); // for multiple query
            const userID = res.locals.user.id;
            const starlordrounds = await query("SELECT  starlordrounds.id , time , requiredCoins , speed FROM starlordrounds join userround on starlordrounds.id =  userround.roundId join users on userround.userId = users.id  where users.id = ? ",[userID]);
            res.status(200).json(starlordrounds[0]);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
)

// get user coins
router.get("/coins",authorized,
    async (req,res) =>{
        try {
            const query = util.promisify(conn.query).bind(conn); // for multiple query
            const userID = res.locals.user.id;
            const UserHighScore = await query("SELECT coins FROM users where id = ?", [
              userID,
            ]);
            res.status(200).json(UserHighScore[0].coins)
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
)
// update user coins
router.put(
  "/update-coins",
  authorized,
  body("coins").isNumeric().withMessage("please send correct coins"),
  body("xp").isNumeric().withMessage("please send correct xp"),
  body('status'),
  async (req,res)=>{
    try {
      const query = util.promisify(conn.query).bind(conn); // for multiple query
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const userID = await res.locals.user.id;
        const userObject = {
          coins: req.body.coins,
          xp: req.body.xp
        };
        await query("update users set ? where id = ?", [userObject, userID]);
        if (req.body.status === 'win') {
          // get round id
          const starlordrounds = await query("SELECT starlordrounds.id FROM starlordrounds join userround on starlordrounds.id =  userround.roundId join users on userround.userId = users.id  where users.id = ? ",[userID]);
          // delete the completed round
          await query("delete from userround where roundId = ? and userId = ?",[starlordrounds[0].id , userID]);
          // check if was anothor rounds
          const chekMoreRounds = await query("SELECT starlordrounds.id FROM starlordrounds where starlordrounds.id = ? ",[starlordrounds[0].id+1 ]);
          if (chekMoreRounds[0] ) {
            const userRound = {
              userId : userID,
              roundId : starlordrounds[0].id + 1
            }
            // asign a new round to user 
            await query("insert into userround set ? ",[userRound])
          }else{
            // if no more rounds 
            return res.status(404).json({
              errors : [
                  {
                      msg:"There is no rounds eny more ,Thank you for your little trip ",
                  },
              ],
          })
          }
        }
        res.status(200).json({
          msg: "user coins and xp updated successfully",
        });
      }
    } catch (error) {
      console.log(error);
        res.status(500).json({ error: error });
    }
  }
);
module.exports = router;