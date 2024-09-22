const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3009;

app.use(express.json());
app.use(cors());
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ is_success: false, message: "Invalid data format. 'data' must be a non-empty array." });
    }

    const numbers = data.filter(item => !isNaN(item) && item.trim() !== "");
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));

    const highestLowercaseAlphabet = alphabets
        .filter(char => char >= 'a' && char <= 'z')
        .sort()
        .pop() || null;

    // File handling (if file_b64 is provided)
    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = null;

    if (file_b64) {
        try {
            const fileBuffer = Buffer.from(file_b64, 'base64');
            fileValid = true;
            fileMimeType = 'application/octet-stream';//default
            fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
        } catch (error) {
            fileValid = false;
        }
    }

    const response = {
        is_success: true,
        user_id: "Udathu_Hari_Hara_Durga_Vasisht_Pranav_06052004",
        email: "vasishtpranav_hari@srmap.edu.in",
        roll_number: "AP21110010364",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB,
    };


    res.status(200).json(response);
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
