#!/usr/bin/env node
const program = require('commander');
program.version('0.0.1');
const fs = require("fs");


function FileExist(path){ 
    if (fs.existsSync( "ledger-sample-files/"+ path )) {
        const parseo = require("./Parseo");

        transactions = parseo(path); 

    } else {
        console.log("Error: No path file was specified ");   
        return false;
    }    
}

// Options

program
.option('-f, --file' ,'Read journal data from FILE.')
.action(
    console.log("igigib")
)







program
.command('print <path>')
.alias('pr')
.description('Print out the full transactions of any matching postings')
.action(function(path) {
    fs.readFile("ledger-sample-files/" + path, "utf8", (err, data) => 
    {
        if (err) {
            console.error("This file doesnt exists");
            return;
        }
        console.table(data);
    });
})


  program
.command('register <path>')
.alias('rg')
.description('')
.action(function(path) {
    if(FileExist(path)) {
        fs.readFile("ledger-sample-files/" + path, "utf8", (err, data) => 
        {
            transactions = data;
            if (err) {
                console.error("This file doesnt exists");
                return;
            }
            const Register = require("./Register");
            Register(transactions,program.sort);
        
        }); 
    } 
})

  program.parse(process.argv); // Explicit, node conventions


 


