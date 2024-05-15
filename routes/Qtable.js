const router = require("express").Router();
const util = require("util");
const { body, validationResult } = require("express-validator");
const authorized = require('../middleware/authorize')
const conn = require("../db/dbConnection");


// update user qtable
router.put("/update-Qtable",authorized,
    body("qtable").notEmpty().withMessage("Please enter the qtable"),
     async (req,res) => {
        try {
            const query = util.promisify(conn.query).bind(conn); // for multiple query
            const userID = res.locals.user.id; ;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }else {
                const qtable = JSON.stringify(req.body.qtable);
                const qtableData ={
                    qtable: qtable
                }
                await query("update users set ? where id = ?", [qtableData, userID]);
                res.status(200).json({
                    msg: "qtable updated"
                })
            }
        }catch ( error ) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
)
// get user qtable
router.get("/Qtable",authorized,
     async (req,res) => {
        try {
            const query = util.promisify(conn.query).bind(conn); // for multiple query
            const userID = res.locals.user.id; ; 
            const qtable = await query("select qtable from users where id = ?", [userID]);
            res.status(200).json(JSON.parse(qtable[0].qtable));
            // res.status(200).json(qtable[0].qtable);
        }catch ( error ) {
            console.log(error);
            res.status(500).json({ error: error });
        }
    }
)
module.exports = router;