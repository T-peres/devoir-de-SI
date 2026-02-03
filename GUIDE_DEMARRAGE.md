# 🚀 Guide de Démarrage Rapide - UniPay

## Démarrage en 3 Minutes

### Étape 1 : Ouvrir l'Application
1. Double-cliquez sur `index.html`
2. L'application s'ouvre dans votre navigateur

### Étape 2 : Charger les Données de Test
1. Cliquez sur le bouton **"Données de test"** en bas de la sidebar
2. Confirmez l'action
3. L'application se recharge avec des données exemples

### Étape 3 : Explorer les Fonctionnalités
Vous avez maintenant accès à :
- 5 étudiants fictifs
- 15 échéances (3 par étudiant)
- Plusieurs paiements déjà effectués
- Des pénalités de retard
- Des quittances générées

## 📚 Scénarios d'Utilisation

### Scénario 1 : Inscription d'un Nouvel Étudiant

**Objectif** : Ajouter un étudiant et créer son plan de paiement

1. **Ajouter l'étudiant**
   - Menu → Étudiants
   - Cliquez "+ Ajouter Étudiant"
   - Remplissez :
     - Nom : Diop
     - Prénom : Moussa
     - Date de naissance : 01/01/2001
     - Email : moussa.diop@univ.edu
     - Téléphone : +221 77 999 88 77
   - Enregistrer

2. **Créer les échéances**
   - Menu → Échéances
   - Cliquez "Générer Échéances"
   - Sélectionnez : Diop Moussa
   - Montant total : 600000 FCFA
   - Nombre d'échéances : 3
   - Date première échéance : (mois prochain)
   - Taux pénalité : 5%
   - Générer

3. **Résultat**
   - 3 échéances créées automatiquement
   - Montant par échéance : 200000 FCFA
   - Espacées d'un mois chacune

### Scénario 2 : Enregistrer un Paiement

**Objectif** : Un étudiant vient payer une ou plusieurs échéances

1. **Accéder aux paiements**
   - Menu → Paiements
   - Cliquez "+ Nouveau Paiement"

2. **Remplir le formulaire**
   - Étudiant : Sélectionnez l'étudiant
   - Montant : 200000 FCFA
   - Mode : Virement
   - Cochez les échéances à payer

3. **Vérifier**
   - Le "Reste à payer" s'affiche automatiquement
   - Si montant insuffisant, il sera indiqué

4. **Valider**
   - Cliquez "Valider Paiement"
   - Une notification confirme l'enregistrement
   - Proposition d'imprimer la quittance

5. **Résultat**
   - Paiement enregistré
   - Échéances marquées comme payées
   - Quittance générée automatiquement
   - Transaction ajoutée à l'historique

### Scénario 3 : Gérer les Retards de Paiement

**Objectif** : Identifier et traiter les étudiants en retard

1. **Consulter le tableau de bord**
   - Menu → Tableau de bord
   - Regardez "Étudiants en Retard"
   - Regardez "Pénalités"

2. **Voir les échéances en retard**
   - Menu → Échéances
   - Les cartes rouges = échéances en retard
   - La pénalité est affichée en rouge

3. **Enregistrer un paiement avec pénalité**
   - Menu → Paiements → + Nouveau Paiement
   - Sélectionnez l'étudiant en retard
   - Les échéances en retard affichent la pénalité
   - Le montant total inclut automatiquement la pénalité
   - Validez le paiement

4. **Résultat**
   - Pénalité appliquée et enregistrée
   - Transaction de pénalité créée
   - Quittance inclut le détail de la pénalité

### Scénario 4 : Imprimer une Quittance

**Objectif** : Fournir une preuve de paiement à l'étudiant

1. **Méthode 1 : Depuis les Paiements**
   - Menu → Paiements
   - Cliquez "Quittance" sur la ligne du paiement
   - Une nouvelle fenêtre s'ouvre

2. **Méthode 2 : Depuis les Quittances**
   - Menu → Quittances
   - Cliquez "Imprimer" sur la quittance souhaitée

3. **Imprimer ou Télécharger**
   - Cliquez sur "Imprimer / Télécharger PDF"
   - OU utilisez Ctrl+P (Cmd+P sur Mac)
   - Choisissez "Enregistrer au format PDF"
   - Sélectionnez l'emplacement de sauvegarde

4. **Contenu de la Quittance**
   - Référence unique
   - Informations de l'étudiant
   - Date d'émission
   - Détail des échéances payées
   - Montant des pénalités (si applicable)
   - Montant total payé

### Scénario 5 : Contrôle Financier

**Objectif** : Vérifier la cohérence des données

1. **Lancer le contrôle**
   - Menu → Contrôle Financier
   - Cliquez "Lancer Contrôle"

2. **Vérifications effectuées**
   - Cohérence paiements ↔ échéances
   - Existence des étudiants
   - Échéances en retard sans pénalité
   - Paiements sans quittance
   - Intégrité des données

3. **Résultats**
   - ✅ OK : Aucune anomalie
   - ⚠️ Anomalies détectées : Liste des problèmes
   - Gravité : Faible, Moyenne, Élevée

4. **Actions correctives**
   - Consultez les anomalies
   - Corrigez les données si nécessaire
   - Relancez le contrôle

### Scénario 6 : Générer un Rapport

**Objectif** : Exporter les transactions pour analyse

1. **Accéder au reporting**
   - Menu → Reporting
   - Toutes les transactions sont affichées

2. **Appliquer des filtres (optionnel)**
   - Date début : 01/01/2024
   - Date fin : 31/12/2024
   - Étudiant : (sélectionner un étudiant spécifique)
   - Cliquez "Filtrer"

