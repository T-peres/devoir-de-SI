# 🧪 Instructions de Test - UniPay

## Test Rapide (5 minutes)

### 1. Ouvrir l'Application
```
Double-cliquez sur index.html
```
✅ **Vérification** : L'application s'ouvre dans votre navigateur

### 2. Charger les Données de Test
```
Cliquez sur "Données de test" en bas de la sidebar
Confirmez l'action
```
✅ **Vérification** : 
- Message de succès affiché
- Page rechargée automatiquement
- Statistiques affichées dans le tableau de bord

### 3. Vérifier le Tableau de Bord
```
Menu → Tableau de bord
```
✅ **Vérifications** :
- Total Encaissé > 0 FCFA
- Total en Attente > 0 FCFA
- Étudiants en Retard > 0
- Pénalités > 0 FCFA
- Graphique affiché

### 4. Consulter les Étudiants
```
Menu → Étudiants
```
✅ **Vérifications** :
- 5 étudiants affichés
- Colonnes : ID, Nom, Prénom, Email, Téléphone, Actions
- Boutons "Modifier" et "Supprimer" présents

### 5. Consulter les Échéances
```
Menu → Échéances
```
✅ **Vérifications** :
- Plusieurs cartes d'échéances affichées
- Cartes vertes (payées), oranges (en attente), rouges (en retard)
- Informations : étudiant, date, montant, pénalité

### 6. Consulter les Paiements
```
Menu → Paiements
```
✅ **Vérifications** :
- Plusieurs paiements affichés
- Colonnes : ID, Date, Étudiant, Montant, Mode, Statut, Actions
- Bouton "Quittance" présent

### 7. Tester l'Impression d'une Quittance
```
Menu → Paiements
Cliquez sur "Quittance" sur n'importe quelle ligne
```
✅ **Vérifications** :
- Nouvelle fenêtre s'ouvre
- Quittance formatée affichée
- Bouton "Imprimer / Télécharger PDF" présent
- Informations complètes : référence, étudiant, montant, échéances

## Test Complet (15 minutes)

### Test 1 : Ajouter un Étudiant

**Étapes** :
1. Menu → Étudiants
2. Cliquez "+ Ajouter Étudiant"
3. Remplissez :
   - Nom : TEST
   - Prénom : Utilisateur
   - Date de naissance : 01/01/2000
   - Email : test@univ.edu
   - Téléphone : +221 77 000 00 00
4. Cliquez "Enregistrer"

**Résultats attendus** :
- ✅ Notification "Étudiant ajouté avec succès"
- ✅ Modale se ferme
- ✅ Nouvel étudiant apparaît dans la liste
- ✅ Toutes les informations sont correctes

### Test 2 : Générer des Échéances

**Étapes** :
1. Menu → Échéances
2. Cliquez "Générer Échéances"
3. Remplissez :
   - Étudiant : TEST Utilisateur
   - Montant Total : 300000
   - Nombre d'Échéances : 3
   - Date Première Échéance : (mois prochain)
   - Taux Pénalité : 5
4. Cliquez "Générer"

**Résultats attendus** :
- ✅ Notification "3 échéances générées avec succès"
- ✅ Modale se ferme
- ✅ 3 nouvelles cartes d'échéances apparaissent
- ✅ Montant par échéance : 100000 FCFA
- ✅ Dates espacées d'un mois

### Test 3 : Enregistrer un Paiement Simple

**Étapes** :
1. Menu → Paiements
2. Cliquez "+ Nouveau Paiement"
3. Remplissez :
   - Étudiant : TEST Utilisateur
   - Montant : 100000
   - Mode : Espèces
4. Cochez la première échéance
5. Vérifiez "Reste à payer : 0 FCFA"
6. Cliquez "Valider Paiement"
7. Confirmez l'impression de la quittance

**Résultats attendus** :
- ✅ Notification "Paiement enregistré avec succès"
- ✅ Modale se ferme
- ✅ Nouveau paiement dans la liste
- ✅ Échéance marquée comme payée (carte verte)
- ✅ Quittance s'ouvre dans nouvelle fenêtre
- ✅ Statistiques mises à jour

### Test 4 : Paiement Partiel

