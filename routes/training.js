const router = require("express").Router();
const conn = require("../db/dbConnection");
const util = require("util");
const { body, validationResult } = require("express-validator");
 
// Requiring the module 
const ExcelJS = require('exceljs');

router.post("/traning-data",
    body("plane_position").notEmpty().withMessage("Please enter the plane_position"),
    body("rock_position").notEmpty().withMessage("Please enter the rock_position"),
    body("action").notEmpty().withMessage("Please enter the action"),
     (req,res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }else {
                const plane_position = req.body.plane_position;
                const rock_position = req.body.rock_position;
                const action = req.body.action;
                
                // Load the existing workbook
                const workbook = new ExcelJS.Workbook();

                workbook.xlsx.readFile('./dataset.xlsx')
                .then(() => {
                    // Select the worksheet
                    const worksheet = workbook.getWorksheet('Sheet1');
                    const data = [
                        plane_position.x,
                        plane_position.y,
                        plane_position.z,
                        rock_position.x,
                        rock_position.y,
                        rock_position.z,
                        action
                    ]
                    // Append data to the worksheet
                    worksheet.addRow(data);

                    // Save the changes
                    return workbook.xlsx.writeFile('./dataset.xlsx');
                })
                .then(() => {
                    res.status(200).json("data is added")
                })
                .catch((error) => {
                    res.status(500).json({ error: error });
                });
                
            }
        }catch ( error ) {
            res.status(500).json({ error: error });
        }
    }
)
module.exports = router;