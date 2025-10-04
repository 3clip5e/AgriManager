# Configuration MySQL Local pour AgriManager

## Prérequis

1. **MySQL installé** sur votre machine (version 8.0 ou supérieure recommandée)
2. **Node.js** installé (version 18 ou supérieure)

## Étapes d'Installation

### 1. Installer et Démarrer MySQL

**Sur macOS (avec Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Sur Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Sur Windows:**
- Téléchargez MySQL Installer depuis https://dev.mysql.com/downloads/installer/
- Suivez l'assistant d'installation

### 2. Configurer MySQL

Connectez-vous à MySQL:
```bash
mysql -u root -p
```

Créez un utilisateur pour l'application (optionnel mais recommandé):
```sql
CREATE USER 'agrimanager'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON agricultural_app.* TO 'agrimanager'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Initialiser la Base de Données

Exécutez le script d'initialisation:
```bash
mysql -u root -p < scripts/mysql/00-init.sql
```

Ou si vous avez créé un utilisateur spécifique:
```bash
mysql -u agrimanager -p < scripts/mysql/00-init.sql
```

### 4. Configurer les Variables d'Environnement

Copiez le fichier d'exemple:
```bash
cp .env.mysql.local .env.local
```

Modifiez `.env.local` avec vos identifiants:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=agrimanager  # ou root
MYSQL_PASSWORD=votre_mot_de_passe
MYSQL_DATABASE=agricultural_app

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=générez-un-secret-ici
```

Pour générer un secret NextAuth sécurisé:
```bash
openssl rand -base64 32
```

### 5. Adapter le Code pour MySQL

Le code actuel utilise Supabase. Voici les fichiers à restaurer/modifier :

**Fichier `lib/database.ts`:**
Remplacez le contenu par:
```typescript
import { createConnection } from 'mysql2/promise';

const pool = createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'agricultural_app',
});

export const db = pool;

export async function query(sql: string, params?: any[]) {
  const connection = await pool;
  const [results] = await connection.execute(sql, params);
  return results;
}

// ... garder les autres fonctions existantes
```

**Fichier `lib/auth.ts`:**
Remplacez les imports Supabase par MySQL:
```typescript
import { createPool } from "mysql2/promise"

const pool = createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "agricultural_app",
})
```

### 6. Installer les Dépendances

```bash
npm install mysql2
```

### 7. Lancer l'Application

```bash
npm run dev
```

Accédez à http://localhost:3000

## Vérification de l'Installation

Pour vérifier que tout est bien installé:

```bash
mysql -u agrimanager -p agricultural_app
```

Puis dans MySQL:
```sql
-- Vérifier les tables
SHOW TABLES;

-- Vérifier les crop_types
SELECT * FROM crop_types;

-- Vérifier la structure users
DESCRIBE users;
```

Vous devriez voir:
- 11 tables créées
- 10 types de cultures pré-remplis
- La colonne `user_type` dans la table `users`

## Structure de la Base de Données

### Tables Principales

1. **users** - Authentification avec type (farmer/customer)
2. **user_profiles** - Profils détaillés
3. **farms** - Fermes (agriculteurs uniquement)
4. **fields** - Champs des fermes
5. **crop_types** - Types de cultures
6. **plantings** - Plantations
7. **products** - Produits du marketplace
8. **orders** - Commandes
9. **ai_recommendations** - Recommandations IA
10. **weather_data** - Données météo
11. **notifications** - Notifications
12. **activity_logs** - Journaux d'activité

## Fonctionnalités par Type d'Utilisateur

### Clients (customer)
- ✅ Voir le marketplace
- ✅ Acheter des produits
- ✅ Gérer leurs commandes
- ❌ Pas d'accès au dashboard agriculteur

### Agriculteurs (farmer)
- ✅ Accès complet au dashboard
- ✅ Gérer les fermes et champs
- ✅ Ajouter des produits au marketplace
- ✅ Voir leurs commandes
- ✅ Accéder au conseiller IA

## Dépannage

### Erreur de connexion MySQL

**Problème:** `ER_ACCESS_DENIED_ERROR`
**Solution:** Vérifiez vos identifiants dans `.env.local`

**Problème:** `ER_BAD_DB_ERROR`
**Solution:** La base de données n'existe pas, relancez le script d'init

### Port déjà utilisé

**Problème:** Le port 3306 est déjà utilisé
**Solution:**
```bash
# Vérifier les processus MySQL
ps aux | grep mysql

# Arrêter MySQL
brew services stop mysql  # macOS
sudo systemctl stop mysql  # Linux
```

### Tables non créées

**Solution:**
```bash
# Supprimer et recréer
mysql -u root -p
DROP DATABASE agricultural_app;
EXIT;

# Relancer le script
mysql -u root -p < scripts/mysql/00-init.sql
```

## Sauvegarde et Restauration

### Sauvegarder

```bash
mysqldump -u agrimanager -p agricultural_app > backup.sql
```

### Restaurer

```bash
mysql -u agrimanager -p agricultural_app < backup.sql
```

## Migration depuis Supabase

Si vous avez des données dans Supabase et souhaitez les migrer:

1. Exportez les données depuis Supabase (SQL Editor)
2. Adaptez les types de données si nécessaire
3. Importez dans MySQL

## Commandes Utiles

```bash
# Se connecter
mysql -u agrimanager -p agricultural_app

# Voir les utilisateurs
SELECT id, email, user_type FROM users;

# Voir les produits
SELECT * FROM products WHERE status = 'available';

# Voir les commandes
SELECT o.*, u.name as buyer_name
FROM orders o
JOIN users u ON o.buyer_id = u.id;
```

## Support

Pour toute question ou problème:
1. Vérifiez que MySQL est bien démarré
2. Vérifiez les credentials dans `.env.local`
3. Consultez les logs: `tail -f /usr/local/var/mysql/*.err` (macOS)

---

**Note:** Cette configuration est pour le développement local uniquement. Pour la production, utilisez des identifiants sécurisés et activez SSL.
