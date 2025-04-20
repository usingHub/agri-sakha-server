import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';  // Use import for ES module
import cors from 'cors';



const app = express();
const port = 5000;

app.use(cors());

// Middlewares
app.use(bodyParser.json());

// API endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.userMessage;

    if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
        // Set the correct Gemini model
        const modelName = 'gemini-2.0-flash';  // Gemini model you're using
        const apiKey = "AIzaSyCQU8j5yNDO64i1N2cQZKxrF6X1rxcdonQ";  // Replace with your actual Gemini API key

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        // Construct the request body for Gemini API
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: userMessage
                        }
                    ]
                }
            ]
        };

        // Make the API request to Gemini
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Check if the response is valid
        const data = await response.json();

        // If no content or error in the response
        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ error: 'Error communicating with Gemini', details: data.error });
        }

        // Send the reply from Gemini back to the user
        return res.json({ reply: data.candidates[0]?.content?.parts[0]?.text || 'No valid response from Gemini' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
