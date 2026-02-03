/**
 * Application principale - Gestion des paiements universitaires
 */

// État de l'application
const AppState = {
    isOnline: true,
    lastSync: null,
    pendingOperations: []
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de UniPay...');
    
    // Vérifier l'état de connexion
    checkOnlineStatus();
    
    // Initialiser l'interface
    UI.init();
    
    // Configurer les événements
    setupEventListeners();
    
    // Écouter les changements de connexion
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    console.log('✅ UniPay prêt !');
    console.log('📡 Mode:', AppState.isOnline ? 'En ligne' : 'Hors ligne');
});

// Vérifier l'état de connexion
function checkOnlineStatus() {
    AppState.isOnline = navigator.onLine;
    updateOnlineStatus();
}

// Gérer le passage en ligne
function handleOnline() {
    AppState.isOnline = true;
    updateOnlineStatus();
    Utils.showToast('✅ Connexion rétablie - Mode en ligne', 'success');
}

// Gérer le passage hors ligne
function handleOffline() {
    AppState.isOnline = false;
    updateOnlineStatus();
    Utils.showToast('📡 Mode hors ligne activé - Les données sont sauvegardées localement', 'warning');
}

// Mettre à jour l'indicateur de statut
function updateOnlineStatus() {
    const statusIndicator = document.getElementById('currentDate');
    if (statusIndicator) {
        const now = new Date();
        const dateText = now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const statusIcon = AppState.isOnline ? '🟢' : '🔴';
        const statusText = AppState.isOnline ? 'En ligne' : 'Hors ligne';
        statusIndicator.innerHTML = `${dateText} <span style="margin-left: 1rem;">${statusIcon} ${statusText}</span>`;
    }
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Bouton données de test
    document.getElementById('seedDataBtn').addEventListener('click', () => {
        Utils.generateSeedData();
    });

    // Bouton ajouter étudiant
    document.getElementById('addStudentBtn').addEventListener('click', () => {
        UI.openStudentModal();
    });

    // Formulaire étudiant
    document.getElementById('studentForm').addEventListener('submit', handleStudentSubmit);

    // Recherche étudiant
    const searchInput = document.getElementById('searchStudent');
    searchInput.addEventListener('input', Utils.debounce((e) => {
        searchStudents(e.target.value);
    }, 300));

    // Bouton générer échéances
    document.getElementById('generateEcheancesBtn').addEventListener('click', () => {
        UI.openEcheancesModal();
    });

    // Formulaire échéances
    document.getElementById('echeancesForm').addEventListener('submit', handleEcheancesSubmit);

    // Bouton nouveau paiement
    document.getElementById('addPaymentBtn').addEventListener('click', () => {
        UI.openPaymentModal();
    });

    // Formulaire paiement
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);

    // Changement d'étudiant dans le formulaire de paiement
    document.getElementById('paymentStudent').addEventListener('change', (e) => {
        if (e.target.value) {
            UI.loadEcheancesForPayment(e.target.value);
        }
    });

    // Changement du montant de paiement
    document.getElementById('paymentMontant').addEventListener('input', () => {
        UI.updateResteAPayer();
    });

    // Bouton lancer contrôle
    document.getElementById('runControleBtn').addEventListener('click', runControleFinancier);

    // Bouton appliquer filtres
    document.getElementById('applyFiltersBtn').addEventListener('click', applyReportingFilters);

    // Bouton exporter CSV
    document.getElementById('exportCSVBtn').addEventListener('click', exportReportingCSV);
}

// Gestion de la soumission du formulaire étudiant
function handleStudentSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value;
    const nom = document.getElementById('studentNom').value.trim();
    const prenom = document.getElementById('studentPrenom').value.trim();
    const dateNaissance = document.getElementById('studentDateNaissance').value;
    const email = document.getElementById('studentEmail').value.trim();
    const telephone = document.getElementById('studentTelephone').value.trim();

    // Validation
    if (!Utils.isValidEmail(email)) {
        Utils.showToast('Email invalide', 'error');
        return;
    }

    if (!Utils.isValidPhone(telephone)) {
        Utils.showToast('Téléphone invalide', 'error');
        return;
    }

    if (id) {
        // Modification
        Storage.updateEtudiant(id, { nom, prenom, date_naissance: dateNaissance, email, telephone });
        Utils.showToast('Étudiant modifié avec succès', 'success');
    } else {
        // Création
        const etudiant = new Etudiant(nom, prenom, dateNaissance, email, telephone);
        Storage.addEtudiant(etudiant);
        Utils.showToast('Étudiant ajouté avec succès', 'success');
    }

    // Fermer la modale et recharger
    document.getElementById('studentModal').classList.remove('active');
    UI.loadStudents();
    UI.loadDashboard();
}

