const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//login
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter the valid Email"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password shold be between 8 - 12 character"),
  async (req, res) => {
    try {
      const email = req.body.email;
      // fields validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // email validation (is exist)
      const query = util.promisify(conn.query).bind(conn); // for multiple query
      const userData = await query("select * from users where email = ?", [
        email,
      ]);
      if (userData.length != 0) {
        // Compare Hashed Password
        const passwordCheck = await bcrypt.compare(
          req.body.password,
          userData[0].password
        );
        if (passwordCheck) {
          delete userData[0].password;
          res.status(200).json(userData[0]);
        } else {
          res.status(404).json({
            errors: [
              {
                msg: "Invaled password",
              },
            ],
          });
        }
      } else {
        res.status(404).json({
          errors: [
            {
              msg: "Invaled email",
            },
          ],
        });
      }
    } catch (err) {
      res.status(500).json({
        err: err,
      });
    }
  }
);
// registration
router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter the valid Email"),
  body("name")
    .isString()
    .withMessage("Please enter the valid name")
    .isLength({ min: 3, max: 20 })
    .withMessage("password shold be between 3 - 20 character"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password shold be between 8 - 12 character"),
  async (req, res) => {
    try {
      // 1- validation the request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } else {
        // email check exist
        const query = util.promisify(conn.query).bind(conn); // for multiple query
        const email = req.body.email;
        const ckeckEmailExist = await query(
          "select * from users where email = ?",
          [email]
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
          // prepare object user to save it
          const userObject = {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            token: crypto.randomBytes(16).toString("hex"),
          };

          // insert user opject into db
          try {
            await query("insert into users set ?", userObject);
            delete userObject.password;
            res.status(200).json(userObject);
          } catch (error) {
            res.status(500).json({ error: error });
          }
        }
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

module.exports = router;
