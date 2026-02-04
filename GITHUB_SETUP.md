# Comment mettre ce projet sur GitHub

Puisque nous avons créé le dossier localement, voici la procédure pour le connecter à GitHub.

## Étape 1 : Créer le repo sur GitHub
1.  Allez sur [github.com/new](https://github.com/new).
2.  Nom du repository : `micro-mentor` (ou ce que vous préférez).
3.  **Ne cochez pas** "Add a README", "Add .gitignore", ou "Choose a license" (nous avons déjà des fichiers locaux).
4.  Cliquez sur **Create repository**.

## Étape 2 : Connecter votre dossier local
Ouvrez un terminal dans ce dossier (`I:\Sites\micro-mentor`) et lancez les commandes suivantes :

```bash
# 1. Initialiser git (si ce n'est pas déjà fait)
git init

# 2. Ajouter les fichiers
git add .
git commit -m "Initial commit: Project structure and documentation"

# 3. Renommer la branche principale en 'main'
git branch -M main

# 4. Ajouter l'adresse de votre nouveau repo GitHub
# Remplacer <VOTRE_NOM> par votre nom d'utilisateur GitHub
git remote add origin https://github.com/<VOTRE_NOM>/micro-mentor.git

# 5. Envoyer vers GitHub
git push -u origin main
```

## Synchronisation avec GitHub Desktop
1.  Ouvrez **GitHub Desktop**.
2.  Allez dans **File** > **Add Local Repository**.
3.  Choisissez le dossier `I:\Sites\micro-mentor`.
4.  Cliquez sur **Add Repository**.
5.  Comme nous avons déjà configuré le `remote` (l'origine), GitHub Desktop devrait reconnaître la connexion automatiquement.
