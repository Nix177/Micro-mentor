
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// --- Mock TimeLedger (Blockchain Simulation) ---
// "TimeLedger.py : Grand livre de compte immuable"
const timeLedger = new Map();



// Helper to init user
const getOrCreateWallet = (userId) => {
  if (!timeLedger.has(userId)) {
    // "Boucle virale : Donne 10 min, reçois 10 min"
    // Initial mock balance
    timeLedger.set(userId, { balance: 10, transactions: [] });
  }
  return timeLedger.get(userId);
}

// --- Mock Database for Experts ---
const mentors = [
  { id: 1, name: "Alice", expertise: ["React", "Node"], available: true, responseScore: 95 },
  { id: 2, name: "Bob", expertise: ["Go", "Docker"], available: true, responseScore: 88 },
];

app.get('/', (req, res) => {
  res.send('Flash Mentor API Ready (TimeLedger Active)');
});

// Endpoint to request a mentor
// "ExpertiseMatcher.go : Algorithme de ranking"
app.post('/api/request-help', (req, res) => {
  const { userId, topic, context } = req.body;
  const userStr = userId || "anonymous";

  const wallet = getOrCreateWallet(userStr);

  // Check Funds
  if (wallet.balance < 3) {
    return res.json({ success: false, message: "Solde insuffisant. Devenez mentor pour gagner du temps !" });
  }

  // Matching Logic (Simplifed ExpertiseMatcher)
  // Score = (ResponseTime * 0.6) + (TagsMatch * 0.4) - Mocked here by finding first match
  const match = mentors.find(m => m.expertise.some(e => topic.toLowerCase().includes(e.toLowerCase())) && m.available);

  if (match) {
    // Deduct Time (Smart Contract Simulation)
    wallet.balance -= 3;
    wallet.transactions.push({ type: 'SPEND', amount: 3, timestamp: Date.now() });

    res.json({ success: true, mentor: match, sessionId: Date.now(), remainingBalance: wallet.balance });
  } else {
    res.json({ success: false, message: "Aucun expert disponible pour ce sujet." });
  }
});

const server = app.listen(port, () => {
  console.log(`Flash Mentor Server listening at http://localhost:${port}`);
});

// "RTCBridge.ts" - WebSocket Handling
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('RTCBridge received:', data);
  });
});
