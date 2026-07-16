import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

const API_KEY = process.env.LETSFG_API_KEY || 'letsfg_E66D9N9HAlvPZ6Da5zO0PKPaECmhh8RHMxVPp6VmJfo';

app.get('/api/search', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        
        if (!origin || !destination || !date) {
            return res.status(400).json({ error: "Missing origin, destination, or date parameters." });
        }
        
        console.log(`[LetsFG Sandbox API] Searching flights: ${origin} → ${destination} on ${date}`);
        
        // Directly call the free sandbox endpoint so it works instantly without needing account funding
        const response = await fetch("https://letsfg.co/developers/api/v1/sandbox/flights/search", {
            method: "POST",
            headers: {
                "X-API-Key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                origin,
                destination,
                date_from: date
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `API error (${response.status})`);
        }
        
        res.json(data);
    } catch (error) {
        console.error("[LetsFG API] Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during flight search." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✈️  Finder Flights (LetsFG Sandbox) backend running on http://localhost:${PORT}`);
    console.log(`Ready to search! Test it in your browser.`);
});
