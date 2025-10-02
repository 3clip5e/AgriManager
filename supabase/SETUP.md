# Configuration Supabase

## Étapes pour configurer la base de données

1. Connectez-vous à votre tableau de bord Supabase : https://supabase.com/dashboard

2. Accédez à l'éditeur SQL de votre projet

3. Copiez et exécutez le contenu du fichier `migrations/001_initial_schema.sql`

4. Vérifiez que toutes les tables ont été créées correctement :
   - users
   - user_profiles
   - farms
   - fields
   - crop_types
   - plantings
   - products
   - orders
   - ai_recommendations

5. Vérifiez que les politiques RLS (Row Level Security) sont activées pour toutes les tables

6. Les variables d'environnement sont déjà configurées dans le fichier `.env`

## Important

- Les clients (customer) n'ont accès qu'au marketplace
- Les agriculteurs (farmer) ont accès à toutes les fonctionnalités
- Les politiques RLS assurent la sécurité des données

## Test

Après avoir exécuté la migration, vous pouvez :

1. Créer un compte en tant que "Client" - vous serez redirigé vers le marketplace
2. Créer un compte en tant que "Agriculteur" - vous aurez accès au dashboard complet
