const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const bcrypt = require("bcrypt");
const authorized = require("../middleware/authorize");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const fs = require("fs");

// get user info
router.get("/info", authorized, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn); // for multiple query
    const userID = res.locals.user.id;

    const UserData = await query(
      "SELECT * FROM users where id = ?",
      [userID]
    );
    UserData.map((item)=>{
      item.photo = "http://" + req.hostname +":4000/"+ item.photo ;

    })
    delete UserData[0].password;
    res.status(200).json(UserData[0]);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});

// update user info
router.put(
  "/update",
  authorized,upload.single("photo"),
  body("email").isEmail().withMessage("Please enter the valid Email"),
  body("name")
    .isString()
    .withMessage("Please enter the valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("name shold be between 3 - 20 character"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password shold be between 8 - 12 character"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        
        const query = util.promisify(conn.query).bind(conn); // for multiple query
        const userID = res.locals.user.id;
        const email = req.body.email;
        const ckeckEmailExist = await query(
          "select * from users where email = ? and id != ?",
          [email, userID]
        );
        const passwordCheck = await bcrypt.compare(
          req.body.password,
          res.locals.user.password
        );

        if (ckeckEmailExist.length > 0) {
          res.status(400).json({
            errors: [
              {
                msg: "email is already exist",
              },
            ],
          });
        } else {
          const userObject = {
            name: req.body.name,
            email: req.body.email,
          };
          if (!passwordCheck) {
            userObject.password = await bcrypt.hash(req.body.password, 10);
          }
          if (req.file ) {
            userObject.photo = req.file.filename;
            if (res.locals.user.photo !== "1709903298569.jpg") {
              fs.unlinkSync("./upload/"+ res.locals.user.photo )
            }
          }
          await query("update users set ? where id = ?", [userObject, userID]);
          res.status(200).json({
            msg: "user info updated successfully",
          });
        }
      }
    } catch (error) {
      res.status(500).json({ error: error });
      console.log(error);
    }
  }
);

module.exports = router;