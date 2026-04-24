const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Allows frontend to communicate with backend [cite: 70]
app.use(express.json()); // Parses JSON bodies [cite: 29]
app.use(express.static('.'));

// Dataset: 10+ items [cite: 28, 30]
let weapons = [
  {
    id: 1,
    name: 'M416',
    type: 'AR',
    damage: 41,
    ammo: '5.56mm',
    rarity: 'Common',
  },
  {
    id: 2,
    name: 'AWM',
    type: 'Sniper',
    damage: 105,
    ammo: '.300 Magnum',
    rarity: 'Legendary',
  },
  {
    id: 3,
    name: 'UZI',
    type: 'SMG',
    damage: 26,
    ammo: '9mm',
    rarity: 'Common',
  },
  {
    id: 4,
    name: 'Kar98k',
    type: 'Sniper',
    damage: 79,
    ammo: '7.62mm',
    rarity: 'Rare',
  },
  {
    id: 5,
    name: 'M24',
    type: 'Sniper',
    damage: 75,
    ammo: '7.62mm',
    rarity: 'Rare',
  },
  {
    id: 6,
    name: 'Groza',
    type: 'AR',
    damage: 47,
    ammo: '7.62mm',
    rarity: 'Legendary',
  },
  {
    id: 7,
    name: 'Vector',
    type: 'SMG',
    damage: 31,
    ammo: '9mm',
    rarity: 'Common',
  },
  {
    id: 8,
    name: 'M249',
    type: 'LMG',
    damage: 40,
    ammo: '5.56mm',
    rarity: 'Rare',
  },
  {
    id: 9,
    name: 'P92',
    type: 'Pistol',
    damage: 35,
    ammo: '9mm',
    rarity: 'Common',
  },
  {
    id: 10,
    name: 'Pan',
    type: 'Melee',
    damage: 80,
    ammo: 'None',
    rarity: 'Epic',
  },
];

// --- 10 REQUIRED ENDPOINTS  ---

// 1. GET all weapons [cite: 44]
app.get('/weapons', (req, res) => res.status(200).json(weapons));

// 2. GET weapon by ID [cite: 45]
app.get('/weapons/:id', (req, res) => {
  const weapon = weapons.find((w) => w.id === parseInt(req.params.id));
  if (!weapon) return res.status(404).json({ message: 'Weapon not found' }); // Error Handling [cite: 54, 59]
  res.status(200).json(weapon);
});

// 3. GET weapons by type (Filter) [cite: 49]
app.get('/weapons/type/:type', (req, res) => {
  const filtered = weapons.filter(
    (w) => w.type.toLowerCase() === req.params.type.toLowerCase()
  );
  res.status(200).json(filtered);
});

// 4. GET top damage weapons [cite: 50]
app.get('/top-damage', (req, res) => {
  const top = [...weapons].sort((a, b) => b.damage - a.damage).slice(0, 3);
  res.status(200).json(top);
});

// 5. GET search by name [cite: 51]
app.get('/search', (req, res) => {
  const name = req.query.name || '';
  const results = weapons.filter((w) =>
    w.name.toLowerCase().includes(name.toLowerCase())
  );
  res.status(200).json(results);
});

// 6. GET random weapon [cite: 53]
app.get('/random', (req, res) => {
  const randomIdx = Math.floor(Math.random() * weapons.length);
  res.status(200).json(weapons[randomIdx]);
});

// 7. GET stats summary [cite: 52]
app.get('/stats', (req, res) => {
  res
    .status(200)
    .json({
      total: weapons.length,
      types: [...new Set(weapons.map((w) => w.type))],
    });
});

// 8. POST - Add new weapon [cite: 46]
app.post('/weapons', (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ message: 'Name is required' });
  const newWeapon = { id: weapons.length + 1, ...req.body };
  weapons.push(newWeapon);
  res.status(201).json(newWeapon); // Status 201 for Created [cite: 56]
});

// 9. PUT - Update weapon [cite: 47]
app.put('/weapons/:id', (req, res) => {
  const index = weapons.findIndex((w) => w.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ message: 'Weapon not found' });
  weapons[index] = { ...weapons[index], ...req.body };
  res.status(200).json(weapons[index]);
});

// 10. DELETE - Remove weapon [cite: 48]
app.delete('/weapons/:id', (req, res) => {
  const exists = weapons.some((w) => w.id === parseInt(req.params.id));
  if (!exists) return res.status(404).json({ message: 'Weapon not found' });
  weapons = weapons.filter((w) => w.id !== parseInt(req.params.id));
  res.status(200).json({ message: 'Weapon deleted' });
});

// Deployment Port Configuration [cite: 107, 108]
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
