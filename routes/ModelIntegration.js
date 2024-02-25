const router = require("express").Router();
const { body, validationResult } = require("express-validator");
router.post("/model",
    async (req,res) => {
        try {
            // Invoke the Python script as a child process
            const { spawnSync } = require('child_process');

            // Define the JSON object
            const jsonObject = {
            key1: -2,
            key2: -2,
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

            res.status(200).json({ msg : results[2] });
        } catch (error) {
            res.status(500).json({ error: error });
        }
})
module.exports = router;
