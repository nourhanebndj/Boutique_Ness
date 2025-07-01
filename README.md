# Site Web Outlet

Ce site web comprend deux pages principales basées sur les designs fournis :

## Pages incluses

### 1. Page de commande (checkout.html)
- Formulaire de commande complet avec sections :
  - Sélection du montant total
  - Adresse de livraison
  - Mode de livraison (Mondial Relay)
  - Mode de paiement (carte bancaire)
- Récapitulatif de paiement en temps réel
- Validation des formulaires
- Navigation vers la page de suivi

### 2. Page de suivi des commandes (order_tracking.html)
- Affichage des commandes passées
- Tableau avec référence, date, prix total, transporteur et statut
- Bouton de retour vers la page de commande
- Stockage local des commandes

## Fonctionnalités JavaScript

- **Navigation entre les pages** : Boutons fonctionnels pour naviguer entre checkout et suivi
- **Mise à jour du récapitulatif** : Le total se met à jour automatiquement selon le montant sélectionné
- **Validation des formulaires** : Vérification des champs requis et formats (email, carte bancaire, etc.)
- **Formatage automatique** : Numéro de carte, date d'expiration, téléphone, etc.
- **Stockage des commandes** : Les commandes sont sauvegardées localement et affichées dans le suivi
- **Simulation de statuts** : Les statuts des commandes évoluent automatiquement avec le temps

## Structure des fichiers

```
outlet_website/
├── checkout.html          # Page de commande principale
├── order_tracking.html    # Page de suivi des commandes
├── css/
│   └── style.css         # Styles CSS pour les deux pages
├── js/
│   └── script.js         # Fonctionnalités JavaScript
└── README.md             # Ce fichier
```

## Utilisation

1. Ouvrez `checkout.html` dans un navigateur web
2. Remplissez le formulaire de commande
3. Utilisez le bouton "SUIVI DE VOS COMMANDES" pour accéder au suivi
4. Les commandes validées apparaîtront dans le tableau de suivi

## Fonctionnalités techniques

- **Design responsive** : Compatible mobile et desktop
- **Validation côté client** : Vérification des données avant soumission
- **Stockage local** : Les commandes persistent entre les sessions
- **Animations CSS** : Transitions fluides et effets visuels
- **Accessibilité** : Navigation au clavier supportée

## Notes de développement

- Le site utilise uniquement HTML, CSS et JavaScript vanilla (pas de frameworks)
- Les icônes de cartes bancaires utilisent des placeholders (à remplacer par de vraies icônes)
- Le bouton "CHOIX DU POINT RELAIS" affiche une alerte (à connecter à une vraie API)
- Les statuts de commande évoluent automatiquement pour la démonstration

## Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design pour mobile et tablette
- Pas de dépendances externes requises