3. **Exporter en CSV**
   - Cliquez "Exporter CSV"
   - Le fichier est téléchargé automatiquement
   - Nom : `reporting_YYYY-MM-DD.csv`

4. **Utiliser le CSV**
   - Ouvrez avec Excel, Google Sheets, etc.
   - Analysez les données
   - Créez des graphiques
   - Partagez avec la comptabilité

## 🎯 Cas d'Usage Avancés

### Paiement Partiel

**Situation** : Un étudiant ne peut payer que 150000 FCFA au lieu de 200000 FCFA

1. Créez le paiement avec le montant disponible (150000)
2. Sélectionnez l'échéance de 200000 FCFA
3. Le système affiche "Reste à payer : 50000 FCFA"
4. Validez quand même
5. Le paiement est marqué "partiel"
6. L'échéance reste "non payée" jusqu'au solde complet

### Paiement Multiple

**Situation** : Un étudiant paie plusieurs échéances en une fois

1. Créez le paiement avec le montant total (ex: 600000 FCFA)
2. Cochez les 3 échéances de 200000 FCFA chacune
3. Le système calcule automatiquement
4. Validez
5. Les 3 échéances sont marquées "payées"
6. Une seule quittance est générée pour tout

### Recherche d'Étudiant

**Situation** : Trouver rapidement un étudiant parmi des centaines

1. Menu → Étudiants
2. Tapez dans la barre de recherche :
   - Nom : "Diallo"
   - Prénom : "Amadou"
   - Email : "amadou@"
   - Téléphone : "77 123"
3. Les résultats s'affichent en temps réel
4. Pas besoin de cliquer sur un bouton

## 💡 Astuces et Conseils

### Astuce 1 : Mode Sombre
- Cliquez sur l'icône 🌙 en bas de la sidebar
- Parfait pour travailler le soir
- Le choix est sauvegardé automatiquement

### Astuce 2 : Navigation Rapide
- Utilisez les icônes dans la sidebar
- Chaque page se charge instantanément
- Les données sont toujours à jour

### Astuce 3 : Notifications
- Surveillez les notifications en haut à droite
- ✓ Vert = Succès
- ✗ Rouge = Erreur
- ⚠ Orange = Avertissement
- ℹ Bleu = Information

### Astuce 4 : Sauvegarde Automatique
- Toutes les données sont sauvegardées automatiquement
- Pas besoin de cliquer sur "Enregistrer"
- Fermez et rouvrez : vos données sont là

### Astuce 5 : Réinitialisation
- Pour repartir de zéro :
  - F12 → Console
  - Tapez : `localStorage.clear()`
  - Rechargez la page
- Ou rechargez les données de test

## 🔍 Comprendre le Tableau de Bord

### Total Encaissé 💵
- Somme de tous les paiements validés
- Inclut les pénalités payées
- Mis à jour en temps réel

### En Attente ⏳
- Somme des échéances non payées
- N'inclut PAS les pénalités futures
- Indicateur de revenus à venir

### Étudiants en Retard ⚠️
- Nombre d'étudiants avec au moins une échéance dépassée
- Un étudiant n'est compté qu'une fois
- Nécessite un suivi prioritaire

### Pénalités 🚨
- Somme de toutes les pénalités appliquées
- Inclut les pénalités payées et non payées
- Indicateur de retards de paiement

### Graphique des Paiements
- Évolution des 6 derniers mois
- Montant total par mois
- Visualisation rapide des tendances

## 📋 Checklist Quotidienne

### Matin
- [ ] Consulter le tableau de bord
- [ ] Vérifier les étudiants en retard
- [ ] Consulter les échéances du jour

### Après Chaque Paiement
- [ ] Enregistrer le paiement
- [ ] Imprimer la quittance
- [ ] Vérifier que l'échéance est marquée "payée"

### Fin de Journée
- [ ] Lancer un contrôle financier
- [ ] Vérifier les anomalies
- [ ] Exporter le reporting si nécessaire

### Fin de Mois
- [ ] Exporter le reporting mensuel
- [ ] Analyser les statistiques
- [ ] Identifier les étudiants en retard persistant

## ❓ FAQ

**Q : Les données sont-elles sauvegardées ?**
R : Oui, automatiquement dans le LocalStorage de votre navigateur.

**Q : Puis-je utiliser l'application hors ligne ?**
R : Oui, totalement ! Aucune connexion internet requise.

**Q : Comment sauvegarder mes données ?**
R : Les données sont dans le navigateur. Pour une sauvegarde externe, exportez en CSV régulièrement.

**Q : Puis-je modifier une échéance déjà créée ?**
R : Actuellement non. Créez de nouvelles échéances si nécessaire.

**Q : Que se passe-t-il si je supprime un étudiant ?**
R : L'étudiant est supprimé mais ses paiements et échéances restent (pour l'historique).

**Q : Puis-je annuler un paiement ?**
R : Actuellement non. Contactez un développeur pour ajouter cette fonctionnalité.

**Q : Comment changer la devise ?**
R : Éditez le fichier `js/utils.js` et modifiez la fonction `formatMontant()`.

**Q : L'application fonctionne-t-elle sur mobile ?**
R : Oui ! L'interface est responsive et s'adapte aux smartphones et tablettes.

## 🎓 Prochaines Étapes

Maintenant que vous maîtrisez les bases :

1. **Personnalisez** : Modifiez les couleurs, la devise, les taux
2. **Explorez** : Testez tous les scénarios
3. **Adaptez** : Ajoutez vos propres fonctionnalités
4. **Partagez** : Formez votre équipe

Bon travail avec UniPay ! 🚀
