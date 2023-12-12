import prompt from "prompt-sync";
import { v4 as uuidv4 } from "uuid";
import { readFileSync, writeFileSync } from "node:fs";

//variable to store filename
const fileName = "database.json";

//1) get data from database
const DB = readData(fileName);

const coursCreated = createCours();
DB.cours.push(coursCreated);

// 2) créer un cours
function createCours(){
  try{
    const cours = verifyExistingCours(DB);

    const description = prompt()("Ecrire  description du cours: ");
    const inscrits = [];

    return {
      id: uuidv4(),
      titre: cours,
      description: description,
      inscrits: inscrits
    };

  }catch(error){
    console.log(error.message);
  };
};

// 3) crée prof instance
const prof = createProf();
DB.profs.push(prof);

function createProf(){
  try{
    const mail = verifyExistingProf(DB);
    
    const prenom = prompt()("Entrez le prénom du professeur: ");
    const nom = prompt()("Entrez le nom du professeur: ");
    const cours = "";

    return {
      id : uuidv4(),
      prenom : prenom,
      nom : nom,
      email : mail,
      cours: cours
    };

  }catch(error){
    console.log(error.message);
  };

};


// 4) créer et ajout l'etudiant dans la base de donnée
createStudent(DB);

// 5) sauvegarder dans la base de donnée
storeData(fileName, DB);


// 1) function to register student
function createStudent(data) {
  try {
    const nouvoEmail = promptEmailStudent(data);
    //demander de tapper le nouveau prenom et nom
    const nouvoPrenom = prompt()("Entrez votre prénom: ");
    const nouvoNom = prompt()("Votre nom: ");
    const choixCourse = prompt()("taper le choix de cours: ");
    const etudiant = {
      id: uuidv4(),
      nom: nouvoNom,
      prenom: nouvoPrenom,
      email: nouvoEmail,
      courses: [],
    };

    //ajout l'information de l'étudiant après creation de l'etudiant
    addStudent(data, etudiant, choixCourse);

  } catch (err) {
    console.log(err.message);
  }
}

function promptEmailStudent(data) {
  let nouvoEmail = null;
  let count = 0;
  do {
    if (count++ >= 3)
      throw Error("Vous avez essayé à trois reprises, réesayez ultérieurement. ");
    // demander de taper l'email de l'etudiant
    nouvoEmail = prompt()("Taper votre adresse mail: ");
    console.log("Nombre de tentatives = ", count);
  } while (data.etudiants.find((user) => user?.email === nouvoEmail));
  
  return nouvoEmail;
};

function verifyExistingProf(data) {
  let nouvoEmail = null;
  let count = 0;
  do {
    if (count++ >= 3)
      throw Error("Vous avez essayé à trois reprises, réesayez ultérieurement. ");
    // demander de taper l'email de l'etudiant
    nouvoEmail = prompt()("Taper l'email du prof: ");
    console.log("Nombre de tentatives = ", count);
  } while (data.profs.find((user) => user?.email === nouvoEmail));
  
    return nouvoEmail;
};

function verifyExistingCours(data) {
  let coursExist = null;
  let count = 0;
  do {
    if (count++ >= 3)
      throw Error("Vous avez essayé à trois reprises, réesayez ultérieurement. ");
    // demander de taper l'email de l'etudiant
    coursExist = prompt()("Entrez le titre du cours: ");
    console.log("Nombre de tentatives = ", count);
  } while (data.cours.find((user) => user?.titre === coursExist));
  
    return coursExist;
};

function fileExists(filename) {
  try {
    readFileSync(filename, "utf8");
    return true;
  } catch {
    return false;
  }
}

function initDatabase(filename) {
  let collection = {};
  collection.cours = [];
  collection.profs = [];
  collection.etudiants = [];


  storeData(filename, collection);
  return collection;
}

function loadDatabase(filename) {
 
  const dataBuffer = readFileSync(filename);

  const jsonData = JSON.parse(dataBuffer);
 
  return jsonData;
}

function readData(filename) {
  if (fileExists(filename)) {
    try {
      return loadDatabase(filename);
    } catch (error) {
      console.error("Error loading data", error);
    }
  } else {
    try {
      console.log("database successfully created!");
      return initDatabase(filename);
    } catch (error) {
      console.error("Error initialising database", error);
    }
  }
}

function storeData(filename, data) {

  const jsonData = JSON.stringify(data, null, 4);

  writeFileSync(filename, jsonData, { flag: "w" }, "utf-8", (err) => {
    if (err) throw err;
    console.log("database initialised successfully file name:", filename);
  });
}

function addStudent(data, etudiant, titre) {
  const cours = data.cours;
  const choix = cours.find((c) => c.titre === titre);

  if (choix) {
    etudiant.courses.push(titre);
    choix.inscrits.push(etudiant.email);
    data.etudiants.push(etudiant);
  } else {
    console.log("Ce cours n'existe pas !");
  }
}


function addCours(data, etudiant, titre) {
  const cours = data.cours;
  const choix = cours.find((c) => c.titre === titre);
  if (
    choix &&
    etudiant.courses.length <= 4 &&
    !etudiant.courses.includes(titre)
  ) {
    etudiant.courses.push(choix.titre);
    choix.inscrits.push(etudiant.email);
    data.etudiants.push(etudiant);
  };
};


function findStudentByEmail(data, email) {
  
  const existingStudent = data.etudiants.find((user) => user.email === email);
  if (existingStudent) return true;
  else return false;
};
