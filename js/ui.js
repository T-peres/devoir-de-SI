/**
 * Gestion de l'interface utilisateur
 */

const UI = {
    // Initialisation de l'interface
    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupDarkMode();
        this.updateCurrentDate();
        this.loadDashboard();
    },

    // Configuration de la navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
            });
        });
    },

    // Navigation entre les pages
    navigateTo(pageName) {
        // Mettre à jour la navigation active
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Afficher la page correspondante
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(`${pageName}-page`).classList.add('active');

        // Mettre à jour le titre
        const titles = {
            dashboard: 'Tableau de bord',
            students: 'Gestion des Étudiants',
            echeances: 'Gestion des Tranches',
            payments: 'Gestion des Paiements',
            controle: 'Contrôle Financier',
            reporting: 'Reporting'
        };
        document.getElementById('pageTitle').textContent = titles[pageName];

        // Charger les données de la page
        this.loadPageData(pageName);
    },

    // Charger les données d'une page
    loadPageData(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'students':
                this.loadStudents();
                break;
            case 'echeances':
                this.loadEcheances();
                break;
            case 'payments':
                this.loadPayments();
                break;
            case 'controle':
                this.loadControle();
                break;
            case 'reporting':
                this.loadReporting();
                break;
        }
    },

    // Charger le tableau de bord
    loadDashboard() {
        const stats = Storage.getStatistiques();
        
        document.getElementById('totalEncaisse').textContent = Utils.formatMontant(stats.totalEncaisse);
        document.getElementById('totalAttente').textContent = Utils.formatMontant(stats.totalAttente);
        document.getElementById('etudiantsRetard').textContent = stats.etudiantsEnRetard;
        document.getElementById('totalPenalites').textContent = Utils.formatMontant(stats.totalPenalites);

        // Graphique des paiements par mois
        this.loadPaymentsChart();
    },

    // Charger le graphique des paiements
    loadPaymentsChart() {
        const paiements = Storage.getPaiements();
        const monthlyData = {};

        paiements.forEach(p => {
            const date = new Date(p.date_paiement);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + p.montant;
        });

        const chartData = Object.keys(monthlyData).slice(-6).map(key => ({
            label: key,
            value: monthlyData[key],
            color: '#4f46e5'
        }));

        Utils.drawChart('paymentsChart', chartData);
    },

    // Charger la liste des étudiants
    loadStudents() {
        const etudiants = Storage.getEtudiants();
        const tbody = document.querySelector('#studentsTable tbody');
        tbody.innerHTML = '';

        etudiants.forEach(etudiant => {
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
    },

    // Charger les échéances
    loadEcheances() {
        const tranches = Storage.getTranchesGlobales();
        const grid = document.getElementById('echeancesGrid');
        grid.innerHTML = '';

        if (tranches.length === 0) {
            grid.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-secondary);">Aucune tranche définie. Cliquez sur "Créer Tranche Globale" pour commencer.</p>';
            return;
        }

        tranches.forEach(tranche => {
            const isOverdue = Utils.isPastDate(tranche.date_echeance);
            const penalite = tranche.calculerPenalite();
            const montantTotal = tranche.getMontantTotal();

            // Compter combien d'étudiants ont payé cette tranche
            const paiementsTranches = Storage.getPaiementsTranches();
            const paiementsPayes = paiementsTranches.filter(pt => pt.tranche_id === tranche.id_tranche && pt.payee);
            const totalEtudiants = Storage.getEtudiants().length;

            const card = document.createElement('div');
            card.className = `echeance-card ${isOverdue ? 'overdue' : ''}`;
            card.innerHTML = `
                <div class="echeance-header">
                    <h4>${tranche.nom}</h4>
                    <span class="badge ${isOverdue ? 'badge-danger' : 'badge-info'}">
                        ${isOverdue ? 'En retard' : 'Active'}
                    </span>
                </div>
                <div class="echeance-body">
                    <p><strong>Date limite:</strong> ${Utils.formatDateShort(tranche.date_echeance)}</p>
                    <p><strong>Montant:</strong> ${Utils.formatMontant(tranche.montant)}</p>
                    ${penalite > 0 ? `<p style="color: var(--danger-color);"><strong>Pénalité:</strong> ${Utils.formatMontant(penalite)}</p>` : ''}
                    <p><strong>Montant total:</strong> ${Utils.formatMontant(montantTotal)}</p>
                    <p><strong>Étudiants ayant payé:</strong> ${paiementsPayes.length} / ${totalEtudiants}</p>
                    <div style="margin-top: 1rem;">
                        <button class="btn-secondary btn-small" onclick="UI.editTrancheGlobale('${tranche.id_tranche}')">Modifier</button>
                        <button class="btn-danger btn-small" onclick="UI.deleteTrancheGlobale('${tranche.id_tranche}')">Supprimer</button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    // Charger les paiements
    loadPayments() {
        const paiements = Storage.getPaiements();
        const tbody = document.querySelector('#paymentsTable tbody');
        tbody.innerHTML = '';

        paiements.forEach(paiement => {
            const etudiant = Storage.getEtudiantById(paiement.etudiant_id);
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${paiement.id_paiement}</td>
                <td>${Utils.formatDateShort(paiement.date_paiement)}</td>
                <td>${etudiant ? etudiant.nom + ' ' + etudiant.prenom : 'Inconnu'}</td>
                <td>${Utils.formatMontant(paiement.montant)}</td>
                <td><span style="text-transform: capitalize;">${paiement.mode_paiement}</span></td>
                <td><span class="badge ${paiement.statut === 'valide' ? 'badge-success' : (paiement.statut === 'partiel' ? 'badge-warning' : 'badge-info')}">${paiement.statut}</span></td>
                <td>
                    <button class="btn-primary btn-small" onclick="UI.viewQuittance('${paiement.id_paiement}')" title="Voir la quittance">📄 Quittance</button>
                </td>
            `;
        });
    },

    // Charger le contrôle financier
    loadControle() {
        const etudiants = Storage.getEtudiants();
        const tranches = Storage.getTranchesGlobales();
        const paiementsTranches = Storage.getPaiementsTranches();

        const etudiantsAJour = [];
        const etudiantsEnRetard = [];

        etudiants.forEach(etudiant => {
            let tranchesPayees = 0;
            let tranchesNonPayees = [];
            let resteAPayer = 0;
            let totalPenalites = 0;

            tranches.forEach(tranche => {
                const paiementTranche = paiementsTranches.find(
                    pt => pt.etudiant_id === etudiant.id_etudiant && pt.tranche_id === tranche.id_tranche && pt.payee
                );

                if (paiementTranche) {
                    tranchesPayees++;
                } else {
                    tranchesNonPayees.push(tranche);
                    const montantTranche = tranche.montant;
                    const penalite = tranche.calculerPenalite();
                    resteAPayer += montantTranche + penalite;
                    totalPenalites += penalite;
                }
            });

            const etudiantData = {
                etudiant,
                tranchesPayees,
                tranchesNonPayees,
                resteAPayer,
                totalPenalites
            };

            if (tranchesNonPayees.length === 0) {
                etudiantsAJour.push(etudiantData);
            } else {
                etudiantsEnRetard.push(etudiantData);
            }
        });

        // Mettre à jour les statistiques
        document.getElementById('etudiantsAJour').textContent = etudiantsAJour.length;
        document.getElementById('etudiantsEnRetardCount').textContent = etudiantsEnRetard.length;
        
        const totalReste = etudiantsEnRetard.reduce((sum, e) => sum + e.resteAPayer, 0);
        document.getElementById('totalResteAPayer').textContent = Utils.formatMontant(totalReste);

        // Remplir la table des étudiants à jour
        const tbodyAJour = document.querySelector('#etudiantsAJourTable tbody');
        tbodyAJour.innerHTML = '';

        if (etudiantsAJour.length === 0) {
            tbodyAJour.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucun étudiant à jour</td></tr>';
        } else {
            etudiantsAJour.forEach(data => {
                const row = tbodyAJour.insertRow();
                row.innerHTML = `
                    <td>${data.etudiant.id_etudiant}</td>
                    <td>${data.etudiant.nom} ${data.etudiant.prenom}</td>
                    <td>${data.etudiant.email}</td>
                    <td>${data.etudiant.telephone}</td>
                    <td><span class="badge badge-success">${data.tranchesPayees} / ${tranches.length}</span></td>
                `;
            });
        }

        // Remplir la table des étudiants en retard
        const tbodyEnRetard = document.querySelector('#etudiantsEnRetardTable tbody');
        tbodyEnRetard.innerHTML = '';

        if (etudiantsEnRetard.length === 0) {
            tbodyEnRetard.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">Aucun étudiant en retard</td></tr>';
        } else {
            etudiantsEnRetard.forEach(data => {
                const tranchesNoms = data.tranchesNonPayees.map(t => t.nom).join(', ');
                const row = tbodyEnRetard.insertRow();
                row.style.backgroundColor = data.totalPenalites > 0 ? '#fff5f5' : '#fffbeb';
                row.innerHTML = `
                    <td>${data.etudiant.id_etudiant}</td>
                    <td><strong>${data.etudiant.nom} ${data.etudiant.prenom}</strong></td>
                    <td>${data.etudiant.email}</td>
                    <td>${data.etudiant.telephone}</td>
                    <td><span class="badge badge-warning">${tranchesNoms}</span></td>
                    <td><strong style="color: var(--danger-color);">${Utils.formatMontant(data.resteAPayer)}</strong></td>
                    <td>${data.totalPenalites > 0 ? '<span style="color: var(--danger-color);">' + Utils.formatMontant(data.totalPenalites) + '</span>' : '-'}</td>
                `;
            });
        }
    },

    // Charger le reporting
    loadReporting() {
        const transactions = Storage.getTransactions();
        const tbody = document.querySelector('#reportingTable tbody');
        tbody.innerHTML = '';

        // Remplir le select des étudiants
        const filterStudent = document.getElementById('filterStudent');
        filterStudent.innerHTML = '<option value="">Tous les étudiants</option>';
        const etudiants = Storage.getEtudiants();
        etudiants.forEach(e => {
            filterStudent.innerHTML += `<option value="${e.id_etudiant}">${e.nom} ${e.prenom}</option>`;
        });

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
    },

    // Configuration des modales
    setupModals() {
        // Fermer les modales
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });

        // Fermer en cliquant en dehors
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    },

    // Ouvrir la modale étudiant
    openStudentModal(studentId = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');

        form.reset();

        if (studentId) {
            const etudiant = Storage.getEtudiantById(studentId);
            title.textContent = 'Modifier Étudiant';
            document.getElementById('studentId').value = etudiant.id_etudiant;
            document.getElementById('studentNom').value = etudiant.nom;
            document.getElementById('studentPrenom').value = etudiant.prenom;
            document.getElementById('studentDateNaissance').value = etudiant.date_naissance;
            document.getElementById('studentEmail').value = etudiant.email;
            document.getElementById('studentTelephone').value = etudiant.telephone;
        } else {
            title.textContent = 'Ajouter Étudiant';
            document.getElementById('studentId').value = '';
        }

        modal.classList.add('active');
    },

    // Modifier un étudiant
    editStudent(studentId) {
        this.openStudentModal(studentId);
    },

    // Supprimer un étudiant
    deleteStudent(studentId) {
        if (Utils.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
            Storage.deleteEtudiant(studentId);
            Utils.showToast('Étudiant supprimé', 'success');
            this.loadStudents();
        }
    },

    // Ouvrir la modale de paiement
    openPaymentModal() {
        const modal = document.getElementById('paymentModal');
        const form = document.getElementById('paymentForm');
        form.reset();

        // Remplir le select des étudiants
        const select = document.getElementById('paymentStudent');
        select.innerHTML = '<option value="">Sélectionner un étudiant</option>';
        const etudiants = Storage.getEtudiants();
        etudiants.forEach(e => {
            select.innerHTML += `<option value="${e.id_etudiant}">${e.nom} ${e.prenom}</option>`;
        });

        modal.classList.add('active');
    },

    // Charger les échéances d'un étudiant pour le paiement
    loadEcheancesForPayment(etudiantId) {
        const container = document.getElementById('echeancesCheckboxes');
        container.innerHTML = '';

        // Charger les tranches globales non payées par cet étudiant
        const tranchesNonPayees = Storage.getTranchesNonPayeesEtudiant(etudiantId);
        
        if (tranchesNonPayees.length === 0) {
            container.innerHTML = '<p style="padding: 1rem; color: var(--text-secondary);">Aucune tranche en attente</p>';
            return;
        }

        tranchesNonPayees.forEach(tranche => {
            const isOverdue = Utils.isPastDate(tranche.date_echeance);
            const penalite = tranche.calculerPenalite();
            const montantTotal = tranche.getMontantTotal();
            
            const div = document.createElement('div');
            div.className = 'echeance-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="tranche_${tranche.id_tranche}" value="${tranche.id_tranche}" data-montant="${montantTotal}" data-type="tranche">
                <label for="tranche_${tranche.id_tranche}">
                    ${tranche.nom} - ${Utils.formatDateShort(tranche.date_echeance)} - ${Utils.formatMontant(tranche.montant)}
                    ${penalite > 0 ? `<span style="color: var(--danger-color);"> + ${Utils.formatMontant(penalite)} (pénalité)</span>` : ''}
                    ${isOverdue ? '<span class="badge badge-danger">En retard</span>' : ''}
                </label>
            `;
            container.appendChild(div);
        });

        // Calculer le reste à payer
        container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', this.updateResteAPayer.bind(this));
        });
    },

    // Mettre à jour le reste à payer
    updateResteAPayer() {
        const montantPaye = parseFloat(document.getElementById('paymentMontant').value) || 0;
        const checkboxes = document.querySelectorAll('#echeancesCheckboxes input[type="checkbox"]:checked');
        
        let totalEcheances = 0;
        checkboxes.forEach(cb => {
            totalEcheances += parseFloat(cb.dataset.montant);
        });

        const reste = totalEcheances - montantPaye;
        const resteElement = document.getElementById('resteAPayer');
        resteElement.textContent = Utils.formatMontant(Math.max(0, reste));
        
        // Changer la couleur selon le statut
        if (reste > 0) {
            resteElement.style.color = 'var(--danger-color)';
        } else if (reste < 0) {
            resteElement.style.color = 'var(--warning-color)';
        } else {
            resteElement.style.color = 'var(--secondary-color)';
        }
        
        // Afficher un message si trop payé
        const messageDiv = document.getElementById('paymentMessage');
        if (messageDiv) {
            messageDiv.remove();
        }
        
        if (reste < 0) {
            const msg = document.createElement('div');
            msg.id = 'paymentMessage';
            msg.style.cssText = 'padding: 0.5rem; margin-top: 0.5rem; background: var(--warning-color); color: white; border-radius: 0.5rem; font-size: 0.875rem;';
            msg.textContent = `⚠️ Montant supérieur au total des échéances (surplus: ${Utils.formatMontant(Math.abs(reste))})`;
            document.getElementById('resteAPayer').parentElement.appendChild(msg);
        }
    },

    // Ouvrir la modale de génération d'échéances (tranches globales)
    openEcheancesModal() {
        const modal = document.getElementById('echeancesModal');
        const form = document.getElementById('echeancesForm');
        form.reset();
        delete form.dataset.trancheId;

        // Changer le titre
        document.querySelector('#echeancesModal .modal-header h2').textContent = 'Créer Tranche Globale';

        modal.classList.add('active');
    },

    // Modifier une tranche globale
    editTrancheGlobale(trancheId) {
        const tranche = Storage.getTrancheGlobaleById(trancheId);
        if (!tranche) return;

        const modal = document.getElementById('echeancesModal');
        const form = document.getElementById('echeancesForm');
        
        document.querySelector('#echeancesModal .modal-header h2').textContent = 'Modifier Tranche Globale';
        
        // Remplir les champs
        document.getElementById('trancheNom').value = tranche.nom;
        document.getElementById('trancheMontant').value = tranche.montant;
        document.getElementById('echeanceDateDebut').value = tranche.date_echeance;
        
        // Stocker l'ID pour la mise à jour
        form.dataset.trancheId = trancheId;
        
        modal.classList.add('active');
    },

    // Supprimer une tranche globale
    deleteTrancheGlobale(trancheId) {
        if (Utils.confirm('Êtes-vous sûr de vouloir supprimer cette tranche ? Cela affectera tous les étudiants.')) {
            Storage.deleteTrancheGlobale(trancheId);
            Utils.showToast('Tranche supprimée', 'success');
            this.loadEcheances();
        }
    },

    // Voir/Imprimer une quittance
    viewQuittance(paiementId) {
        const paiement = Storage.getPaiementById(paiementId);
        const quittances = Storage.getQuittances();
        const quittance = quittances.find(q => q.paiement_id === paiementId);

        if (!quittance) {
            Utils.showToast('Quittance non trouvée', 'error');
            return;
        }

        this.printQuittance(quittance.id_quittance);
    },

    // Imprimer une quittance
    printQuittance(quittanceId) {
        const quittance = Storage.getQuittanceById(quittanceId);
        if (!quittance) {
            Utils.showToast('Quittance non trouvée', 'error');
            return;
        }

        const etudiant = Storage.getEtudiantById(quittance.etudiant_id);
        if (!etudiant) {
            Utils.showToast('Étudiant non trouvé', 'error');
            return;
        }

        const paiement = Storage.getPaiementById(quittance.paiement_id);
        if (!paiement) {
            Utils.showToast('Paiement non trouvé', 'error');
            return;
        }

        // Récupérer les échéances payées
        const echeances = paiement.echeances.map(id => Storage.getEcheanceById(id)).filter(e => e !== undefined);

        if (echeances.length === 0) {
            Utils.showToast('Aucune échéance trouvée pour ce paiement', 'warning');
        }

        // Générer le HTML avec toutes les informations
        const html = Utils.genererQuittanceHTML(quittance, etudiant, echeances, paiement);

        // Ouvrir dans une nouvelle fenêtre
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
            Utils.showToast('Veuillez autoriser les popups pour imprimer la quittance', 'error');
            return;
        }

        printWindow.document.write(html);
        printWindow.document.close();
        
        // Focus sur la nouvelle fenêtre
        printWindow.focus();
    },

    // Configuration du mode sombre
    setupDarkMode() {
        const settings = Storage.getSettings();
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        }

        document.getElementById('darkModeToggle').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const settings = Storage.getSettings();
            settings.darkMode = document.body.classList.contains('dark-mode');
            Storage.saveSettings(settings);
        });
    },

    // Mettre à jour la date actuelle
    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};