// Recherche d'étudiants
function searchStudents(query) {
    const etudiants = Storage.getEtudiants();
    const filtered = etudiants.filter(e => {
        const searchText = `${e.nom} ${e.prenom} ${e.email} ${e.telephone}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    });

    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML = '';

    filtered.forEach(etudiant => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${etudiant.id_etudiant}</td>
            <td>${etudiant.nom}</td>
            <td>${etudiant.prenom}</td>
            <td>${etudiant.email}</td>
            <td>${etudiant.telephone}</td>
            <td>
                <button class="btn-primary btn-small" onclick="UI.editStudent('${etudiant.id_etudiant}')">Modifier</button>
                <button class="btn-danger btn-small" onclick="UI.deleteStudent('${etudiant.id_etudiant}')">Supprimer</button>
            </td>
        `;
    });
}

// Gestion de la soumission du formulaire échéances
function handleEcheancesSubmit(e) {
    e.preventDefault();

    const etudiantId = document.getElementById('echeanceStudent').value;
    const montantTotal = parseFloat(document.getElementById('echeanceMontantTotal').value);
    const nombreEcheances = parseInt(document.getElementById('echeanceNombre').value);
    const dateDebut = document.getElementById('echeanceDateDebut').value;
    const tauxPenalite = parseFloat(document.getElementById('echeancePenalite').value);

    if (!etudiantId) {
        Utils.showToast('Veuillez sélectionner un étudiant', 'error');
        return;
    }

    // Calculer le montant par échéance
    const montantParEcheance = montantTotal / nombreEcheances;

    // Créer les échéances
    const echeances = [];
    for (let i = 0; i < nombreEcheances; i++) {
        const dateEcheance = Utils.addMonths(dateDebut, i);
        const echeance = new Echeance(etudiantId, montantParEcheance, dateEcheance, tauxPenalite);
        echeances.push(echeance);
    }

    // Sauvegarder
    Storage.addMultipleEcheances(echeances);

    // Créer une transaction
    const etudiant = Storage.getEtudiantById(etudiantId);
    const transaction = new Transaction(
        'echeances',
        `Génération de ${nombreEcheances} échéances - ${etudiant.nom} ${etudiant.prenom}`,
        montantTotal,
        etudiantId
    );
    Storage.addTransaction(transaction);

    Utils.showToast(`${nombreEcheances} échéances générées avec succès`, 'success');

    // Fermer la modale et recharger
    document.getElementById('echeancesModal').classList.remove('active');
    UI.loadEcheances();
    UI.loadDashboard();
}

