# 💳 UniPay - Gestion des Paiements Universitaires

Application web complète de gestion des paiements universitaires développée en HTML5, CSS3 et JavaScript vanilla (ES6+).

## 🎯 Fonctionnalités

### Gestion des Étudiants
- ✅ Ajouter, modifier et supprimer des étudiants
- ✅ Recherche en temps réel
- ✅ Validation des données (email, téléphone)

### Gestion des Échéances
- ✅ Génération automatique d'échéances multiples
- ✅ Calcul automatique des pénalités de retard
- ✅ Visualisation par cartes avec statuts (payée, en attente, en retard)
- ✅ Taux de pénalité paramétrable

### Gestion des Paiements
- ✅ Enregistrement de paiements (espèces, chèque, virement, mobile money)
- ✅ Paiement partiel accepté
- ✅ Sélection multiple d'échéances
- ✅ Calcul automatique du reste à payer
- ✅ Application automatique des pénalités

### Quittances
- ✅ Génération automatique après chaque paiement
- ✅ Référence unique
- ✅ Impression / Téléchargement PDF (via window.print)
- ✅ Détail des échéances payées avec pénalités

### Contrôle Financier
- ✅ Vérification de cohérence des données
- ✅ Détection d'anomalies
- ✅ Contrôle des échéances en retard
- ✅ Vérification des quittances

### Reporting
- ✅ Historique complet des transactions
- ✅ Filtres par date et étudiant
- ✅ Export CSV
- ✅ Logs horodatés

### Tableau de Bord
- ✅ Total encaissé
- ✅ Total en attente
- ✅ Étudiants en retard
- ✅ Montant des pénalités
- ✅ Graphique des paiements

### Bonus
- ✅ Mode sombre
- ✅ Interface responsive
- ✅ Notifications toast
- ✅ Données de test (seed)
- ✅ Graphiques Canvas
- ✅ LocalStorage pour persistance

## 📦 Structure du Projet

```
unipay/
├── index.html          # Page principale
├── css/
│   └── style.css       # Styles CSS (Flexbox + Grid)
├── js/
│   ├── models.js       # Classes métier (Etudiant, Paiement, etc.)
│   ├── storage.js      # Gestion LocalStorage
│   ├── utils.js        # Fonctions utilitaires
│   ├── ui.js           # Gestion de l'interface
│   └── app.js          # Application principale
└── README.md           # Documentation
```

## 🚀 Installation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Aucun serveur backend requis

### Étapes d'installation

1. **Télécharger les fichiers**
   - Téléchargez tous les fichiers du projet
   - Conservez la structure des dossiers

2. **Ouvrir l'application**
   - Double-cliquez sur `index.html`
   - OU utilisez un serveur local (optionnel) :
     ```bash
     # Avec Python 3
     python -m http.server 8000
     
     # Avec Node.js (http-server)
     npx http-server
     ```

3. **Charger les données de test**
   - Cliquez sur le bouton "Données de test" dans la sidebar
   - Cela génère automatiquement :
     - 5 étudiants
     - Échéances multiples
     - Paiements exemples
     - Pénalités de retard
     - Quittances

## 📖 Guide d'Utilisation

### 1. Ajouter un Étudiant
1. Cliquez sur "Étudiants" dans le menu
2. Cliquez sur "+ Ajouter Étudiant"
3. Remplissez le formulaire
4. Cliquez sur "Enregistrer"

### 2. Générer des Échéances
1. Cliquez sur "Échéances" dans le menu
2. Cliquez sur "Générer Échéances"
3. Sélectionnez un étudiant
4. Définissez :
   - Montant total
   - Nombre d'échéances
   - Date de début
   - Taux de pénalité (%)
5. Cliquez sur "Générer"

### 3. Enregistrer un Paiement
1. Cliquez sur "Paiements" dans le menu
2. Cliquez sur "+ Nouveau Paiement"
3. Sélectionnez un étudiant
4. Saisissez le montant
5. Choisissez le mode de paiement
6. Sélectionnez les échéances à payer
7. Vérifiez le reste à payer
8. Cliquez sur "Valider Paiement"
9. Imprimez la quittance si nécessaire

### 4. Imprimer une Quittance
1. Cliquez sur "Quittances" dans le menu
2. Cliquez sur "Imprimer" pour la quittance souhaitée
3. Utilisez Ctrl+P ou le bouton "Imprimer / Télécharger PDF"
4. Choisissez "Enregistrer au format PDF" dans votre navigateur

### 5. Lancer un Contrôle Financier
1. Cliquez sur "Contrôle Financier" dans le menu
2. Cliquez sur "Lancer Contrôle"
3. Consultez les résultats et anomalies détectées

### 6. Exporter le Reporting
1. Cliquez sur "Reporting" dans le menu
2. Appliquez des filtres si nécessaire (dates, étudiant)
3. Cliquez sur "Exporter CSV"
4. Le fichier est téléchargé automatiquement

