/**
 * Fonctions utilitaires
 */

const Utils = {
    // Formatage de la date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    },

    // Formatage du montant
    formatMontant(montant) {
        return montant.toLocaleString('fr-FR') + ' FCFA';
    },

    // Validation email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Validation téléphone
    isValidPhone(phone) {
        const regex = /^[0-9+\s()-]{8,}$/;
        return regex.test(phone);
    },

    // Génération de couleur aléatoire
    randomColor() {
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Calcul du nombre de jours entre deux dates
    daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    },

    // Vérifier si une date est passée
    isPastDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    },

    // Ajouter des mois à une date
    addMonths(dateString, months) {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    },

    // Exporter en CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            Utils.showToast('Aucune donnée à exporter', 'warning');
            return;
        }

        // Récupérer les en-têtes
        const headers = Object.keys(data[0]);
        
        // Créer le contenu CSV
        let csv = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Échapper les virgules et guillemets
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return '"' + value.replace(/"/g, '""') + '"';
                }
                return value;
            });
            csv += values.join(',') + '\n';
        });

        // Télécharger le fichier
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Utils.showToast('Export CSV réussi', 'success');
    },

    // Afficher une notification toast
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        }[type] || 'ℹ';

        toast.innerHTML = `
            <span style="font-size: 1.25rem;">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Supprimer après 3 secondes
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    },

    // Confirmer une action
    confirm(message) {
        return window.confirm(message);
    },

    // Débounce pour la recherche
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Générer des données de test
    generateSeedData() {
        if (!Utils.confirm('Cela va réinitialiser toutes les données. Continuer ?')) {
            return;
        }

        // Réinitialiser le stockage
        Storage.clear();

        // Créer des étudiants
        const etudiants = [
            new Etudiant('Diallo', 'Amadou', '2000-05-15', 'amadou.diallo@univ.edu', '+221 77 123 45 67'),
            new Etudiant('Ndiaye', 'Fatou', '1999-08-22', 'fatou.ndiaye@univ.edu', '+221 76 234 56 78'),
            new Etudiant('Sow', 'Mamadou', '2001-03-10', 'mamadou.sow@univ.edu', '+221 78 345 67 89'),
            new Etudiant('Ba', 'Aissatou', '2000-11-30', 'aissatou.ba@univ.edu', '+221 77 456 78 90'),
            new Etudiant('Fall', 'Ibrahima', '1998-07-18', 'ibrahima.fall@univ.edu', '+221 76 567 89 01')
        ];

        etudiants.forEach(e => Storage.addEtudiant(e));

        // Créer des échéances pour chaque étudiant
        const today = new Date();
        etudiants.forEach((etudiant, index) => {
            const montantTotal = 500000 + (index * 50000);
            const nombreEcheances = 3;
            const montantParEcheance = montantTotal / nombreEcheances;

            for (let i = 0; i < nombreEcheances; i++) {
                const dateEcheance = new Date(today);
                dateEcheance.setMonth(today.getMonth() + i - 1); // Une échéance passée
                
                const echeance = new Echeance(
                    etudiant.id_etudiant,
                    montantParEcheance,
                    dateEcheance.toISOString().split('T')[0],
                    5
                );

                // Marquer la première échéance comme payée pour certains étudiants
                if (i === 0 && index < 3) {
                    echeance.marquerPayee();
                }

                Storage.addEcheance(echeance);
            }
        });

        // Créer quelques paiements
        const echeances = Storage.getEcheances();
        const echeancesPayees = echeances.filter(e => e.payee);

        echeancesPayees.forEach(ech => {
            const paiement = new Paiement(
                ech.etudiant_id,
                ech.montant,
                ['especes', 'virement', 'mobile'][Math.floor(Math.random() * 3)]
            );
            paiement.ajouterEcheance(ech.id_echeance);
            paiement.changerStatut('valide');
            
            Storage.addPaiement(paiement);

            // Créer une quittance
            const etudiant = Storage.getEtudiantById(ech.etudiant_id);
            const quittance = new Quittance(paiement.id_paiement, ech.etudiant_id, ech.montant);
            Storage.addQuittance(quittance);

            // Créer une transaction
            const transaction = new Transaction(
                'paiement',
                `Paiement échéance - ${etudiant.nom} ${etudiant.prenom}`,
                ech.montant,
                ech.etudiant_id
            );
            Storage.addTransaction(transaction);
        });

        // Créer des pénalités pour les échéances en retard
        const echeancesEnRetard = echeances.filter(e => !e.payee && Utils.isPastDate(e.date_echeance));
        echeancesEnRetard.forEach(ech => {
            const montantPenalite = ech.montant * 0.05;
            const penalite = new Penalite(
                'retard',
                montantPenalite,
                `Retard de paiement - Échéance du ${Utils.formatDateShort(ech.date_echeance)}`,
                ech.etudiant_id,
                ech.id_echeance
            );
            Storage.addPenalite(penalite);

            // Mettre à jour l'échéance manuellement
            ech.penalite_applicable = true;
            ech.montant_penalite = montantPenalite;
            Storage.updateEcheance(ech.id_echeance, ech);

            // Créer une transaction
            const etudiant = Storage.getEtudiantById(ech.etudiant_id);
            const transaction = new Transaction(
                'penalite',
                `Pénalité de retard - ${etudiant.nom} ${etudiant.prenom}`,
                montantPenalite,
                ech.etudiant_id
            );
            Storage.addTransaction(transaction);
        });

        Utils.showToast('Données de test générées avec succès !', 'success');
        
        // Recharger la page
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    },

    // Dessiner un graphique simple sur canvas
    drawChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Effacer le canvas
        ctx.clearRect(0, 0, width, height);

        if (!data || data.length === 0) {
            ctx.fillStyle = '#6b7280';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Aucune donnée disponible', width / 2, height / 2);
            return;
        }

        // Trouver la valeur maximale
        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = width / data.length - 10;
        const padding = 40;

        // Dessiner les barres
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * (height - padding * 2);
            const x = index * (barWidth + 10) + 10;
            const y = height - padding - barHeight;

            // Barre
            ctx.fillStyle = item.color || '#4f46e5';
            ctx.fillRect(x, y, barWidth, barHeight);

            // Label
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - 10);

            // Valeur
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(Utils.formatMontant(item.value), x + barWidth / 2, y - 5);
        });
    },

    // Générer le HTML d'une quittance
    genererQuittanceHTML(quittance, etudiant, echeances, paiement) {
        const dateFormatted = new Date(quittance.date_emission).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const dateSimple = new Date(quittance.date_emission).toLocaleDateString('fr-FR');
        const nomComplet = `${etudiant.nom} ${etudiant.prenom}`;

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
                <title>Quittance ${quittance.reference}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f9fafb; color: #111827; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #4f46e5; padding-bottom: 20px; }
                    .header h1 { color: #4f46e5; font-size: 2em; margin-bottom: 10px; }
                    .reference { font-size: 1.2em; color: #6b7280; margin-top: 10px; }
                    .reference strong { color: #111827; }
                    .info { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
                    .info-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                    .info-row:last-child { border-bottom: none; }
                    .info-label { font-weight: 600; color: #6b7280; min-width: 120px; }
                    .info-value { color: #111827; font-weight: 500; }
                    .section-title { font-size: 1.3em; color: #111827; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
                    th { background-color: #4f46e5; color: white; font-weight: 600; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.5px; }
                    tbody tr:nth-child(even) { background-color: #f9fafb; }
                    tbody tr:hover { background-color: #f3f4f6; }
                    .payment-info { margin: 30px 0; padding: 20px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; }
                    .payment-info p { margin: 8px 0; color: #1e40af; }
                    .total-box { margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; border-radius: 10px; text-align: center; }
                    .total-label { font-size: 1em; margin-bottom: 10px; opacity: 0.9; }
                    .total-amount { font-size: 2.5em; font-weight: bold; letter-spacing: 1px; }
                    .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 0.9em; color: #6b7280; }
                    .footer p { margin: 10px 0; }
                    .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
                    .signature-box { width: 45%; text-align: center; }
                    .signature-line { border-top: 2px solid #111827; margin-top: 60px; padding-top: 10px; font-weight: 600; }
                    .buttons { text-align: center; margin: 30px 0; display: flex; gap: 15px; justify-content: center; }
                    button { padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.3s; }
                    .btn-print { background: #4f46e5; color: white; }
                    .btn-print:hover { background: #4338ca; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4); }
                    .btn-close { background: #6b7280; color: white; }
                    .btn-close:hover { background: #4b5563; }
                    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 8em; color: rgba(79, 70, 229, 0.03); font-weight: bold; z-index: -1; pointer-events: none; }
                    @media print { body { padding: 0; background: white; } .container { box-shadow: none; padding: 20px; } button { display: none; } .buttons { display: none; } .watermark { display: none; } }
                    @media (max-width: 768px) { body { padding: 20px; } .container { padding: 20px; } .info-row { flex-direction: column; } .signature-section { flex-direction: column; } .signature-box { width: 100%; margin: 20px 0; } }
                </style>
            </head>
            <body>
                <div class="watermark">PAYÉ</div>
                <div class="container">
                    <div class="header">
                        <h1>💳 QUITTANCE DE PAIEMENT</h1>
                        <p class="reference">Référence: <strong>${quittance.reference}</strong></p>
                        <p style="color: #6b7280; margin-top: 5px; font-size: 0.9em;">Université - Service de Scolarité</p>
                    </div>
                    
                    <div class="info">
                        <div class="info-row"><span class="info-label">Étudiant :</span><span class="info-value">${nomComplet}</span></div>
                        <div class="info-row"><span class="info-label">ID Étudiant :</span><span class="info-value">${etudiant.id_etudiant}</span></div>
                        <div class="info-row"><span class="info-label">Email :</span><span class="info-value">${etudiant.email}</span></div>
                        <div class="info-row"><span class="info-label">Téléphone :</span><span class="info-value">${etudiant.telephone}</span></div>
                        <div class="info-row"><span class="info-label">Date d'émission :</span><span class="info-value">${dateFormatted}</span></div>
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
                        <tbody>${echeancesHTML}</tbody>
                    </table>

                    <div class="total-box">
                        <div class="total-label">MONTANT TOTAL PAYÉ</div>
                        <div class="total-amount">${quittance.montant.toLocaleString('fr-FR')} FCFA</div>
                    </div>

                    <div class="signature-section">
                        <div class="signature-box"><p>Signature de l'étudiant</p><div class="signature-line">L'étudiant</div></div>
                        <div class="signature-box"><p>Signature du caissier</p><div class="signature-line">Le caissier</div></div>
                    </div>

                    <div class="footer">
                        <p><strong>Cette quittance certifie le paiement des sommes mentionnées ci-dessus.</strong></p>
                        <p>Document officiel généré le ${dateSimple}</p>
                        <p style="margin-top: 20px; font-size: 0.85em;">En cas de litige, veuillez contacter le service de scolarité avec cette référence : <strong>${quittance.reference}</strong></p>
                    </div>

                    <div class="buttons">
                        <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Télécharger PDF</button>
                        <button class="btn-close" onclick="window.close()">✖️ Fermer</button>
                    </div>
                </div>

                <script>
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
};