// Gestion de la soumission du formulaire paiement
function handlePaymentSubmit(e) {
    e.preventDefault();

    const etudiantId = document.getElementById('paymentStudent').value;
    const montant = parseFloat(document.getElementById('paymentMontant').value);
    const modePaiement = document.getElementById('paymentMode').value;

    // Validation des données
    if (!etudiantId) {
        Utils.showToast('Veuillez sélectionner un étudiant', 'error');
        return;
    }

    if (!montant || montant <= 0 || isNaN(montant)) {
        Utils.showToast('Montant invalide', 'error');
        return;
    }

    if (!modePaiement) {
        Utils.showToast('Veuillez sélectionner un mode de paiement', 'error');
        return;
    }

    // Récupérer les échéances sélectionnées
    const checkboxes = document.querySelectorAll('#echeancesCheckboxes input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        Utils.showToast('Veuillez sélectionner au moins une échéance', 'error');
        return;
    }

    try {
        // Créer le paiement
        const paiement = new Paiement(etudiantId, montant, modePaiement);
        paiement.changerStatut('en_attente');

        let montantRestant = montant;
        const echeancesPayees = [];
        const penalitesAppliquees = [];
        let montantTotalEcheances = 0;

        // Calculer le montant total des échéances sélectionnées
        checkboxes.forEach(checkbox => {
            const echeanceId = checkbox.value;
            const echeance = Storage.getEcheanceById(echeanceId);
            if (echeance) {
                echeance.calculerPenalite();
                montantTotalEcheances += echeance.getMontantTotal();
            }
        });

        // Vérifier si le montant est suffisant
        if (montant < montantTotalEcheances) {
            const confirmation = Utils.confirm(
                `Le montant payé (${Utils.formatMontant(montant)}) est inférieur au total des échéances (${Utils.formatMontant(montantTotalEcheances)}).\n\n` +
                `Reste à payer: ${Utils.formatMontant(montantTotalEcheances - montant)}\n\n` +
                `Voulez-vous continuer avec un paiement partiel ?`
            );
            if (!confirmation) {
                return;
            }
        }

        // Traiter chaque échéance
        checkboxes.forEach(checkbox => {
            const echeanceId = checkbox.value;
            const echeance = Storage.getEcheanceById(echeanceId);
            
            if (echeance && montantRestant > 0) {
                echeance.calculerPenalite();
                const montantTotal = echeance.getMontantTotal();

                if (montantRestant >= montantTotal) {
                    // Paiement complet de l'échéance
                    echeance.marquerPayee();
                    Storage.updateEcheance(echeanceId, echeance);
                    paiement.ajouterEcheance(echeanceId);
                    echeancesPayees.push(echeance);
                    montantRestant -= montantTotal;

                    // Si pénalité, créer l'enregistrement
                    if (echeance.montant_penalite > 0) {
                        const penalite = new Penalite(
                            'retard',
                            echeance.montant_penalite,
                            `Retard de paiement - Échéance du ${Utils.formatDateShort(echeance.date_echeance)}`,
                            etudiantId,
                            echeanceId
                        );
                        Storage.addPenalite(penalite);
                        paiement.ajouterPenalite(penalite.id_penalite);
                        penalitesAppliquees.push(penalite);
                    }
                } else if (montantRestant > 0) {
                    // Paiement partiel de cette échéance
                    paiement.ajouterEcheance(echeanceId);
                    montantRestant = 0;
                }
            }
        });

        // Déterminer le statut final
        if (echeancesPayees.length === checkboxes.length && montantRestant >= 0) {
            paiement.changerStatut('valide');
        } else {
            paiement.changerStatut('partiel');
        }

        // Sauvegarder le paiement
        const paiementSaved = Storage.addPaiement(paiement);
        if (!paiementSaved) {
            throw new Error('Erreur lors de la sauvegarde du paiement');
        }

        // Créer la quittance
        const quittance = new Quittance(paiement.id_paiement, etudiantId, montant);
        const quittanceSaved = Storage.addQuittance(quittance);
        if (!quittanceSaved) {
            throw new Error('Erreur lors de la création de la quittance');
        }
        
        paiement.quittance_id = quittance.id_quittance;
        Storage.updatePaiement(paiement.id_paiement, paiement);

        // Créer les transactions
        const etudiant = Storage.getEtudiantById(etudiantId);
        
        const transactionPaiement = new Transaction(
            'paiement',
            `Paiement ${modePaiement} - ${etudiant.nom} ${etudiant.prenom}`,
            montant,
            etudiantId
        );
        Storage.addTransaction(transactionPaiement);

        // Transactions pour les pénalités
        penalitesAppliquees.forEach(pen => {
            const transactionPenalite = new Transaction(
                'penalite',
                `Pénalité de retard - ${etudiant.nom} ${etudiant.prenom}`,
                pen.montant,
                etudiantId
            );
            Storage.addTransaction(transactionPenalite);
        });

        // Message de succès détaillé
        let successMessage = 'Paiement enregistré avec succès';
        if (paiement.statut === 'partiel') {
            successMessage += ` (Paiement partiel - Reste: ${Utils.formatMontant(montantTotalEcheances - montant)})`;
        }
        if (penalitesAppliquees.length > 0) {
            const totalPenalites = penalitesAppliquees.reduce((sum, p) => sum + p.montant, 0);
            successMessage += ` - Pénalités: ${Utils.formatMontant(totalPenalites)}`;
        }
        
        Utils.showToast(successMessage, 'success');

        // Fermer la modale et recharger
        document.getElementById('paymentModal').classList.remove('active');
        UI.loadPayments();
        UI.loadEcheances();
        UI.loadDashboard();

        // Proposer d'imprimer la quittance
        setTimeout(() => {
            if (Utils.confirm('Voulez-vous imprimer la quittance maintenant ?')) {
                UI.printQuittance(quittance.id_quittance);
            }
        }, 500);

    } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        Utils.showToast('Erreur lors de l\'enregistrement du paiement: ' + error.message, 'error');
    }
}

