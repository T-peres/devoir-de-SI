/**
 * Gestion du stockage local (LocalStorage)
 */

const Storage = {
    // Clés de stockage
    KEYS: {
        ETUDIANTS: 'unipay_etudiants',
        PAIEMENTS: 'unipay_paiements',
        ECHEANCES: 'unipay_echeances',
        QUITTANCES: 'unipay_quittances',
        PENALITES: 'unipay_penalites',
        CONTROLES: 'unipay_controles',
        TRANSACTIONS: 'unipay_transactions',
        SETTINGS: 'unipay_settings'
    },

    // Sauvegarde des données
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erreur de sauvegarde:', error);
            return false;
        }
    },

    // Récupération des données
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erreur de chargement:', error);
            return [];
        }
    },

    // Suppression des données
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erreur de suppression:', error);
            return false;
        }
    },

    // Réinitialisation complète
    clear() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Erreur de réinitialisation:', error);
            return false;
        }
    },

    // === ÉTUDIANTS ===
    getEtudiants() {
        const data = this.load(this.KEYS.ETUDIANTS);
        return data.map(e => Object.assign(new Etudiant(), e));
    },

    saveEtudiants(etudiants) {
        return this.save(this.KEYS.ETUDIANTS, etudiants);
    },

    addEtudiant(etudiant) {
        const etudiants = this.getEtudiants();
        etudiants.push(etudiant);
        return this.saveEtudiants(etudiants);
    },

    updateEtudiant(id, updatedData) {
        const etudiants = this.getEtudiants();
        const index = etudiants.findIndex(e => e.id_etudiant === id);
        if (index !== -1) {
            etudiants[index] = { ...etudiants[index], ...updatedData };
            return this.saveEtudiants(etudiants);
        }
        return false;
    },

    deleteEtudiant(id) {
        const etudiants = this.getEtudiants();
        const filtered = etudiants.filter(e => e.id_etudiant !== id);
        return this.saveEtudiants(filtered);
    },

    getEtudiantById(id) {
        const etudiants = this.getEtudiants();
        const etudiant = etudiants.find(e => e.id_etudiant === id);
        return etudiant ? Object.assign(new Etudiant(), etudiant) : undefined;
    },

    // === PAIEMENTS ===
    getPaiements() {
        const data = this.load(this.KEYS.PAIEMENTS);
        return data.map(p => Object.assign(new Paiement(), p));
    },

    savePaiements(paiements) {
        return this.save(this.KEYS.PAIEMENTS, paiements);
    },

    addPaiement(paiement) {
        const paiements = this.getPaiements();
        paiements.push(paiement);
        return this.savePaiements(paiements);
    },

    getPaiementById(id) {
        const paiements = this.getPaiements();
        const paiement = paiements.find(p => p.id_paiement === id);
        return paiement ? Object.assign(new Paiement(), paiement) : undefined;
    },

    updatePaiement(id, updatedData) {
        const paiements = this.getPaiements();
        const index = paiements.findIndex(p => p.id_paiement === id);
        if (index !== -1) {
            paiements[index] = { ...paiements[index], ...updatedData };
            return this.savePaiements(paiements);
        }
        return false;
    },

    getPaiementsByEtudiant(etudiantId) {
        const paiements = this.getPaiements();
        return paiements.filter(p => p.etudiant_id === etudiantId);
    },

    // === ÉCHÉANCES ===
    getEcheances() {
        const data = this.load(this.KEYS.ECHEANCES);
        return data.map(e => Object.assign(new Echeance(), e));
    },

    saveEcheances(echeances) {
        return this.save(this.KEYS.ECHEANCES, echeances);
    },

    addEcheance(echeance) {
        const echeances = this.getEcheances();
        echeances.push(echeance);
        return this.saveEcheances(echeances);
    },

    addMultipleEcheances(echeancesArray) {
        const echeances = this.getEcheances();
        echeances.push(...echeancesArray);
        return this.saveEcheances(echeances);
    },

    updateEcheance(id, updatedData) {
        const echeances = this.getEcheances();
        const index = echeances.findIndex(e => e.id_echeance === id);
        if (index !== -1) {
            echeances[index] = { ...echeances[index], ...updatedData };
            return this.saveEcheances(echeances);
        }
        return false;
    },

    getEcheanceById(id) {
        const echeances = this.getEcheances();
        const echeance = echeances.find(e => e.id_echeance === id);
        return echeance ? Object.assign(new Echeance(), echeance) : undefined;
    },

    getEcheancesByEtudiant(etudiantId) {
        const echeances = this.getEcheances();
        return echeances.filter(e => e.etudiant_id === etudiantId);
    },

    getEcheancesNonPayees(etudiantId = null) {
        const echeances = this.getEcheances();
        let filtered = echeances.filter(e => !e.payee);
        if (etudiantId) {
            filtered = filtered.filter(e => e.etudiant_id === etudiantId);
        }
        return filtered;
    },

    // === QUITTANCES ===
    getQuittances() {
        const data = this.load(this.KEYS.QUITTANCES);
        return data.map(q => Object.assign(new Quittance(), q));
    },

    saveQuittances(quittances) {
        return this.save(this.KEYS.QUITTANCES, quittances);
    },

    addQuittance(quittance) {
        const quittances = this.getQuittances();
        quittances.push(quittance);
        return this.saveQuittances(quittances);
    },

    getQuittanceById(id) {
        const quittances = this.getQuittances();
        const quittance = quittances.find(q => q.id_quittance === id);
        return quittance ? Object.assign(new Quittance(), quittance) : undefined;
    },

    // === PÉNALITÉS ===
    getPenalites() {
        const data = this.load(this.KEYS.PENALITES);
        return data.map(p => Object.assign(new Penalite(), p));
    },

    savePenalites(penalites) {
        return this.save(this.KEYS.PENALITES, penalites);
    },

    addPenalite(penalite) {
        const penalites = this.getPenalites();
        penalites.push(penalite);
        return this.savePenalites(penalites);
    },

    // === CONTRÔLES ===
    getControles() {
        const data = this.load(this.KEYS.CONTROLES);
        return data.map(c => Object.assign(new ControleFinancier(), c));
    },

    saveControles(controles) {
        return this.save(this.KEYS.CONTROLES, controles);
    },

    addControle(controle) {
        const controles = this.getControles();
        controles.push(controle);
        return this.saveControles(controles);
    },

    // === TRANSACTIONS ===
    getTransactions() {
        const data = this.load(this.KEYS.TRANSACTIONS);
        return data.map(t => Object.assign(new Transaction(), t));
    },

    saveTransactions(transactions) {
        return this.save(this.KEYS.TRANSACTIONS, transactions);
    },

    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transactions.push(transaction);
        return this.saveTransactions(transactions);
    },

    // === SETTINGS ===
    getSettings() {
        const defaultSettings = {
            tauxPenalite: 5,
            devise: 'FCFA',
            darkMode: false,
            autoSave: true,
            offlineMode: true
        };
        const settings = this.load(this.KEYS.SETTINGS);
        return settings.length > 0 ? settings[0] : defaultSettings;
    },

    saveSettings(settings) {
        return this.save(this.KEYS.SETTINGS, [settings]);
    },

    // === PAIEMENTS EN ATTENTE (OFFLINE) ===
    getPendingPayments() {
        return this.load('unipay_pending_payments') || [];
    },

    savePendingPayments(payments) {
        return this.save('unipay_pending_payments', payments);
    },

    addPendingPayment(payment) {
        const pending = this.getPendingPayments();
        pending.push({
            ...payment,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        return this.savePendingPayments(pending);
    },

    removePendingPayment(paymentId) {
        const pending = this.getPendingPayments();
        const filtered = pending.filter(p => p.id_paiement !== paymentId);
        return this.savePendingPayments(filtered);
    },

    // === STATISTIQUES ===
    getStatistiques() {
        const paiements = this.getPaiements();
        const echeances = this.getEcheances();
        const penalites = this.getPenalites();
        const etudiants = this.getEtudiants();

        // Total encaissé
        const totalEncaisse = paiements
            .filter(p => p.statut === 'valide')
            .reduce((sum, p) => sum + p.montant, 0);

        // Total en attente (échéances non payées)
        const totalAttente = echeances
            .filter(e => !e.payee)
            .reduce((sum, e) => sum + e.montant, 0);

        // Étudiants en retard (avec échéances dépassées non payées)
        const today = new Date();
        const etudiantsEnRetard = new Set();
        echeances.forEach(e => {
            if (!e.payee && new Date(e.date_echeance) < today) {
                etudiantsEnRetard.add(e.etudiant_id);
            }
        });

        // Total pénalités
        const totalPenalites = penalites.reduce((sum, p) => sum + p.montant, 0);

        return {
            totalEncaisse,
            totalAttente,
            etudiantsEnRetard: etudiantsEnRetard.size,
            totalPenalites,
            nombreEtudiants: etudiants.length,
            nombrePaiements: paiements.length,
            nombreEcheances: echeances.length
        };
    }
};
