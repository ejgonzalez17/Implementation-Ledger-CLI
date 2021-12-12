#!/usr/bin/env node
const program = require('commander');
program.version('0.0.1');
const fs = require("fs");

function Exist(path){ 
    if (fs.existsSync( "ledger-sample-files/"+ path )) 
    {
        const tokenizer = require("./Regex");
        transactions = tokenizer(path); 

        return true;

    } else {
        console.log("Error: No path file was specified ");   
        return false;
    }    
}

//-------------------------------Commands----------------------------
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
     
    if(Exist(path)) {
            Register(transactions,program.sort);
    } 
    else{
        console.error("This file doesnt exists");
         return;
    }
})

  program.parse(process.argv); // Explicit, node conventions

//------------------------------ Flags------------------------------
program
.option('-f, --file' ,'')
.action()

program
.option('-s, --sort ' ,'')
.action()

program
.option('-pdb,--price-db' ,'')
.action()

  const options = program.opts();
  if (options.file) console.log("optionsaasaaaadsaasad");


//-------------------------REGISTER ------------------------------
function Register(transactions,sort){ 
    // const sortby = require("./Sort");
    // sortby(transactions, sort);

    var Content = [];
    var sum = {};
    var total = [];

    for (row in transactions) {
        //Checa cuantos hay (row)
        var movements = transactions[row]["movements"].length;
        var date = transactions[row]["date"];
        date = date.replace(/\//g, "-");
        var description = transactions[row]["description"];

        console.log(`${date} ${description}`);
          //Redondeo de valores
          function round(x) {
            return Number.parseFloat(x).toFixed(2);
        }

        for (var i = 0; i < movements; i++) {
            //console.log(transactions[row]["movements"][i])
            var amount = transactions[row]["movements"][i]["amount"];
            var curr = transactions[row]["movements"][i]["currency"];
            var desc = transactions[row]["movements"][i]["description"];
            //Checa si el objeto tiene la llave
            if (sum.hasOwnProperty(curr)) {
                sum[curr] += amount;
            } else {
                sum[curr] = amount;
            }
            total.push(sum[curr]);

            var state = [desc, amount, curr];
            Content.push(state);

            new_desc = desc.padEnd(40, " ");
            new_curr = curr.padStart(40, " ");
            new_amount = round(amount);
            new_sum = round(sum[curr]);
            //Cadena Fancy
            console.log(`${new_desc} ${curr} ${new_amount} ${new_curr} ${new_sum}`);
            // ${new_sum}
            

        }

        for (quantity in sum) {
            new_quantity = quantity.padStart(90, " ");
            new_total = round(sum[quantity]);
            console.log(new_quantity, new_total);
        }
    }
   
}

//-------------------------BALANCE------------------------------
function Balance(transactions,sort)
{ 
 
   
}