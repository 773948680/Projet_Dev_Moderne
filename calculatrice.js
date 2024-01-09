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