**Étapes** :
1. Menu → Paiements
2. Cliquez "+ Nouveau Paiement"
3. Remplissez :
   - Étudiant : TEST Utilisateur
   - Montant : 50000
   - Mode : Mobile Money
4. Cochez la deuxième échéance (100000 FCFA)
5. Vérifiez "Reste à payer : 50000 FCFA"
6. Cliquez "Valider Paiement"

**Résultats attendus** :
- ✅ Notification "Paiement enregistré avec succès"
- ✅ Paiement créé avec statut "partiel"
- ✅ Échéance reste "non payée"
- ✅ Quittance générée pour 50000 FCFA

### Test 5 : Recherche d'Étudiant

**Étapes** :
1. Menu → Étudiants
2. Dans la barre de recherche, tapez : "TEST"
3. Effacez et tapez : "test@"
4. Effacez et tapez : "77 000"

**Résultats attendus** :
- ✅ Résultats filtrés en temps réel
- ✅ Recherche fonctionne sur nom, prénom, email, téléphone
- ✅ Pas de délai perceptible

### Test 6 : Contrôle Financier

**Étapes** :
1. Menu → Contrôle Financier
2. Cliquez "Lancer Contrôle"
3. Attendez quelques secondes
4. Consultez les résultats

**Résultats attendus** :
- ✅ Notification affichée
- ✅ Nouveau contrôle dans la liste
- ✅ Résultat : OK ou Anomalies détectées
- ✅ Nombre d'anomalies affiché

### Test 7 : Reporting et Export CSV

