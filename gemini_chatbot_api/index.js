import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());
app.use(express.json());
app.use(express.static(`public`)

)

app.post('/api/chat', async (req, res) => {

    const { messages } = req.body;

    try {
        if (!Array.isArray(messages)) throw new Error('Messages must be an array!');
        const contents = messages.map(({ role, text }) => ({
            role,
            parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL, contents
        });

        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost: ${PORT}`));