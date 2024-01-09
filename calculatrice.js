import rawlist from "@inquirer/rawlist";
import inquirer from "inquirer";


// Déclaration des fonctions primaires plus(+), moins(-), multiplier(*), diviser(/).
const plus = (...args) => {
    let total = 0;
    for(const arg of args){
        total += arg; 
    };
    return total;
};
const moins = (a, b) => a - b;
const multPar = (...args) => {
    let total = 1;
    for(const arg of args){
        total *= arg;
    };
    return total;
};
const divPar = (a, b) => {
    if(b === 0){
        throw Error ("Il est imposible de faire une division par zéro");
    }
    return a / b;
};
// exit function gère la sortie immédiate
const exit = () => {
    process.exit();
};
// La fonction calculer utilise un switch pour choisir l'opération à faire
const calculer = (operation) => {
    switch(operation){
        case "plus":
            return plus;
        case "moins":
            return moins;
        case "multiplierPar":
            return multPar;
        case "diviserPar":
            return divPar;
        case "exit":
            exit();
        break;
        default:
            return (a, b) => "Impossible de faire cette opération";
    };
};
// Calculatrice est la fonction constructor
const Calculatrice = (operation, ...args) => {
    let dic = new Map();
    dic.set("plus", " + ");
    dic.set("moins", " - ");
    dic.set("multPar", " * ");
    dic.set("divPar", " / ");

    try{
        console.log("Résultat de " + args.join(dic.get(operation)) + " = ",
        calculer(operation)(...args));
    }catch(err){
        console.error(err.message);
    };
};

const myRawlist = async () => {
    return await rawlist({
         message: 'Select your operation',
         choices: [
           { name: 'plus', value: 'plus' },
           { name: 'moins', value: 'moins' },
           { name: 'multPar', value: 'multPar' },
           { name: 'divPar', value: 'divPar' },
           { name: 'exit', value: 'exit' },
         ],
       });
 };

 const operation = await myRawlist();

if(operation === "exit") exit();

inquirer
    .prompt([
        {
            type: 'input',
            name: "calculatrice",
            message: "Taper les nombres"
        },
    ])
    .then((answers) => {
        const numbers = answers.calc.trim().split(" ");
        const theArg = numbers.map(Number);

        Calculatrice(operation, ...theArg);
        exit();
});