## 🔧 Architecture Technique

### Modèles de Données

#### Étudiant
```javascript
{
  id_etudiant: string,
  nom: string,
  prenom: string,
  date_naissance: string,
  email: string,
  telephone: string,
  date_creation: string
}
```

#### Échéance
```javascript
{
  id_echeance: string,
  etudiant_id: string,
  montant: number,
  date_echeance: string,
  taux_penalite: number,
  penalite_applicable: boolean,
  montant_penalite: number,
  payee: boolean,
  date_paiement: string
}
```

#### Paiement
```javascript
{
  id_paiement: string,
  etudiant_id: string,
  montant: number,
  mode_paiement: string,
  date_paiement: string,
  statut: string,
  echeances: array,
  penalites: array,
  quittance_id: string
}
```

#### Quittance
```javascript
{
  id_quittance: string,
  reference: string,
  paiement_id: string,
  etudiant_id: string,
  montant: number,
  date_emission: string
}
```

### Cycle de Vie d'un Paiement

1. **Création** : Paiement enregistré avec montant et mode
2. **Validation** : Vérification des échéances sélectionnées
3. **Application** : Marquage des échéances comme payées
4. **Pénalités** : Calcul et application automatique si retard
5. **Quittance** : Génération automatique
6. **Transaction** : Enregistrement dans l'historique
7. **Archivage** : Stockage dans LocalStorage

### Logique Métier

#### Calcul des Pénalités
```javascript
// Si date actuelle > date échéance ET non payée
penalite = montant_echeance × (taux_penalite / 100)
montant_total = montant_echeance + penalite
```

#### Paiement Partiel
```javascript
// Le montant payé est réparti sur les échéances sélectionnées
// Si montant insuffisant, statut = 'partiel'
// Sinon, statut = 'valide'
```

## 💾 Stockage des Données

Toutes les données sont stockées dans le **LocalStorage** du navigateur :

- `unipay_etudiants` : Liste des étudiants
- `unipay_paiements` : Liste des paiements
- `unipay_echeances` : Liste des échéances
- `unipay_quittances` : Liste des quittances
- `unipay_penalites` : Liste des pénalités
- `unipay_controles` : Liste des contrôles
- `unipay_transactions` : Historique des transactions
- `unipay_settings` : Paramètres de l'application

### Réinitialisation
Pour réinitialiser toutes les données :
1. Ouvrez la console du navigateur (F12)
2. Tapez : `localStorage.clear()`
3. Rechargez la page

## 🎨 Personnalisation

### Modifier les Couleurs
Éditez les variables CSS dans `css/style.css` :
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
}
```

### Modifier le Taux de Pénalité par Défaut
Éditez `js/storage.js` :
```javascript
const defaultSettings = {
    tauxPenalite: 5, // Changez cette valeur
    devise: 'FCFA'
};
```

### Modifier la Devise
Éditez `js/utils.js` :
```javascript
formatMontant(montant) {
    return montant.toLocaleString('fr-FR') + ' FCFA'; // Changez FCFA
}
```

## 🐛 Dépannage

### Les données ne se sauvegardent pas
- Vérifiez que le LocalStorage est activé dans votre navigateur
- Vérifiez que vous n'êtes pas en navigation privée
- Vérifiez l'espace disponible (quota LocalStorage)

### La quittance ne s'imprime pas
- Vérifiez que les popups ne sont pas bloquées
- Essayez un autre navigateur
- Utilisez Ctrl+P manuellement

### Les graphiques ne s'affichent pas
- Vérifiez que Canvas est supporté par votre navigateur
- Rechargez la page
- Générez des données de test

## 📱 Compatibilité

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Responsive (mobile, tablette, desktop)

## 🔒 Sécurité

- Validation côté client des données
- Pas de données sensibles stockées
- Utilisation du LocalStorage (données locales uniquement)
- Pas de connexion réseau requise

## 📝 Licence

Ce projet est fourni à des fins éducatives et de démonstration.

## 👨‍💻 Développement

### Technologies Utilisées
- HTML5
- CSS3 (Flexbox, Grid, Variables CSS)
- JavaScript ES6+ (Classes, Modules, Arrow Functions)
- LocalStorage API
- Canvas API
- Print API

### Bonnes Pratiques
- Code commenté en français
- Architecture MVC simplifiée
- Séparation des responsabilités
- Fonctions réutilisables
- Gestion d'erreurs
- Validation des données

## 🚀 Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Backend avec API REST
- [ ] Base de données (MySQL, PostgreSQL)
- [ ] Envoi d'emails automatiques
- [ ] SMS de rappel
- [ ] Statistiques avancées
- [ ] Multi-devises
- [ ] Multi-langues
- [ ] PWA (Progressive Web App)
- [ ] Synchronisation cloud

## 📞 Support

Pour toute question ou problème, consultez la documentation ou ouvrez une issue.

---

**Développé avec ❤️ pour la gestion universitaire**
