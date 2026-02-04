# Guide de Démarrage Rapide

Le projet est généré, mais vous devez installer les dépendances.

## 1. Installation

Ouvrez un terminal dans `I:\Sites\micro-mentor` :

```bash
# Installation du Client
cd client
npm install

# Installation du Serveur (dans un autre terminal ou après)
cd ../server
npm install
```

## 2. Lancement

**Terminal 1 (Serveur API) :**
```bash
cd server
npm run dev
```
*Le serveur tournera sur http://localhost:3000*

**Terminal 2 (Frontend) :**
```bash
cd client
npm run dev
```
*Le site sera accessible sur l'URL affichée (ex: http://localhost:5173)*

## 3. GitHub
Voir le fichier `GITHUB_SETUP.md` pour les instructions de push.
