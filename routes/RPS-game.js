const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const authorized = require("../middleware/authorize");
const upload = require("../middleware/uploadImages");
const { body, validationResult } = require("express-validator");

router.get("/allChamps", authorized, async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn); // for multiple query
        const champData = await query("select * from chamionships" );
        if (champData.length > 0) {
            champData.map((item)=>{
            item.image = "http://" + req.hostname +":4000/"+ item.image ;
            })
        }
        res.status(200).json(champData);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
          });
    }
})

router.post("/addChamps", authorized,upload.single("image"),
    body("name")
        .isString()
        .withMessage("Please enter the valid name")
        .isLength({ min: 3, max: 20 })
        .withMessage("password shold be between 3 - 20 character"),
    body("price")
        .isNumeric()
        .withMessage("Please enter the valid scale"),
    body("game_remaining")
        .isNumeric()
        .withMessage("Please enter the valid scale"),
 async (req, res) => {
    try {
        const query = util.promisify(conn.query).bind(conn); // for multiple query
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
            const champData = {
            name : req.body.name,
            price : req.body.price,
            game_remaining : req.body.game_remaining,
            image : req.file.filename,
            }
            await query("insert into chamionships set ?",champData)
            res.status(200).json({
            msg : "chamionship created Successfully",
        })
        
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
        error: error,
        });
    }
})


module.exports = router;
