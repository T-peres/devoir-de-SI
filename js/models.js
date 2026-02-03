/**
 * Modèles de données pour l'application de gestion des paiements universitaires
 */

// Classe Tranche Globale (pour toute l'école)
class TrancheGlobale {
    constructor(numero, montant, dateEcheance, tauxPenalite = 5) {
        this.id_tranche = this.generateId();
        this.numero = numero; // 1, 2, 3...
        this.nom = `Tranche ${numero}`;
        this.montant = montant;
        this.date_echeance = dateEcheance;
        this.taux_penalite = tauxPenalite;
        this.active = true;
        this.date_creation = new Date().toISOString();
    }

    generateId() {
        return 'TRG' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Vérifie si la tranche est en retard
    isOverdue() {
        const today = new Date();
        const echeanceDate = new Date(this.date_echeance);
        return today > echeanceDate;
    }

    // Calcule la pénalité
    calculerPenalite() {
        if (this.isOverdue()) {
            return this.montant * (this.taux_penalite / 100);
        }
        return 0;
    }

    // Obtient le montant total avec pénalité
    getMontantTotal() {
        return this.montant + this.calculerPenalite();
    }
}

// Classe Paiement Tranche (lien entre étudiant et tranche)
class PaiementTranche {
    constructor(etudiantId, trancheId) {
        this.id_paiement_tranche = this.generateId();
        this.etudiant_id = etudiantId;
        this.tranche_id = trancheId;
        this.payee = false;
        this.date_paiement = null;
        this.montant_paye = 0;
        this.penalite_payee = 0;
        this.paiement_id = null; // Référence au paiement
        this.date_creation = new Date().toISOString();
    }

    generateId() {
        return 'PTR' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Marque la tranche comme payée
    marquerPayee(paiementId, montantPaye, penalite = 0) {
        this.payee = true;
        this.date_paiement = new Date().toISOString();
        this.paiement_id = paiementId;
        this.montant_paye = montantPaye;
        this.penalite_payee = penalite;
    }
}

// Classe Étudiant
class Etudiant {
    constructor(nom, prenom, dateNaissance, email, telephone) {
        this.id_etudiant = this.generateId();
        this.nom = nom;
        this.prenom = prenom;
        this.date_naissance = dateNaissance;
        this.email = email;
        this.telephone = telephone;
        this.date_creation = new Date().toISOString();
    }

    generateId() {
        return 'ETU' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    getNomComplet() {
        return `${this.nom} ${this.prenom}`;
    }
}

// Classe Échéance
class Echeance {
    constructor(etudiantId, montant, dateEcheance, tauxPenalite = 5) {
        this.id_echeance = this.generateId();
        this.etudiant_id = etudiantId;
        this.montant = montant;
        this.date_echeance = dateEcheance;
        this.taux_penalite = tauxPenalite;
        this.penalite_applicable = false;
        this.montant_penalite = 0;
        this.payee = false;
        this.date_paiement = null;
        this.date_creation = new Date().toISOString();
    }

    generateId() {
        return 'ECH' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Vérifie si l'échéance est en retard
    isOverdue() {
        if (this.payee) return false;
        const today = new Date();
        const echeanceDate = new Date(this.date_echeance);
        return today > echeanceDate;
    }

    // Calcule la pénalité si en retard
    calculerPenalite() {
        if (this.isOverdue() && !this.payee) {
            this.penalite_applicable = true;
            this.montant_penalite = this.montant * (this.taux_penalite / 100);
            return this.montant_penalite;
        }
        return 0;
    }

    // Marque l'échéance comme payée
    marquerPayee() {
        this.payee = true;
        this.date_paiement = new Date().toISOString();
    }

    // Obtient le montant total (avec pénalité si applicable)
    getMontantTotal() {
        this.calculerPenalite();
        return this.montant + this.montant_penalite;
    }
}

// Classe Paiement
class Paiement {
    constructor(etudiantId, montant, modePaiement) {
        this.id_paiement = this.generateId();
        this.etudiant_id = etudiantId;
        this.montant = montant;
        this.mode_paiement = modePaiement;
        this.date_paiement = new Date().toISOString();
        this.statut = 'valide';
        this.echeances = []; // IDs des échéances payées
        this.penalites = []; // IDs des pénalités appliquées
        this.quittance_id = null;
        this.date_creation = new Date().toISOString();
    }

