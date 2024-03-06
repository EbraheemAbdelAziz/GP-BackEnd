const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const authorized = require("../middleware/authorize");
const { body, validationResult } = require("express-validator");

// get user high score
// router.get("/high-score",authorized,
//     async (req,res) =>{
//         try {
//             const query = util.promisify(conn.query).bind(conn); // for multiple query
//             const userID = res.locals.user.id;
//             const UserHighScore = await query("SELECT high_score FROM users where id = ?", [
//               userID,
//             ]);
//             res.status(200).json(UserHighScore[0].high_score)
//         } catch (error) {
//             res.status(500).json({ error: error });
//         }
//     }
// )
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
// update user high score
// router.put(
//   "/update-score",
//   authorized,
//   body("high_score"),
//   async (req,res)=>{
//     try {
//       const query = util.promisify(conn.query).bind(conn); // for multiple query
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       } else {
//         const userID = res.locals.user.id;
//         const userObject = {
//           high_score: req.body.high_score,
//         };
//         await query("update users set ? where id = ?", [userObject, userID]);
//         res.status(200).json({
//           msg: "user score updated successfully",
//         });
//       }
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
//   }
// );
// update user coins
router.put(
  "/update-coins",
  authorized,
  body("coins"),
  async (req,res)=>{
    try {
      const query = util.promisify(conn.query).bind(conn); // for multiple query
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        const userID = res.locals.user.id;
        const userObject = {
          coins: req.body.coins,
        };
        await query("update users set ? where id = ?", [userObject, userID]);
        res.status(200).json({
          msg: "user coins updated successfully",
        });
      }
    } catch (error) {
        res.status(500).json({ error: error });
    }
  }
);
module.exports = router;