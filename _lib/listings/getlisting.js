'use server'
import db from "@/_lib/db";

// const sql = require('better-sqlite3');
// const db = sql('main.db');

//| get all listings for homepage 
//| get listing by id for center 
//| 
//| 
//| 
//| 
//| 
//| 
//| 

















// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// import { GetUser } from "@/lib/dashboard/getuser";

// // -----------------------------------------------------------

// const handleDbError = (error) => {
//     console.error("Database error:", error);
//     return { error: { server: "Une erreur est survenue. Veuillez réessayer plus tard." } };
// };

// // -----------------------------------------------------------

// export async function isAuthorized(center_id) {
    
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session || !session.user) {
//             return { error: { image: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         const userToken = session.user.name;
//         const userEmail = session.user.email;
//         const user = await GetUser(userEmail, userToken); // get user

//         // ----- Check 1
//         if (!user || !center_id) { //no need to check usertToken and userEmail
//             return { error: { image: "Une erreur est survenue. Veuillez réessayer plus tard."} };
//         }
        
//         // ----- Check 2
//         const userId = db.prepare("SELECT user_id FROM centers WHERE id = ?").get(center_id);
//         if (!userId) {
//             return { error: { image: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }
//         if (userId.user_id !== user.id) { // ----- Authorization check
//             return { error: { image: "Une erreur est survenue. Veuillez réessayer plus tard." } };
//         }

//         return { user_id: user.id};

//     } catch (error) {
//         return handleDbError(error);
//     }

// }

// // -----------------------------------------------------------

// export async function getUserListing(center_id) {
    
//     try {
//         const authentication = await isAuthorized(center_id);
//         if (authentication.error) return authentication;

//         const center = db.prepare("SELECT * FROM centers WHERE id = ? AND user_id = ?").get(center_id, authentication.user_id);
//         if (!center) {
//             return {error: 'Erreur lors de la suppression'};
//         }

//         const images = db.prepare("SELECT name FROM images WHERE center_id = ?").all(center_id).map(img => img.name);
//         const offers = db.prepare("SELECT name FROM offers WHERE center_id = ?").all(center_id).map(offer => offer.name);
//         const levels = db.prepare("SELECT name FROM levels WHERE center_id = ?").all(center_id).map(level => level.name);
//         const subjects = db.prepare("SELECT name FROM subjects WHERE center_id = ?").all(center_id).map(subject => subject.name);
//         const services = db.prepare("SELECT name FROM services WHERE center_id = ?").all(center_id).map(service => service.name);

//         const draft = (images.length > 0 ? 1 : 0) +
//                     (offers.length > 0 ? 1 : 0) +
//                     (levels.length > 0 ? 1 : 0) +
//                     (subjects.length > 0 ? 1 : 0) +
//                     (services.length > 0 ? 1 : 0);

//         return {
//             ...center,
//             images,
//             offers,
//             levels,
//             subjects,
//             services,
//             draft
//         };
//     } catch (error) {
//         return handleDbError(error);
//     }
// }

// // -----------------------------------------------------------

// export async function getAllListing() {

    
//     // Step 1: Get all centers for the user
//     const centers = db.prepare("SELECT * FROM centers").all();

//     if (centers.length === 0) {
//         return []; // No centers found for the user
//     }

//     // Step 2: Get all images for the user's centers
//     const centerIdsList = centers.map(center => center.id); // Extract the center ids

//     const images = db.prepare(`
//         SELECT * FROM images WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 3: Get all levels for the user's centers
//     const levels = db.prepare(`
//         SELECT * FROM levels WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 4: Get all subjects for the user's centers
//     const subjects = db.prepare(`
//         SELECT * FROM subjects WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 5: Get all services for the user's centers
//     const services = db.prepare(`
//         SELECT * FROM services WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 6: Attach images, levels, subjects, and services to corresponding centers
//     const centersWithDetails = centers.map(center => {
//         const centerImages = images.filter(image => image.center_id === center.id).map(image => image.name);
//         const centerLevels = levels.filter(level => level.center_id === center.id).map(level => level.name);
//         const centerSubjects = subjects.filter(subject => subject.center_id === center.id).map(subject => subject.name);
//         const centerServices = services.filter(service => service.center_id === center.id).map(service => service.name);

//     // Calcul de la valeur de "draft"
//     const draft = (centerImages.length > 0 ? 1 : 0) +
//                     (centerLevels.length > 0 ? 1 : 0) +
//                     (centerSubjects.length > 0 ? 1 : 0) +
//                     (centerServices.length > 0 ? 1 : 0);

//         return {
//             ...center,
//             images: centerImages,
//             levels: centerLevels,
//             subjects: centerSubjects,
//             services: centerServices,
//             draft 
//         };
//     });

//     // console.log(centersWithDetails);
    
//     return centersWithDetails;
// }

// // -----------------------------------------------------------

// // authenticate first before retriving detals

// export async function getUserCentersWithDetails(userId) {
//     // authenticate first before retriving detals

    
//     // Step 1: Get all centers for the user
//     const centers = db.prepare("SELECT * FROM centers WHERE user_id = ?").all(userId);

//     if (centers.length === 0) {
//         return []; // No centers found for the user
//     }

//     // Step 2: Get all images for the user's centers
//     const centerIdsList = centers.map(center => center.id); // Extract the center ids

//     const images = db.prepare(`
//         SELECT * FROM images WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 3: Get all levels for the user's centers
//     const levels = db.prepare(`
//         SELECT * FROM levels WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 4: Get all subjects for the user's centers
//     const subjects = db.prepare(`
//         SELECT * FROM subjects WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 5: Get all services for the user's centers
//     const services = db.prepare(`
//         SELECT * FROM services WHERE center_id IN (${centerIdsList.join(",")})
//     `).all();

//     // Step 6: Attach images, levels, subjects, and services to corresponding centers
//     const centersWithDetails = centers.map(center => {
//         const centerImages = images.filter(image => image.center_id === center.id).map(image => image.name);
//         const centerLevels = levels.filter(level => level.center_id === center.id).map(level => level.name);
//         const centerSubjects = subjects.filter(subject => subject.center_id === center.id).map(subject => subject.name);
//         const centerServices = services.filter(service => service.center_id === center.id).map(service => service.name);

//     // Calcul de la valeur de "draft"
//     const draft = (centerImages.length > 0 ? 1 : 0) +
//                     (centerLevels.length > 0 ? 1 : 0) +
//                     (centerSubjects.length > 0 ? 1 : 0) +
//                     (centerServices.length > 0 ? 1 : 0);

//         return {
//             ...center,
//             images: centerImages,
//             levels: centerLevels,
//             subjects: centerSubjects,
//             services: centerServices,
//             draft 
//         };
//     });

//     // console.log(centersWithDetails);
    
//     return centersWithDetails;
// }

// // -----------------------------------------------------------

// export async function getUserListings(id) {
//     const rows = db.prepare("SELECT * FROM centers WHERE user_id = ?").all(id);
//     return rows;
// }

// // -----------------------------------------------------------
// // -----------------------------------------------------------

// export async function getOffers() {
//     const rows = db.prepare("SELECT * FROM offerslist").all();
//     return rows
// }

// // -----------------------------------------------------------

// export async function getServices() {
//     const rows = db.prepare("SELECT * FROM serviceslist").all();
//     return rows
// }

// // -----------------------------------------------------------

// export async function getSubjects() {
//     const rows = db.prepare("SELECT * FROM subjectslist").all();
//     return rows
// }

// // -----------------------------------------------------------

// export async function getLevels() {
//     const rows = db.prepare("SELECT * FROM levelslist").all();
//     return rows
// }

// // 

// export async function getDescriptions() {
//     try{ 
//         const centers = db.prepare("SELECT * FROM descriptions").all();
//         if (centers.length === 0) {
//             return []; 
//         }
//         return centers;
//     } catch (error) {
//         return handleDbError(error);
//     }
// }
