import mysql from 'mysql2/promise';

let pool;

export default function getDB() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST, 
            user: process.env.DB_USER, 
            password: process.env.DB_PASSWORD, 
            database: 'main',
            // connectTimeout: 10000,
            port: 4000,
            decimalNumbers: true,
            ssl: {
              rejectUnauthorized: true,
            },
        });
    }
    return pool;
}





//'gateway01.us-west-2.prod.aws.tidbcloud.com', //
//'2KH4jG642GYeUug.root', //
//'8y01HPG54DRvj0GZ', //

// const db = mysql.createPool({
    // host: 'gateway01.us-west-2.prod.aws.tidbcloud.com', //process.env.DB_HOST, //
    // user: '2KH4jG642GYeUug.root', //process.env.DB_USER, //
    // password: '8y01HPG54DRvj0GZ', //process.env.DB_PASSWORD, //
//     database: 'main',
//     port: 4000,
//     ssl: {
//       rejectUnauthorized: true,
//     },
// });
// export default db;

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// ca: process.env.DB_SSL_CA,
// import dotenv from 'dotenv';
// dotenv.config();
// const [rows] = await pool.query(``);
// DROP TABLE IF EXISTS offerslist;

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL,
//   email VARCHAR(100) NOT NULL UNIQUE,
//   phone VARCHAR(20) NOT NULL UNIQUE,
//   password VARCHAR(255) NOT NULL,
//   active ENUM('none', 'on', 'off', 'block') NOT NULL DEFAULT 'none',
//   token VARCHAR(255) NOT NULL,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   role VARCHAR(50) DEFAULT 'user'
// )

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE listings (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   user_id INT NOT NULL,
//   view VARCHAR(10) NOT NULL DEFAULT 'on',
//   state VARCHAR(20) NOT NULL DEFAULT 'none',

//   name VARCHAR(255) NOT NULL,
//   info TEXT NOT NULL,
//   city VARCHAR(100) NOT NULL,
//   hood VARCHAR(100) NOT NULL,
//   phone VARCHAR(20) NOT NULL,

//   images INT NOT NULL DEFAULT 0,
//   services INT NOT NULL DEFAULT 0,
//   subjects INT NOT NULL DEFAULT 0,
//   levels INT NOT NULL DEFAULT 0,
//   offers INT NOT NULL DEFAULT 0,

//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

//   UNIQUE KEY unique_user_name (user_id, name),
//   CONSTRAINT fk_listings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE images (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(255) NOT NULL,
//   listing_id INT NOT NULL,
  
//   CONSTRAINT fk_images_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//   UNIQUE KEY unique_name_listing (name, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE cities (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE
// )

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE neighborhoods (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL,
//   city_id INT NOT NULL,
  
//   CONSTRAINT fk_neighborhoods_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE levels (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     listing_id INT NOT NULL,
//     icon VARCHAR(100) NOT NULL DEFAULT 'Tags',
    
//     CONSTRAINT fk_levels_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//     UNIQUE KEY unique_name_listing (name, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE levelslist (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   icon VARCHAR(100) NOT NULL DEFAULT 'BadgeCheck'
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE offers (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     listing_id INT NOT NULL,
//     icon VARCHAR(100) NOT NULL DEFAULT 'Tags',
    
//     CONSTRAINT fk_offers_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//     UNIQUE KEY unique_name_listing (name, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE offerslist (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   icon VARCHAR(100) NOT NULL DEFAULT 'Tags'
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE services (
//     id INT PRIMARY KEY AUTO_INCREMENT,
//     name VARCHAR(100) NOT NULL,
//     listing_id INT NOT NULL,
//     icon VARCHAR(100) NOT NULL DEFAULT 'Tags',
    
//     CONSTRAINT fk_services_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//     UNIQUE KEY unique_name_listing (name, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE serviceslist (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   icon VARCHAR(100) NOT NULL DEFAULT 'Info'
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE subjects (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL,
//   listing_id INT NOT NULL,
//   icon VARCHAR(100) NOT NULL DEFAULT 'Tags',
  
//   CONSTRAINT fk_subjects_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//   UNIQUE KEY unique_name_listing (name, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE subjectslist (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   icon VARCHAR(100) NOT NULL DEFAULT 'Info'
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE reviews (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   overall DECIMAL(3,2) GENERATED ALWAYS AS ((value + cleanliness + communication + location) / 4.0) STORED,
//   value INT CHECK (value BETWEEN 1 AND 5),
//   cleanliness INT CHECK (cleanliness BETWEEN 1 AND 5),
//   communication INT CHECK (communication BETWEEN 1 AND 5),
//   location INT CHECK (location BETWEEN 1 AND 5),

//   listing_id INT NOT NULL,
//   user_id INT NOT NULL,

//   CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   CONSTRAINT fk_reviews_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
//   UNIQUE KEY unique_user_listing (user_id, listing_id)
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE reviewslist (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   icon VARCHAR(100) NOT NULL DEFAULT 'Star'
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

// CREATE TABLE tokens (
//   email VARCHAR(255) NOT NULL,
//   token VARCHAR(255) NOT NULL,
//   expiration_time INT NOT NULL,
//   send INT DEFAULT 0,

//   PRIMARY KEY (email, token),
//   CONSTRAINT fk_tokens_email FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
// );

// -----------------------------------------------------------------
// -----------------------------------------------------------------

//     CREATE TABLE messages (
// id INT PRIMARY KEY AUTO_INCREMENT,
// email VARCHAR(255) NOT NULL,
// message TEXT NOT NULL,
// state VARCHAR(50) NOT NULL DEFAULT 'none',
// timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
// star VARCHAR(10) DEFAULT 'off');

// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// -----------------------------------------------------------------


















// CREATE TABLE centers (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   user_id INT NOT NULL,
//   visibility VARCHAR(10) NOT NULL DEFAULT 'on',
//   status VARCHAR(10) NOT NULL DEFAULT 'on',

//   name VARCHAR(255) NOT NULL,
//   description TEXT NOT NULL,
//   city VARCHAR(100) NOT NULL,
//   neighborhood VARCHAR(100) NOT NULL,
//   phone VARCHAR(20) NOT NULL,

//   images INT NOT NULL DEFAULT 0,
//   services INT NOT NULL DEFAULT 0,
//   subjects INT NOT NULL DEFAULT 0,
//   levels INT NOT NULL DEFAULT 0,
//   offers INT NOT NULL DEFAULT 0,

//   UNIQUE KEY unique_user_name (user_id, name),
//   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )