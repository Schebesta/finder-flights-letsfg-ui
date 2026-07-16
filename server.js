import express from 'express';
import { LetsFG } from 'letsfg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve the frontend UI
app.use(express.static(__dirname));

// Initialize the LetsFG SDK
// This automatically picks up the Twitter/X auth token (from letsfg auth)
// or a LETSFG_API_KEY if using the Developer API.
const letsfg = new LetsFG();

app.get('/api/search', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        
        if (!origin || !destination || !date) {
            return res.status(400).json({ error: "Missing origin, destination, or date parameters." });
        }
        
        console.log(`[LetsFG API] Searching flights: ${origin} → ${destination} on ${date}`);
        
        // Call the LetsFG SDK to perform the search
        const flights = await letsfg.search(origin, destination, date);
        
        res.json(flights);
    } catch (error) {
        console.error("[LetsFG API] Error:", error);
        res.status(500).json({ error: error.message || "An error occurred during flight search." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✈️  Finder Flights (LetsFG) backend running on http://localhost:${PORT}`);
    console.log(`Note: If you haven't authenticated yet, run 'npx letsfg auth' in your terminal first to get your free token.`);
});
