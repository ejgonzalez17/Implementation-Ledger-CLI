#!/usr/bin/env node
const program = require('commander');
program.version('0.0.1');
const fs = require("fs");

function Exist(path){ 
    if (fs.existsSync( "ledger-sample-files/"+ path )) 
    {
        const tokenizer = require("./Regex");
        transactions = tokenizer(path); 
        //Revisar si hay SORT N o D 
        var options2 = program.opts();
          if (options2.sort) 
        {
        transactions = Sort(transactions,options2 );
        }
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
    if(Exist(path)) {
            Print(transactions,program.sort);
    } 
    else{
        console.error("This file doesnt exists");
         return;
    }
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

program
.command('balance <path>')
.alias('bl')
.description('')
.action(function(path) {
     
    if(Exist(path)) {
        Balance(transactions,program.sort);
    } 
    else{
        console.error("This file doesnt exists");
         return;
    }
})
//------------------------------ Flags------------------------------
program
.requiredOption('-f, --file ' ,'')
.action()

program
.option('-s, --sort <type> ' ,'')
.action()

program
.option('-pdb,--price-db' ,'')
.action()

program.parse(process.argv); // Explicit, node conventions

var options = program.opts();


// if(options.file)
// {
//  console.error("Forget the Falg -f");
//             return;
// }
// if (options.sort === undefined){
//     console.log('The way it was ordered was not specified (by Name "n" or date "d")');
//     return;
// } 

//-------------------------SORT ------------------------------
  function SortBy_Des() {
    transactions.sort(function(a, b) {
        var desc1 = a.description.toUpperCase(); 
        var desc2 = b.description.toUpperCase(); 
        if (desc1 < desc2) {
            return -1;
        }
        if (desc1 > desc2) {
            return 1;
        }
        return 0;
    }); 
    return transactions; 
}

function SortBy_Date() {
        transactions.sort(function(a,b) { 
        //return new Date(b.date) - new Date(a.date);
        return new Date(a.date).getTime() - new Date(b.date).getTime() 
    });
    return transactions;
}

function Sort(transactions,options2){
   
    function SortBY(sort) {
        if (sort == 'n') {
            return  SortBy_Des(transactions);
        } if (sort == 'd') { 
            return SortBy_Date(transactions);
        }
    } 
    return SortBY(options2.sort);
}

//-------------------------PRINT ------------------------------
function Print(transactions){
    for (row in transactions) {
        //Checa cuantos hay (row)
        var movements = transactions[row]["movements"].length;
        var date = transactions[row]["date"];
        date = date.replace(/\//g, "-");
        var description = transactions[row]["description"];

        console.log(`${date} ${description}`);

        for (var i = 0; i < movements; i++) {
            
            var amount = transactions[row]["movements"][i]["amount"];
            var curr = transactions[row]["movements"][i]["currency"];
            var desc = transactions[row]["movements"][i]["description"];
            new_desc = desc.padStart(40, " ")+"     ";
            console.log('\x1b[36m',`${new_desc} ${curr} ${amount} `,'\x1b[0m');
            
        }
    }
}
  
//-------------------------REGISTER ------------------------------
function Register(transactions)
{ 
    // var options2 = program.opts();
    // if (options2.sort) 
    // {
    //    transactions = Sort(transactions,options2 );
    // }
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
    // var options2 = program.opts();
    // if (options2.sort) 
    // {
    //    transactions = Sort(transactions,options2 );
    // }

    let Content = {}
    for (file in transactions) {
        //Checar los movimientos 
        let movements = (transactions[file]["movements"]).length;
        
        for (let i=0; i<movements; i++) {
            var amount = transactions[file]["movements"][i]["amount"]; 
            var curr = transactions[file]["movements"][i]["currency"];        
            var description = transactions[file]["movements"][i]["description"];
            //Checar descripcion
            if (Content[description]!=undefined) 
            {
                Content[description][0] += amount
            } 
            else
            {
                Content[description] = [amount, curr]
            }
        }
    }
     let sum = {}
     let currency;
     let properties = Object.keys(Content);
     for (let des in properties) {
        currency = Content[properties[des]][1]
        if (sum.hasOwnProperty(currency)){
            sum[currency] += Content[properties[des]][0]
        } else {
            sum[currency] = Content[properties[des]][0]
        }
    }         

    for (let i in properties){
        
        let money = `${Content[properties[i]][1] } ${Content[properties[i]][0]}`;
        let  qnt = money.padStart(20, " ")+ "  ";
        console.log( qnt, properties[i]); 
    };
    console.log('--------------------')
    
    for (var i in sum) {
        if (sum.hasOwnProperty(i)) 
        {        
            let balance = i.padStart(12, " ");   
            console.log(balance, sum[i]);
        }
    }
}