    generateId() {
        return 'PAY' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Ajoute une échéance au paiement
    ajouterEcheance(echeanceId) {
        if (!this.echeances.includes(echeanceId)) {
            this.echeances.push(echeanceId);
        }
    }

    // Ajoute une pénalité au paiement
    ajouterPenalite(penaliteId) {
        if (!this.penalites.includes(penaliteId)) {
            this.penalites.push(penaliteId);
        }
    }

    // Change le statut du paiement
    changerStatut(nouveauStatut) {
        const statutsValides = ['cree', 'en_attente', 'valide', 'partiel', 'en_retard', 'archive'];
        if (statutsValides.includes(nouveauStatut)) {
            this.statut = nouveauStatut;
        }
    }
}

// Classe Quittance
class Quittance {
    constructor(paiementId, etudiantId, montant) {
        this.id_quittance = this.generateId();
        this.reference = this.generateReference();
        this.paiement_id = paiementId;
        this.etudiant_id = etudiantId;
        this.montant = montant;
        this.date_emission = new Date().toISOString();
    }

    generateId() {
        return 'QUI' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    generateReference() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `QT-${year}${month}-${random}`;
    }

    // Génère le HTML de la quittance pour impression
    genererHTML(etudiant, echeances, paiement) {
        const dateFormatted = new Date(this.date_emission).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const dateSimple = new Date(this.date_emission).toLocaleDateString('fr-FR');

        let echeancesHTML = '';
        let totalMontant = 0;
        let totalPenalite = 0;

        echeances.forEach(ech => {
            const dateEch = new Date(ech.date_echeance).toLocaleDateString('fr-FR');
            totalMontant += ech.montant;
            totalPenalite += ech.montant_penalite || 0;
            
            echeancesHTML += `
                <tr>
                    <td>${dateEch}</td>
                    <td style="text-align: right;">${ech.montant.toLocaleString('fr-FR')} FCFA</td>
                    <td style="text-align: right;">${ech.montant_penalite > 0 ? ech.montant_penalite.toLocaleString('fr-FR') + ' FCFA' : '-'}</td>
                    <td style="text-align: right;">${(ech.montant + (ech.montant_penalite || 0)).toLocaleString('fr-FR')} FCFA</td>
                </tr>
            `;
        });

        // Ligne de total
        echeancesHTML += `
            <tr style="background-color: #f3f4f6; font-weight: bold;">
                <td>TOTAL</td>
                <td style="text-align: right;">${totalMontant.toLocaleString('fr-FR')} FCFA</td>
                <td style="text-align: right;">${totalPenalite > 0 ? totalPenalite.toLocaleString('fr-FR') + ' FCFA' : '-'}</td>
                <td style="text-align: right;">${(totalMontant + totalPenalite).toLocaleString('fr-FR')} FCFA</td>
            </tr>
        `;

        return `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quittance ${this.reference}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        padding: 40px; 
                        background: #f9fafb;
                        color: #111827;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 40px; 
                        border-bottom: 3px solid #4f46e5; 
                        padding-bottom: 20px; 
                    }
                    .header h1 {
                        color: #4f46e5;
                        font-size: 2em;
                        margin-bottom: 10px;
                    }
                    .reference {
                        font-size: 1.2em;
                        color: #6b7280;
                        margin-top: 10px;
                    }
                    .reference strong {
                        color: #111827;
                    }
                    .info { 
                        margin: 30px 0; 
                        padding: 20px;
                        background: #f9fafb;
                        border-radius: 8px;
                    }
                    .info-row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 12px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #6b7280;
                        min-width: 120px;
                    }
                    .info-value {
                        color: #111827;
                        font-weight: 500;
                    }
                    .section-title {
                        font-size: 1.3em;
                        color: #111827;
                        margin: 30px 0 15px 0;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #e5e7eb;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 20px 0; 
                    }
                    th, td { 
                        border: 1px solid #e5e7eb; 
                        padding: 12px; 
                        text-align: left; 
                    }
                    th { 
                        background-color: #4f46e5; 
                        color: white; 
                        font-weight: 600;
                        text-transform: uppercase;
                        font-size: 0.85em;
                        letter-spacing: 0.5px;
                    }
                    tbody tr:nth-child(even) {
                        background-color: #f9fafb;
                    }
                    tbody tr:hover {
                        background-color: #f3f4f6;
                    }
                    .payment-info {
                        margin: 30px 0;
                        padding: 20px;
                        background: #eff6ff;
                        border-left: 4px solid #3b82f6;
                        border-radius: 4px;
                    }
                    .payment-info p {
                        margin: 8px 0;
                        color: #1e40af;
                    }
                    .total-box { 
                        margin: 30px 0;
                        padding: 25px;
                        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
                        color: white;
                        border-radius: 10px;
                        text-align: center;
                    }
                    .total-label {
                        font-size: 1em;
                        margin-bottom: 10px;
                        opacity: 0.9;
                    }
                    .total-amount {
                        font-size: 2.5em;
                        font-weight: bold;
                        letter-spacing: 1px;
                    }
                    .footer { 
                        margin-top: 60px; 
                        padding-top: 30px;
                        border-top: 2px solid #e5e7eb;
                        text-align: center; 
                        font-size: 0.9em; 
                        color: #6b7280; 
                    }
                    .footer p {
                        margin: 10px 0;
                    }
                    .signature-section {
                        margin-top: 60px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .signature-box {
                        width: 45%;
                        text-align: center;
                    }
                    .signature-line {
                        border-top: 2px solid #111827;
                        margin-top: 60px;
                        padding-top: 10px;
                        font-weight: 600;
                    }
                    .buttons {
                        text-align: center;
                        margin: 30px 0;
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                    }
                    button {
                        padding: 12px 30px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s;
                    }
                    .btn-print {
                        background: #4f46e5;
                        color: white;
                    }
                    .btn-print:hover {
                        background: #4338ca;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
                    }
                    .btn-close {
                        background: #6b7280;
                        color: white;
                    }
                    .btn-close:hover {
                        background: #4b5563;
                    }
                    .watermark {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(-45deg);
                        font-size: 8em;
                        color: rgba(79, 70, 229, 0.03);
                        font-weight: bold;
                        z-index: -1;
                        pointer-events: none;
                    }
                    @media print {
                        body { 
                            padding: 0; 
                            background: white;
                        }
                        .container {
                            box-shadow: none;
                            padding: 20px;
                        }
                        button { display: none; }
                        .buttons { display: none; }
                        .watermark { display: none; }
                    }
                    @media (max-width: 768px) {
                        body { padding: 20px; }
                        .container { padding: 20px; }
                        .info-row { flex-direction: column; }
                        .signature-section { flex-direction: column; }
                        .signature-box { width: 100%; margin: 20px 0; }
                    }
                </style>
            </head>
            <body>
                <div class="watermark">PAYÉ</div>
                <div class="container">
                    <div class="header">
                        <h1>💳 QUITTANCE DE PAIEMENT</h1>
                        <p class="reference">Référence: <strong>${this.reference}</strong></p>
                        <p style="color: #6b7280; margin-top: 5px; font-size: 0.9em;">Université - Service de Scolarité</p>
                    </div>
                    
                    <div class="info">
                        <div class="info-row">
                            <span class="info-label">Étudiant :</span>
                            <span class="info-value">${etudiant.getNomComplet()}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">ID Étudiant :</span>
                            <span class="info-value">${etudiant.id_etudiant}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email :</span>
                            <span class="info-value">${etudiant.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Téléphone :</span>
                            <span class="info-value">${etudiant.telephone}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Date d'émission :</span>
                            <span class="info-value">${dateFormatted}</span>
                        </div>
                    </div>

                    ${paiement ? `
                    <div class="payment-info">
                        <p><strong>Mode de paiement :</strong> ${paiement.mode_paiement.toUpperCase()}</p>
                        <p><strong>Statut :</strong> ${paiement.statut.toUpperCase()}</p>
                        <p><strong>ID Paiement :</strong> ${paiement.id_paiement}</p>
                    </div>
                    ` : ''}

                    <h3 class="section-title">Détail des échéances payées</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date Échéance</th>
                                <th style="text-align: right;">Montant</th>
                                <th style="text-align: right;">Pénalité</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${echeancesHTML}
                        </tbody>
                    </table>

                    <div class="total-box">
                        <div class="total-label">MONTANT TOTAL PAYÉ</div>
                        <div class="total-amount">${this.montant.toLocaleString('fr-FR')} FCFA</div>
                    </div>

                    <div class="signature-section">
                        <div class="signature-box">
                            <p>Signature de l'étudiant</p>
                            <div class="signature-line">L'étudiant</div>
                        </div>
                        <div class="signature-box">
                            <p>Signature du caissier</p>
                            <div class="signature-line">Le caissier</div>
                        </div>
                    </div>

                    <div class="footer">
                        <p><strong>Cette quittance certifie le paiement des sommes mentionnées ci-dessus.</strong></p>
                        <p>Document officiel généré le ${dateSimple}</p>
                        <p style="margin-top: 20px; font-size: 0.85em;">
                            En cas de litige, veuillez contacter le service de scolarité avec cette référence : <strong>${this.reference}</strong>
                        </p>
                    </div>

                    <div class="buttons">
                        <button class="btn-print" onclick="window.print()">
                            🖨️ Imprimer / Télécharger PDF
                        </button>
                        <button class="btn-close" onclick="window.close()">
                            ✖️ Fermer
                        </button>
                    </div>
                </div>

                <script>
                    // Auto-focus pour impression rapide
                    window.addEventListener('load', function() {
                        // Optionnel : décommenter pour impression automatique
                        // setTimeout(() => window.print(), 500);
                    });

                    // Raccourci clavier Ctrl+P
                    document.addEventListener('keydown', function(e) {
                        if (e.ctrlKey && e.key === 'p') {
                            e.preventDefault();
                            window.print();
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}

// Classe Pénalité
class Penalite {
    constructor(type, montant, raison, etudiantId, echeanceId = null) {
        this.id_penalite = this.generateId();
        this.type = type; // 'retard', 'autre'
        this.montant = montant;
        this.raison = raison;
        this.etudiant_id = etudiantId;
        this.echeance_id = echeanceId;
        this.date_application = new Date().toISOString();
    }

    generateId() {
        return 'PEN' + Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// Classe Contrôle Financier
class ControleFinancier {
    constructor(typeControle) {
        this.id_controle = this.generateId();
        this.date_controle = new Date().toISOString();
        this.type_controle = typeControle; // 'coherence', 'echeances', 'penalites'
        this.resultat = 'en_cours';
        this.anomalies = [];
        this.details = {};
    }

    generateId() {
        return 'CTR' + Date.now() + Math.random().toString(36).substr(2, 9);
    }

    // Ajoute une anomalie détectée
    ajouterAnomalie(description, gravite = 'moyenne') {
        this.anomalies.push({
            description,
            gravite, // 'faible', 'moyenne', 'elevee'
            date: new Date().toISOString()
        });
    }

    // Finalise le contrôle
    finaliser() {
        this.resultat = this.anomalies.length === 0 ? 'ok' : 'anomalies_detectees';
        this.details.nombre_anomalies = this.anomalies.length;
    }
}

// Classe Preuve (pour documents justificatifs)
class Preuve {
    constructor(typePreuve, paiementId) {
        this.id_preuve = this.generateId();
        this.type_preuve = typePreuve; // 'recu', 'virement', 'cheque'
        this.paiement_id = paiementId;
        this.document = null; // Pourrait stocker un base64 ou URL
        this.date_emission = new Date().toISOString();
    }

    generateId() {
        return 'PRV' + Date.now() + Math.random().toString(36).substr(2, 9);
    }
}

// Classe Transaction (pour l'historique)
class Transaction {
    constructor(type, description, montant, etudiantId = null) {
        this.id_transaction = this.generateId();
        this.type = type; // 'paiement', 'penalite', 'remboursement'
        this.description = description;
        this.montant = montant;
        this.etudiant_id = etudiantId;
        this.date = new Date().toISOString();
    }

    generateId() {
        return 'TRX' + Date.now() + Math.random().toString(36).substr(2, 9);
    }
}
