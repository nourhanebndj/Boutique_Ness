// Gestion du formulaire de commande Laravel
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    const confirmButton = document.querySelector('.confirm-button');
    const messageContainer = document.getElementById('message-container');
    const messageContent = document.getElementById('message-content');
    const montantInput = document.getElementById('montant');
    
    // Éléments du résumé
    const orderAmountElement = document.getElementById('orderAmount');
    const shippingCostElement = document.getElementById('shippingCost');
    const totalAmountElement = document.getElementById('totalAmount');
    
    // Configuration CSRF pour Laravel
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    // Frais de livraison fixes
    const SHIPPING_COST = 5.00;
    
    // Fonction pour formater un montant en euros
    function formatCurrency(amount) {
        return amount.toFixed(2).replace('.', ',') + ' €';
    }
    
    // Fonction pour parser un montant depuis une chaîne
    function parseAmount(amountString) {
        if (!amountString || amountString.trim() === '') return 0;
        
        // Enlever les espaces, le symbole € et remplacer la virgule par un point
        const cleanAmount = amountString.replace(/[€\s]/g, '').replace(',', '.');
        const parsed = parseFloat(cleanAmount);
        
        return isNaN(parsed) ? 0 : parsed;
    }
    
    // Fonction pour mettre à jour le résumé de commande
    function updateOrderSummary() {
        const orderAmount = parseAmount(montantInput.value);
        const totalAmount = orderAmount + SHIPPING_COST;
        
        orderAmountElement.textContent = formatCurrency(orderAmount);
        shippingCostElement.textContent = formatCurrency(SHIPPING_COST);
        totalAmountElement.textContent = formatCurrency(totalAmount);
        
        // Animation du résumé lors de la mise à jour
        const summaryContent = document.querySelector('.summary-content');
        if (summaryContent) {
            summaryContent.style.transition = 'transform 0.15s ease';
            summaryContent.style.transform = 'scale(1.02)';
            setTimeout(() => {
                summaryContent.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    // Validation en temps réel des champs requis
    const requiredFields = ['email', 'prenom', 'nom', 'adresse', 'ville', 'code_postal', 'pays'];
    
    function showMessage(message, type = 'success') {
        messageContent.innerHTML = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
        
        // Faire défiler vers le message
        messageContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Masquer automatiquement après 5 secondes pour les messages de succès
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
    
    function validateField(field) {
        const input = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
        if (!input) return false;
        
        const value = input.value.trim();
        
        // Validation spécifique pour l'email
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }
        
        // Validation pour le code postal (format français)
        if (field === 'code_postal') {
            const postalRegex = /^\d{5}$/;
            return postalRegex.test(value);
        }
        
        // Validation générale (non vide)
        return value.length > 0;
    }
    
    function updateFieldStyle(fieldId, isValid) {
        const input = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
        if (!input) return;
        
        input.classList.remove('error', 'valid');
        
        if (isValid) {
            input.classList.add('valid');
        } else {
            input.classList.add('error');
        }
    }
    
    function validateForm() {
        let isFormValid = true;
        
        requiredFields.forEach(field => {
            const isValid = validateField(field);
            updateFieldStyle(field, isValid);
            if (!isValid) isFormValid = false;
        });
        
        // Vérifier qu'un mode de livraison est sélectionné
        const shippingSelected = document.querySelector('input[name="shipping"]:checked');
        if (!shippingSelected) isFormValid = false;
        
        // Mise à jour du bouton de confirmation
        confirmButton.disabled = !isFormValid;
        
        return isFormValid;
    }
    
    // Validation en temps réel
    requiredFields.forEach(field => {
        const input = document.getElementById(field) || document.querySelector(`[name="${field}"]`);
        if (input) {
            input.addEventListener('input', function() {
                setTimeout(validateForm, 100);
            });
            
            input.addEventListener('blur', function() {
                const isValid = validateField(field);
                updateFieldStyle(field, isValid);
            });
        }
    });
    
    // Mise à jour du résumé quand le montant change
    if (montantInput) {
        montantInput.addEventListener('input', function() {
            updateOrderSummary();
        });
        
        montantInput.addEventListener('blur', function() {
            // Formater le montant et mettre à jour le résumé
            formatAmount(this);
            updateOrderSummary();
        });
    }
    
    // Gestion des options de livraison
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            validateForm();
            
            // Animation de sélection
            const labels = document.querySelectorAll('.shipping-label');
            labels.forEach(label => {
                label.style.transform = 'scale(1)';
            });
            
            if (this.checked) {
                const selectedLabel = this.nextElementSibling;
                selectedLabel.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    selectedLabel.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Gestion de la soumission du formulaire avec AJAX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Veuillez remplir tous les champs obligatoires correctement.', 'error');
            return;
        }
        
        // Animation du bouton
        const originalText = confirmButton.innerHTML;
        confirmButton.innerHTML = 'Traitement en cours...';
        confirmButton.disabled = true;
        confirmButton.style.backgroundColor = '#ff9800';
        
        // Collecte des données du formulaire
        const formData = new FormData(form);
        
        // Envoi AJAX
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Succès
                confirmButton.innerHTML = 'Commande confirmée !';
                confirmButton.style.backgroundColor = '#4caf50';
                
                showMessage(`Commande créée avec succès ! Référence: ${data.reference}`, 'success');
                
                // Réinitialiser le formulaire après 3 secondes
                setTimeout(() => {
                    form.reset();
                    confirmButton.innerHTML = originalText;
                    confirmButton.style.backgroundColor = '#000000';
                    confirmButton.disabled = false;
                    validateForm();
                    updateOrderSummary(); // Réinitialiser le résumé
                }, 3000);
                
            } else {
                // Erreur
                confirmButton.innerHTML = originalText;
                confirmButton.style.backgroundColor = '#000000';
                confirmButton.disabled = false;
                
                if (data.errors) {
                    // Afficher les erreurs de validation
                    let errorMessage = 'Erreurs de validation:<ul>';
                    Object.values(data.errors).forEach(errors => {
                        errors.forEach(error => {
                            errorMessage += `<li>${error}</li>`;
                        });
                    });
                    errorMessage += '</ul>';
                    showMessage(errorMessage, 'error');
                } else {
                    showMessage(data.message || 'Une erreur est survenue.', 'error');
                }
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            confirmButton.innerHTML = originalText;
            confirmButton.style.backgroundColor = '#000000';
            confirmButton.disabled = false;
            showMessage('Une erreur de connexion est survenue. Veuillez réessayer.', 'error');
        });
    });
    
    // Animation d'entrée des éléments
    function animateElements() {
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Lancement de l'animation au chargement
    animateElements();
    
    // Validation initiale
    setTimeout(validateForm, 500);
    
    // Initialisation du résumé de commande
    updateOrderSummary();
});

