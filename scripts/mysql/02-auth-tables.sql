CREATE TABLE accounts (
  id VARCHAR(191) NOT NULL,
  userId VARCHAR(191) NOT NULL,
  type VARCHAR(191) NOT NULL,
  provider VARCHAR(191) NOT NULL,
  providerAccountId VARCHAR(191) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(191),
  scope VARCHAR(191),
  id_token TEXT,
  session_state VARCHAR(191),
  PRIMARY KEY (id),
  UNIQUE KEY provider_providerAccountId (provider, providerAccountId),
  KEY userId (userId)
);

CREATE TABLE sessions (
  id VARCHAR(191) NOT NULL,
  sessionToken VARCHAR(191) NOT NULL,
  userId VARCHAR(191) NOT NULL,
  expires DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY sessionToken (sessionToken),
  KEY userId (userId)
);

CREATE TABLE users (
  id VARCHAR(191) NOT NULL,
  name VARCHAR(191),
  email VARCHAR(191),
  emailVerified DATETIME,
  image VARCHAR(191),
  password VARCHAR(191),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

CREATE TABLE verification_tokens (
  identifier VARCHAR(191) NOT NULL,
  token VARCHAR(191) NOT NULL,
  expires DATETIME NOT NULL,
  PRIMARY KEY (identifier, token)
);


-- Update existing tables to reference users table
ALTER DATABASE agricultural_app CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE farms ADD CONSTRAINT fk_farms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE ai_recommendations ADD CONSTRAINT fk_ai_recommendations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE products ADD CONSTRAINT fk_products_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT fk_orders_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE;
