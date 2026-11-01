# Wise IPTV TV — Windows Edition 📺

Version Windows native du lecteur IPTV TV avec le même design Leanback que l'application Android TV (Wise IPTV).

---

## 🚀 Comment obtenir les fichiers Windows (.exe) via GitHub Actions

Vous pouvez compiler **WiseIPTV-Setup-1.0.0.exe** (installateur Windows) et **WiseIPTV-1.0.0-portable.exe** (version portable autonome) sur GitHub Actions en 3 étapes :

### Étape 1 : Créer votre dépôt GitHub
1. Téléchargez cette archive ZIP et extrayez-la sur votre ordinateur.
2. Initialisez git et poussez le code sur GitHub :
   ```bash
   git init
   git add .
   git commit -m "feat: Wise IPTV TV Windows"
   git branch -M main
   git remote add origin https://github.com/VOTRE_PSEUDO/wise-iptv-windows.git
   git push -u origin main
   ```

### Étape 2 : Compilation automatique
- Le workflow `.github/workflows/build-electron-windows.yml` se lance immédiatement sur un runner Windows officiel Microsoft (`windows-latest`).
- Il installe les dépendances, compile le bundle Vite, puis exécute `electron-builder --win --x64`.

### Étape 3 : Télécharger vos exécutables .exe
1. Ouvrez l'onglet **Actions** sur votre dépôt GitHub.
2. Cliquez sur le build terminé avec succès (coche verte).
3. Téléchargez l'archive dans la section **Artifacts** : **WiseIPTV-TV-Windows-Executables.zip** !
4. Extrayez et lancez votre application IPTV TV sous Windows !

---

## 💻 Compilation locale (si vous avez un PC Windows)
```bash
npm install
npm run electron:build:win
```
Les fichiers se trouveront dans le dossier `dist-electron/`.