// Fonction utilitaire pour formater le montant dans le champ
function formatAmount(input) {
    let value = input.value.replace(/[^\d,]/g, '');
    if (value) {
        value = value.replace(',', '.');
        const number = parseFloat(value);
        if (!isNaN(number)) {
            input.value = number.toFixed(2).replace('.', ',') + ' €';
        }
    }
}

// Gestion de la page de suivi des commandes
document.addEventListener('DOMContentLoaded', function() {
    const ordersTableBody = document.getElementById('orders-tbody');
    const returnBtn = document.querySelector('.return-btn');
    
    // Configuration CSRF pour Laravel
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    // Fonction pour formater une date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Fonction pour formater un montant en euros
    function formatCurrency(amount) {
        return parseFloat(amount).toFixed(2).replace('.', ',') + ' €';
    }
    
    // Fonction pour obtenir la classe CSS du statut
    function getStatusClass(status) {
        const statusClasses = {
            'pending': 'status-pending',
            'en_attente': 'status-pending',
            'shipped': 'status-shipped',
            'expedie': 'status-shipped',
            'delivered': 'status-delivered',
            'livre': 'status-delivered',
            'cancelled': 'status-cancelled',
            'annule': 'status-cancelled'
        };
        return statusClasses[status.toLowerCase()] || 'status-pending';
    }
    
    // Fonction pour obtenir le texte du statut en français
    function getStatusText(status) {
        const statusTexts = {
            'pending': 'En attente',
            'en_attente': 'En attente',
            'shipped': 'Expédiée',
            'expedie': 'Expédiée',
            'delivered': 'Livrée',
            'livre': 'Livrée',
            'cancelled': 'Annulée',
            'annule': 'Annulée'
        };
        return statusTexts[status.toLowerCase()] || 'En attente';
    }
    
    // Fonction pour créer une ligne de commande
    function createOrderRow(order) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.reference}</td>
            <td>${formatDate(order.date)}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${order.carrier || 'Non défini'}</td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${getStatusText(order.status)}</span></td>
        `;
        
        // Ajouter un effet de clic pour plus de détails
        row.addEventListener('click', function() {
            showOrderDetails(order);
        });
        
        return row;
    }
    
    // Fonction pour afficher les détails d'une commande (peut être étendue)
    function showOrderDetails(order) {
        alert(`Détails de la commande ${order.reference}:\n\nDate: ${formatDate(order.date)}\nMontant: ${formatCurrency(order.total)}\nTransporteur: ${order.carrier || 'Non défini'}\nStatut: ${getStatusText(order.status)}`);
    }
    
    // Fonction pour charger les commandes depuis le localStorage
    function loadOrdersFromStorage() {
        try {
            const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
            return orders;
        } catch (error) {
            console.error('Erreur lors du chargement des commandes:', error);
            return [];
        }
    }
    
    // Fonction pour charger les commandes depuis le serveur Laravel
    async function loadOrdersFromServer() {
        try {
            const response = await fetch('/api/orders', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.orders || [];
            } else {
                console.warn('Impossible de charger les commandes depuis le serveur');
                return [];
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des commandes depuis le serveur:', error);
            return [];
        }
    }
    
    // Fonction pour afficher les commandes
    function displayOrders(orders) {
        // Vider le tableau
        ordersTableBody.innerHTML = '';
        
        if (orders.length === 0) {
            // Afficher le message "Aucune commande"
            const noOrdersRow = document.createElement('tr');
            noOrdersRow.className = 'no-orders';
            noOrdersRow.innerHTML = '<td colspan="5">Aucune commande trouvée</td>';
            ordersTableBody.appendChild(noOrdersRow);
        } else {
            // Afficher les commandes
            orders.forEach((order, index) => {
                const row = createOrderRow(order);
                // Ajouter une animation d'apparition
                row.style.opacity = '0';
                row.style.transform = 'translateY(20px)';
                ordersTableBody.appendChild(row);
                
                // Animation d'entrée
                setTimeout(() => {
                    row.style.transition = 'all 0.5s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }
    
    // Fonction pour charger et afficher les commandes
    async function loadAndDisplayOrders() {
        // Afficher un indicateur de chargement
        ordersTableBody.innerHTML = `
            <tr class="loading-row">
                <td colspan="5" style="text-align: center; padding: 40px;">
                    Chargement des commandes...
                </td>
            </tr>
        `;
        
        // Essayer de charger depuis le serveur d'abord
        let orders = await loadOrdersFromServer();
        
        // Si aucune commande du serveur, charger depuis le localStorage
        if (orders.length === 0) {
            orders = loadOrdersFromStorage();
        }
        
        // Afficher les commandes
        displayOrders(orders);
    }
    
    // Fonction pour ajouter une commande d'exemple (pour les tests)
    function addSampleOrder() {
        const sampleOrders = [
            {
                reference: 'CMD-2024-001',
                date: '2024-01-15',
                total: 45.99,
                carrier: 'Chronopost',
                status: 'delivered'
            },
            {
                reference: 'CMD-2024-002',
                date: '2024-01-20',
                total: 29.50,
                carrier: 'Mondial Relay',
                status: 'shipped'
            },
            {
                reference: 'CMD-2024-003',
                date: '2024-01-25',
                total: 67.80,
                carrier: 'Chronopost',
                status: 'pending'
            }
        ];
        
        localStorage.setItem('userOrders', JSON.stringify(sampleOrders));
        loadAndDisplayOrders();
    }
    
    // Gestion du bouton retour
    if (returnBtn) {
        returnBtn.addEventListener('click', function() {
            // Vous pouvez personnaliser cette fonction selon vos besoins
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Rediriger vers la page d'accueil ou la page de commande
                window.location.href = '/';
            }
        });
    }
    
    // Animation d'entrée pour les éléments de la page
    function animatePageElements() {
        const header = document.querySelector('.tracking-header');
        const main = document.querySelector('.tracking-main');
        
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                header.style.transition = 'all 0.6s ease';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (main) {
            main.style.opacity = '0';
            main.style.transform = 'translateY(30px)';
            setTimeout(() => {
                main.style.transition = 'all 0.6s ease';
                main.style.opacity = '1';
                main.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    // Fonction pour rafraîchir les commandes
    function refreshOrders() {
        loadAndDisplayOrders();
    }
    
    // Initialisation de la page
    function initPage() {
        animatePageElements();
        loadAndDisplayOrders();
        
        // Ajouter un raccourci clavier pour ajouter des commandes d'exemple (pour les tests)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                addSampleOrder();
            }
        });
    }
    
    // Démarrer l'initialisation
    initPage();
    
    // Exposer certaines fonctions globalement pour les tests
    window.trackingPage = {
        refreshOrders,
        addSampleOrder,
        loadAndDisplayOrders
    };
});

// Fonction globale pour le bouton retour (appelée depuis le HTML)
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Rediriger vers la page d'accueil ou la page de commande
        window.location.href = '/';
    }
}

// Fonction pour ajouter une nouvelle commande depuis l'extérieur
function addOrder(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        orders.unshift(orderData); // Ajouter au début de la liste
        localStorage.setItem('userOrders', JSON.stringify(orders));
        
        // Rafraîchir l'affichage si on est sur la page de suivi
        if (window.trackingPage) {
            window.trackingPage.refreshOrders();
        }
        
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la commande:', error);
        return false;
    }
}

