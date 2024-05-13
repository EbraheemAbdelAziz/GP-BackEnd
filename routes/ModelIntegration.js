const router = require("express").Router();
const { body, validationResult } = require("express-validator");
// body("plane_position").notEmpty().withMessage("Please enter the plane_position"),
//     body("rock_position").notEmpty().withMessage("Please enter the rock_position"),
router.post("/model",
    
    async (req,res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Invoke the Python script as a child process
            const { spawnSync } = require('child_process');
            // Define the JSON object
            const plane_position = req.body.plane_position;
            const rock_position = req.body.rock_position;

            const jsonObject = {
                key1: plane_position.x,
                key2: rock_position.x,
            };

            // Convert the JSON object to a string
            const jsonString = JSON.stringify(jsonObject);

            // Invoke the Python script as a child process synchronously
            const pythonProcess = spawnSync('python', ['main.py'], {
            input: jsonString,
            encoding: 'utf-8'
            });

            // Check for any errors
            if (pythonProcess.error) {
            console.error(pythonProcess.error.message);
            process.exit(1);
            }
            // Get the output from stdout
            const output = pythonProcess.stdout.trim().split('\n');

            // Parse the output as JSON
            const results = output;

            // console.log(jsonObject);
            // res.status(200).json(jsonObject);
            res.status(200).json({ action : results[2] });
        } catch (error) {
            res.status(500).json({ error: error });
        }
})
module.exports = router;
