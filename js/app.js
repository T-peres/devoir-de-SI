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

// Gestion de la soumission du formulaire échéances (tranches globales)
function handleEcheancesSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const trancheId = form.dataset.trancheId;
    
    const nom = document.getElementById('trancheNom').value.trim();
    const montant = parseFloat(document.getElementById('trancheMontant').value);
    const dateEcheance = document.getElementById('echeanceDateDebut').value;
    const tauxPenalite = 5; // Taux fixe de 5%

    if (!nom || !montant || !dateEcheance) {
        Utils.showToast('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    if (trancheId) {
        // Modification
        const tranche = Storage.getTrancheGlobaleById(trancheId);
        tranche.nom = nom;
        tranche.montant = montant;
        tranche.date_echeance = dateEcheance;
        tranche.taux_penalite = tauxPenalite;
        
        Storage.updateTrancheGlobale(trancheId, tranche);
        Utils.showToast('Tranche modifiée avec succès', 'success');
        
        delete form.dataset.trancheId;
    } else {
        // Création
        const tranches = Storage.getTranchesGlobales();
        const numero = tranches.length + 1;
        
        const tranche = new TrancheGlobale(numero, montant, dateEcheance, tauxPenalite);
        tranche.nom = nom;
        
        Storage.addTrancheGlobale(tranche);

        // Créer une transaction
        const transaction = new Transaction(
            'tranche',
            `Création de la tranche globale: ${nom}`,
            montant * Storage.getEtudiants().length
        );
        Storage.addTransaction(transaction);

        Utils.showToast('Tranche globale créée avec succès', 'success');
    }

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

    // Récupérer les échéances/tranches sélectionnées
    const checkboxes = document.querySelectorAll('#echeancesCheckboxes input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
        Utils.showToast('Veuillez sélectionner au moins une tranche', 'error');
        return;
    }

    try {
        // Créer le paiement
        const paiement = new Paiement(etudiantId, montant, modePaiement);
        paiement.changerStatut('en_attente');

        let montantRestant = montant;
        const tranchesPayees = [];
        const penalitesAppliquees = [];
        let montantTotalTranches = 0;

        // Calculer le montant total des tranches sélectionnées
        checkboxes.forEach(checkbox => {
            const trancheId = checkbox.value;
            const tranche = Storage.getTrancheGlobaleById(trancheId);
            if (tranche) {
                montantTotalTranches += tranche.getMontantTotal();
            }
        });

        // Vérifier si le montant est suffisant
        if (montant < montantTotalTranches) {
            const confirmation = Utils.confirm(
                `Le montant payé (${Utils.formatMontant(montant)}) est inférieur au total des tranches (${Utils.formatMontant(montantTotalTranches)}).\n\n` +
                `Reste à payer: ${Utils.formatMontant(montantTotalTranches - montant)}\n\n` +
                `Voulez-vous continuer avec un paiement partiel ?`
            );
            if (!confirmation) {
                return;
            }
        }

        // Traiter chaque tranche
        checkboxes.forEach(checkbox => {
            const trancheId = checkbox.value;
            const tranche = Storage.getTrancheGlobaleById(trancheId);
            
            if (tranche && montantRestant > 0) {
                const penalite = tranche.calculerPenalite();
                const montantTotal = tranche.getMontantTotal();

                if (montantRestant >= montantTotal) {
                    // Paiement complet de la tranche
                    // Créer ou récupérer le PaiementTranche
                    let paiementTranche = Storage.getPaiementsTranches().find(
                        pt => pt.etudiant_id === etudiantId && pt.tranche_id === trancheId
                    );
                    
                    if (!paiementTranche) {
                        paiementTranche = new PaiementTranche(etudiantId, trancheId);
                        Storage.addPaiementTranche(paiementTranche);
                    }
                    
                    paiementTranche.marquerPayee(paiement.id_paiement, tranche.montant, penalite);
                    Storage.updatePaiementTranche(paiementTranche.id_paiement_tranche, paiementTranche);
                    
                    paiement.ajouterEcheance(paiementTranche.id_paiement_tranche);
                    tranchesPayees.push(tranche);
                    montantRestant -= montantTotal;

                    // Si pénalité, créer l'enregistrement
                    if (penalite > 0) {
                        const penaliteObj = new Penalite(
                            'retard',
                            penalite,
                            `Retard de paiement - ${tranche.nom}`,
                            etudiantId,
                            trancheId
                        );
                        Storage.addPenalite(penaliteObj);
                        paiement.ajouterPenalite(penaliteObj.id_penalite);
                        penalitesAppliquees.push(penaliteObj);
                    }
                } else if (montantRestant > 0) {
                    // Paiement partiel de cette tranche
                    let paiementTranche = Storage.getPaiementsTranches().find(
                        pt => pt.etudiant_id === etudiantId && pt.tranche_id === trancheId
                    );
                    
                    if (!paiementTranche) {
                        paiementTranche = new PaiementTranche(etudiantId, trancheId);
                        Storage.addPaiementTranche(paiementTranche);
                    }
                    
                    paiement.ajouterEcheance(paiementTranche.id_paiement_tranche);
                    montantRestant = 0;
                }
            }
        });

        // Déterminer le statut final
        if (tranchesPayees.length === checkboxes.length && montantRestant >= 0) {
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
            successMessage += ` (Paiement partiel - Reste: ${Utils.formatMontant(montantTotalTranches - montant)})`;
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