**Étapes** :
1. Menu → Reporting
2. Sélectionnez des filtres :
   - Date début : (il y a 1 mois)
   - Date fin : (aujourd'hui)
   - Étudiant : TEST Utilisateur
3. Cliquez "Filtrer"
4. Cliquez "Exporter CSV"

**Résultats attendus** :
- ✅ Transactions filtrées affichées
- ✅ Notification du nombre de transactions
- ✅ Fichier CSV téléchargé
- ✅ Nom du fichier : reporting_YYYY-MM-DD.csv
- ✅ Fichier ouvrable dans Excel

### Test 8 : Mode Sombre

**Étapes** :
1. Cliquez sur l'icône 🌙 en bas de la sidebar
2. Naviguez entre les pages
3. Cliquez à nouveau sur 🌙

**Résultats attendus** :
- ✅ Interface passe en mode sombre
- ✅ Tous les éléments sont lisibles
- ✅ Retour au mode clair fonctionne
- ✅ Préférence sauvegardée (rechargez la page)

### Test 9 : Responsive (Mobile)

**Étapes** :
1. Ouvrez les outils de développement (F12)
2. Activez le mode responsive
3. Testez différentes tailles :
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

**Résultats attendus** :
- ✅ Sidebar se réduit sur mobile
- ✅ Tableaux défilent horizontalement
- ✅ Cartes s'empilent verticalement
- ✅ Boutons restent accessibles
- ✅ Texte reste lisible

### Test 10 : Modification d'Étudiant

**Étapes** :
1. Menu → Étudiants
2. Cliquez "Modifier" sur TEST Utilisateur
3. Modifiez :
   - Téléphone : +221 77 111 11 11
4. Cliquez "Enregistrer"

**Résultats attendus** :
- ✅ Notification "Étudiant modifié avec succès"
- ✅ Modale se ferme
- ✅ Nouveau téléphone affiché dans la liste

## Tests de Validation

### Validation Email

**Test** : Essayez d'ajouter un étudiant avec email invalide
```
Email : test@invalide
```
**Résultat attendu** : ❌ Message "Email invalide"

### Validation Téléphone

**Test** : Essayez d'ajouter un étudiant avec téléphone invalide
```
Téléphone : 123
```
**Résultat attendu** : ❌ Message "Téléphone invalide"

### Validation Montant

**Test** : Essayez de créer un paiement avec montant négatif
```
Montant : -1000
```
**Résultat attendu** : ❌ Champ invalide (HTML5 validation)

### Validation Échéances

**Test** : Essayez de créer un paiement sans sélectionner d'échéance
```
Montant : 100000
Échéances : (aucune cochée)
```
**Résultat attendu** : ❌ Message "Veuillez sélectionner au moins une échéance"

## Tests de Pénalités

### Test Pénalité Automatique

**Étapes** :
1. Créez un étudiant
2. Générez une échéance avec date passée :
   - Date : (il y a 1 mois)
   - Montant : 100000
   - Taux pénalité : 5%
3. Menu → Échéances
4. Vérifiez la carte de l'échéance

**Résultats attendus** :
- ✅ Carte rouge (en retard)
- ✅ Pénalité affichée : 5000 FCFA
- ✅ Badge "En retard"

### Test Paiement avec Pénalité

**Étapes** :
1. Menu → Paiements
2. Créez un paiement pour l'échéance en retard
3. Montant : 105000 (100000 + 5000)
4. Validez

**Résultats attendus** :
- ✅ Paiement enregistré
- ✅ Pénalité appliquée
- ✅ Transaction de pénalité créée
- ✅ Quittance inclut la pénalité
- ✅ Statistiques "Pénalités" mises à jour

## Tests de Performance

### Test Chargement

**Étapes** :
1. Rechargez la page (F5)
2. Chronométrez le temps de chargement

**Résultat attendu** : ✅ < 1 seconde

### Test Navigation

**Étapes** :
1. Cliquez rapidement entre toutes les pages
2. Observez la fluidité

**Résultat attendu** : ✅ Changement instantané

### Test Recherche

**Étapes** :
1. Menu → Étudiants
2. Tapez rapidement dans la recherche

**Résultat attendu** : ✅ Filtrage en temps réel sans lag

## Tests de Persistance

### Test Sauvegarde

**Étapes** :
1. Ajoutez un étudiant
2. Fermez le navigateur
3. Rouvrez index.html

**Résultat attendu** : ✅ Étudiant toujours présent

### Test Réinitialisation

**Étapes** :
1. F12 → Console
2. Tapez : `localStorage.clear()`
3. Rechargez la page

**Résultat attendu** : ✅ Toutes les données effacées

## Checklist Complète

### Interface
- [ ] Sidebar affichée correctement
- [ ] Navigation fonctionne
- [ ] Toutes les pages accessibles
- [ ] Modales s'ouvrent et se ferment
- [ ] Notifications toast apparaissent
- [ ] Mode sombre fonctionne
- [ ] Responsive sur mobile

### Fonctionnalités Étudiants
- [ ] Ajouter étudiant
- [ ] Modifier étudiant
- [ ] Supprimer étudiant
- [ ] Rechercher étudiant
- [ ] Validation email
- [ ] Validation téléphone

### Fonctionnalités Échéances
- [ ] Générer échéances
- [ ] Affichage cartes
- [ ] Calcul pénalités
- [ ] Statuts corrects (payée, en attente, en retard)

### Fonctionnalités Paiements
- [ ] Créer paiement
- [ ] Paiement simple
- [ ] Paiement partiel
- [ ] Paiement multiple
- [ ] Calcul reste à payer
- [ ] Application pénalités

### Fonctionnalités Quittances
- [ ] Génération automatique
- [ ] Référence unique
- [ ] Impression
- [ ] Contenu complet

### Fonctionnalités Contrôle
- [ ] Lancer contrôle
- [ ] Détection anomalies
- [ ] Affichage résultats

### Fonctionnalités Reporting
- [ ] Affichage transactions
- [ ] Filtres par date
- [ ] Filtres par étudiant
- [ ] Export CSV

### Statistiques
- [ ] Total encaissé correct
- [ ] Total en attente correct
- [ ] Étudiants en retard correct
- [ ] Pénalités correctes
- [ ] Graphique affiché

### Persistance
- [ ] Données sauvegardées
- [ ] Données rechargées
- [ ] Réinitialisation fonctionne

## Bugs Connus

Aucun bug connu à ce jour. Si vous en trouvez :
1. Notez les étapes pour reproduire
2. Vérifiez la console (F12)
3. Vérifiez le LocalStorage
4. Documentez le comportement attendu vs réel

## Support

Si un test échoue :
1. Vérifiez que tous les fichiers sont présents
2. Vérifiez la console pour les erreurs
3. Essayez dans un autre navigateur
4. Effacez le cache et rechargez
5. Réinitialisez le LocalStorage

---

**Bonne chance avec vos tests ! 🚀**