// Lancer un contrôle financier
function runControleFinancier() {
    const controle = new ControleFinancier('coherence');

    // Vérifier la cohérence des paiements
    const paiements = Storage.getPaiements();
    const echeances = Storage.getEcheances();

    paiements.forEach(paiement => {
        // Vérifier que les échéances existent
        paiement.echeances.forEach(echeanceId => {
            const echeance = Storage.getEcheanceById(echeanceId);
            if (!echeance) {
                controle.ajouterAnomalie(
                    `Paiement ${paiement.id_paiement}: Échéance ${echeanceId} introuvable`,
                    'elevee'
                );
            }
        });

        // Vérifier que l'étudiant existe
        const etudiant = Storage.getEtudiantById(paiement.etudiant_id);
        if (!etudiant) {
            controle.ajouterAnomalie(
                `Paiement ${paiement.id_paiement}: Étudiant ${paiement.etudiant_id} introuvable`,
                'elevee'
            );
        }
    });

    // Vérifier les échéances en retard sans pénalité
    echeances.forEach(echeance => {
        if (!echeance.payee && Utils.isPastDate(echeance.date_echeance)) {
            echeance.calculerPenalite();
            if (echeance.penalite_applicable && echeance.montant_penalite === 0) {
                controle.ajouterAnomalie(
                    `Échéance ${echeance.id_echeance}: En retard mais pénalité non calculée`,
                    'moyenne'
                );
            }
        }
    });

    // Vérifier les paiements sans quittance
    paiements.forEach(paiement => {
        const quittances = Storage.getQuittances();
        const quittance = quittances.find(q => q.paiement_id === paiement.id_paiement);
        if (!quittance) {
            controle.ajouterAnomalie(
                `Paiement ${paiement.id_paiement}: Aucune quittance générée`,
                'moyenne'
            );
        }
    });

    controle.finaliser();
    Storage.addControle(controle);

    Utils.showToast(
        controle.resultat === 'ok' 
            ? 'Contrôle terminé: Aucune anomalie détectée' 
            : `Contrôle terminé: ${controle.anomalies.length} anomalie(s) détectée(s)`,
        controle.resultat === 'ok' ? 'success' : 'warning'
    );

    UI.loadControle();
}

// Appliquer les filtres de reporting
function applyReportingFilters() {
    const dateStart = document.getElementById('filterDateStart').value;
    const dateEnd = document.getElementById('filterDateEnd').value;
    const etudiantId = document.getElementById('filterStudent').value;

    let transactions = Storage.getTransactions();

    // Filtrer par date
    if (dateStart) {
        transactions = transactions.filter(t => new Date(t.date) >= new Date(dateStart));
    }
    if (dateEnd) {
        transactions = transactions.filter(t => new Date(t.date) <= new Date(dateEnd));
    }

    // Filtrer par étudiant
    if (etudiantId) {
        transactions = transactions.filter(t => t.etudiant_id === etudiantId);
    }

    // Afficher les résultats
    const tbody = document.querySelector('#reportingTable tbody');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const etudiant = transaction.etudiant_id ? Storage.getEtudiantById(transaction.etudiant_id) : null;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${Utils.formatDateShort(transaction.date)}</td>
            <td>${transaction.type}</td>
            <td>${etudiant ? etudiant.nom + ' ' + etudiant.prenom : '-'}</td>
            <td>${Utils.formatMontant(transaction.montant)}</td>
            <td>${transaction.description}</td>
        `;
    });

    Utils.showToast(`${transactions.length} transaction(s) trouvée(s)`, 'info');
}

// Exporter le reporting en CSV
function exportReportingCSV() {
    const transactions = Storage.getTransactions();
    
    const data = transactions.map(t => {
        const etudiant = t.etudiant_id ? Storage.getEtudiantById(t.etudiant_id) : null;
        return {
            Date: Utils.formatDateShort(t.date),
            Type: t.type,
            Etudiant: etudiant ? `${etudiant.nom} ${etudiant.prenom}` : '-',
            Montant: t.montant,
            Description: t.description
        };
    });

    const filename = `reporting_${new Date().toISOString().split('T')[0]}.csv`;
    Utils.exportToCSV(data, filename);
}
