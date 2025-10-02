# Guide de Migration et Configuration

## Résumé des Modifications

Votre application a été migrée de MySQL vers Supabase (PostgreSQL) avec un système d'authentification différencié pour les clients et les agriculteurs.

## Principales Modifications

### 1. Système d'Authentification à Deux Types d'Utilisateurs

L'application supporte maintenant deux types d'utilisateurs :

- **Client (customer)** : Accès uniquement au marketplace pour effectuer des achats
- **Agriculteur (farmer)** : Accès complet à toutes les fonctionnalités (dashboard, champs, marketplace, conseiller IA, etc.)

### 2. Formulaire d'Inscription

Le formulaire d'inscription (`components/sign-up-form.tsx`) permet maintenant de choisir entre :
- Client (avec icône panier)
- Agriculteur (avec icône utilisateurs)

### 3. Middleware de Sécurité

Le middleware (`middleware.ts`) redirige automatiquement :
- Les clients essayant d'accéder au dashboard vers le marketplace
- Les clients essayant d'accéder aux pages réservées aux agriculteurs vers le marketplace

### 4. Navigation Conditionnelle

Le composant de navigation (`components/dashboard-nav.tsx`) :
- Affiche tous les liens de navigation pour les agriculteurs
- N'affiche aucun lien pour les clients (ils sont sur le marketplace)
- Affiche le type d'utilisateur dans le menu déroulant

## Configuration de la Base de Données Supabase

### Étape 1 : Exécuter la Migration

1. Connectez-vous à votre tableau de bord Supabase
2. Accédez à l'éditeur SQL
3. Copiez le contenu du fichier `supabase/migrations/001_initial_schema.sql`
4. Exécutez-le dans l'éditeur SQL

### Étape 2 : Vérification

Vérifiez que les tables suivantes ont été créées :
- `users`
- `user_profiles`
- `farms`
- `fields`
- `crop_types`
- `plantings`
- `products`
- `orders`
- `ai_recommendations`

### Étape 3 : Politiques de Sécurité (RLS)

Toutes les tables ont Row Level Security (RLS) activé avec des politiques spécifiques :
- Les utilisateurs ne peuvent voir que leurs propres données
- Les clients peuvent voir tous les produits mais uniquement créer des commandes
- Les agriculteurs peuvent gérer leurs fermes, champs, et produits

## Variables d'Environnement

Les variables suivantes sont déjà configurées dans `.env` :
```
NEXT_PUBLIC_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Test de l'Application

### Test en tant que Client

1. Inscrivez-vous en choisissant "Client"
2. Vous serez automatiquement redirigé vers `/marketplace`
3. Vous pouvez parcourir les produits et passer des commandes
4. Tentative d'accès à `/dashboard` vous redirigera vers `/marketplace`

### Test en tant qu'Agriculteur

1. Inscrivez-vous en choisissant "Agriculteur"
2. Vous aurez accès au dashboard complet
3. Vous pouvez gérer vos fermes, champs, plantations
4. Vous pouvez ajouter des produits au marketplace
5. Vous avez accès au conseiller IA

## Fichiers Modifiés

### Authentification
- `lib/auth.ts` - Utilise Supabase pour l'authentification
- `lib/supabase.ts` - Client Supabase avec types TypeScript
- `app/api/auth/register/route.ts` - Inscription avec type d'utilisateur
- `types/next-auth.d.ts` - Types NextAuth étendus

### Interface
- `components/sign-up-form.tsx` - Choix du type d'utilisateur
- `components/dashboard-nav.tsx` - Navigation conditionnelle
- `middleware.ts` - Restrictions d'accès

### Base de Données
- `lib/database.ts` - Fonctions adaptées pour Supabase
- `lib/marketplace-actions.ts` - Actions marketplace avec Supabase
- `app/marketplace/page.tsx` - Liste des produits avec Supabase
- `app/api/profile/route.ts` - Gestion du profil avec Supabase

### Providers
- `app/providers.tsx` - SessionProvider NextAuth ajouté

## Notes Importantes

### Avertissements de Build

Certains fichiers (`field-actions.ts`, `ai-advisor/page.tsx`, etc.) utilisent encore l'ancienne fonction `query()` qui n'existe plus. Ces fichiers nécessitent une migration vers Supabase. Le build fonctionne mais ces fonctionnalités ne seront pas opérationnelles tant que la migration n'est pas complète.

### Migration Complète

Pour une migration complète, les fichiers suivants doivent être adaptés :
- `lib/field-actions.ts` - Actions pour fermes et champs
- `app/dashboard/ai-advisor/page.tsx` - Conseiller IA
- `app/dashboard/fields/add-farm/[farmId]/page.tsx` - Ajout de champ
- `app/dashboard/fields/add-field/page.tsx` - Ajout de champ

## Prochaines Étapes

1. Exécutez la migration SQL dans Supabase
2. Testez l'inscription en tant que client et agriculteur
3. Vérifiez que les redirections fonctionnent correctement
4. Adaptez les fichiers restants pour utiliser Supabase

## Support

Pour toute question sur la structure de la base de données, consultez :
- `supabase/migrations/001_initial_schema.sql` pour le schéma complet
- `lib/supabase.ts` pour les types TypeScript
- `supabase/SETUP.md` pour les instructions de configuration
