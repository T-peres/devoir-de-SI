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

            // Mettre à jour l'échéance
            ech.calculerPenalite();
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
    }
};
