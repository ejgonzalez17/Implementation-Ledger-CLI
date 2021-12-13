#!/usr/bin/env node
const program = require("commander");
const lineByLine = require("n-readlines");
program.version("0.0.1");
const fs = require("fs");

const { parse } = require("path");

function Exist(path) {
    if (fs.existsSync("ledger-sample-files/" + path)) {
        const tokenizer = require("./Regex");
        transactions = tokenizer(path);
        //Check if there is CLASSIFICATION "n" or "d"
        options2 = program.opts();
        if (options2.sort) {
            transactions = Sort(transactions, options2);
        }
        //---------------Price-db Logical
        if (options2.priceDb) {
            if (options2.market === true) {
                PDpath = options2.priceDb;
                PriceDB(PDpath);
            } else {
                console.error(
                    "\x1b[31m",
                    "Please use the flag -mk/--market with the -pb/--price-db flag",
                    "\x1b[0m"
                );
            }
            return true;
        }

        return true;
    } else {
        console.log("Error: No path file was specified ");
        return false;
    }
}

//-------------------------------Commands----------------------------
program
    .command("print <path>")
    .alias("pr")
    .description("Print out the full transactions of any matching postings")
    .action(function (path) {
        if (Exist(path)) {
            Print(transactions, program.sort);
        } else {
            console.error("This file doesnt exists");
            return;
        }
    });

program
    .command("register <path>")
    .alias("rg")
    .description("")
    .action(function (path) {
        if (Exist(path)) {
            Register(transactions, program.sort);
        } else {
            console.error("This file doesnt exists");
            return;
        }
    });

program
    .command("balance <path>")
    .alias("bl")
    .description("")
    .action(function (path) {
        if (Exist(path)) {
            Balance(transactions, program.sort);
        } else {
            console.error("This file doesnt exists");
            return;
        }
    });
//------------------------------ Flags------------------------------
program.requiredOption("-f, --file ", "").action();

program.option("-s, --sort <type> ", "").action();

program.option("-pdb,--price-db <path>", "").action();

program.option("-mk,--market", "").action();

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

//-------------------------PRICE-DB------------------------------
New_commodity = "";
coinage = "";

function PriceDB(PDpath) {
    CountDT = {};
    if (fs.existsSync("ledger-sample-files/" + PDpath)) {
        const ContentDB = new lineByLine(`ledger-sample-files/${PDpath}`);
        let commodity; //money currency
        let DT; //Datetime
        let line = "";
        while ((line = ContentDB.next())) {
            line = line.toString("ascii");
            let P = line.match(
                /(\d{2,4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}:\d{2})(([^\-?\$?\d+\.?\d+$]+)(.*)?)/
            );
            if (line[0] == "N") {
                New_commodity = line.replace("N", "").trim();
            }
            if (line[0] == "P") {
                // console.log(line);
                if (P) {
                    commodity = P[3].trim();
                    if (!CountDT[commodity]) {
                        //First time 
                        coinage=P[4].trim();
                        CountDT[commodity] = {
                            value: coinage,
                            dateTime: P[1].trim(),
                        };
                    } else {
                        
                        //Found another commodity/money currency on another date
                        DT = P[1].trim();
                        if ( new Date(CountDT[commodity].dateTime) < new Date(DT) ) 
                        {
                            coinage = P[4].trim();
                            coinage = coinage.replace("$", "");
                            
                            CountDT[commodity] = {
                                value: coinage,
                                dateTime: P[1].trim(),
                            };
                        }
                    }
                }
            }
        }
        // console.log(CountDT);
        // AG: { value: '$34.13', dateTime: '2012/11/25 05:04:00' },
        // AU: { value: '$1751.90', dateTime: '2012/11/25 05:04:00' },
        // BTC: { value: '$12.46', dateTime: '2012/11/25 05:04:00' },
        // CAD: { value: '$1.0066', dateTime: '2012/11/26 05:04:00' }
        return {
            New_commodity: New_commodity,
            coinage: coinage,
        };
    } else {
        console.log( "\x1b[31m","Error: No path of PriceDB was specified ", "\x1b[0m"
        );
        return false;
    }
}

//-------------------------SORT ------------------------------
function SortBy_Des() {
    transactions.sort(function (a, b) {
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
    transactions.sort(function (a, b) {
        //return new Date(b.date) - new Date(a.date);
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return transactions;
}

function Sort(transactions, options2) {
    function SortBY(sort) {
        if (sort == "n") {
            return SortBy_Des(transactions);
        }
        if (sort == "d") {
            return SortBy_Date(transactions);
        }
    }
    return SortBY(options2.sort);
}

//-------------------------PRINT ------------------------------
function Print(transactions) {
    for (row in transactions) {
        var movements = transactions[row]["movements"].length;
        var date = transactions[row]["date"];
        date = date.replace(/\//g, "-");
        var description = transactions[row]["description"];

        console.log(`${date} ${description}`);

        for (var i = 0; i < movements; i++) {
            var amount = transactions[row]["movements"][i]["amount"];
            var curr = transactions[row]["movements"][i]["currency"];
            var desc = transactions[row]["movements"][i]["description"];
            new_desc = desc.padStart(40, " ") + "     ";

            if (options2.market === true) {
                value = 1;
                if (curr != New_commodity) {
                    value = CountDT[curr].value.replace("$", "");
                }
                new_amount = amount * value;
                new_amount = new_amount.toFixed(2);
                if (new_amount < 0) {
                    console.log(
                        "\x1b[31m",
                        `${new_desc} ${New_commodity} ${new_amount} `,
                        "\x1b[0m"
                    );
                } else {
                    console.log(
                        "\x1b[36m",
                        `${new_desc} ${New_commodity} ${new_amount} `,
                        "\x1b[0m"
                    );
                }
            } else {
                amount = amount.toFixed(2);
                if (amount < 0) {
                    console.log(
                        "\x1b[31m",
                        `${new_desc} ${curr} ${amount} `,
                        "\x1b[0m"
                    );
                } else {
                    console.log(
                        "\x1b[36m",
                        `${new_desc} ${curr} ${amount} `,
                        "\x1b[0m"
                    );
                }
            }
        }
    }
}

//-------------------------REGISTER ------------------------------
function Register(transactions) {
    // var options2 = program.opts();
    // if (options2.sort)
    // {
    //    transactions = Sort(transactions,options2 );
    // }
    var Content = [];
    var sum = {};
    var total = [];

    for (row in transactions) {
        var movements = transactions[row]["movements"].length;
        var date = transactions[row]["date"];
        date = date.replace(/\//g, "-");
        var description = transactions[row]["description"];

        console.log(`${date} ${description}`);
        
        function round(x) {
            return Number.parseFloat(x).toFixed(2);
        }

        for (var i = 0; i < movements; i++) {
            var amount = transactions[row]["movements"][i]["amount"];
            var curr = transactions[row]["movements"][i]["currency"];
            var description = transactions[row]["movements"][i]["description"];
            desc=description.padStart(50, " ");
            
            //Check if the object has the key
            if (sum.hasOwnProperty(curr)) {
                sum[curr] += amount;
            } else {
                sum[curr] = amount;
            }
            total.push(sum[curr]);

            var state = [desc, amount, curr];
            Content.push(state);

            let new_desc = desc.padEnd(60, " ");
            let new_curr = curr;
            //.padStart(40, " ");
            let new_amount = round(amount);
            let new_sum = round(sum[curr]);

            if (options2.market === true) {
                
                if (curr != New_commodity.trim()) {
                 value = CountDT[curr].value.replace("$", "");
                 let new_amountR = new_amount * value;
                 let N_sum=new_sum* value;

                 new_amountR=new_amountR.toFixed(2);
                 N_sum=N_sum.toFixed(2);
                 
                //  New_commodity = New_commodity.padStart(10, " ") ;
                        console.log( `${new_desc} ${New_commodity} ${new_amountR} ${New_commodity.padStart(20, " ")} ${N_sum}`);     
                }else
                { 
                        console.log(`${new_desc} ${curr} ${new_amount} ${new_curr.padStart(20, " ")} ${new_sum}`);
                }
            }
            else{
                 new_curr=new_curr.padStart(20, " ");
                 console.log( `${new_desc} ${curr} ${new_amount} ${new_curr} ${new_sum}`);
            // ${new_sum}
            }
        }
        let TotalA =0;
        let TotalB =0;
        let Total=0;
        for (quantity in sum) {
            let new_quantity = quantity.trim(); 
            let new_total = round(sum[quantity]);
            //.padStart(90, " ")
          
            if (options2.market === true) {
                if (quantity != New_commodity.trim()) {
                    value = CountDT[quantity].value.replace("$", "");
                    new_T=new_total*value;
                    TotalA+=new_T;
 
                    Total+=parseFloat(TotalA);
                } 
                else{
                    TotalB+=parseFloat(new_total);
                    Total+=parseFloat(TotalB);
                } 
            }
            else
            {
            console.log(new_quantity.padStart(90, " "), new_total);
            }
            
        }
        if (options2.market === true) 
        {
            console.log(New_commodity.padStart(90, " "),Total.toFixed(2));
        }
    }
}

//-------------------------BALANCE------------------------------
function Balance(transactions, sort) {
    // var options2 = program.opts();
    // if (options2.sort)
    // {
    //    transactions = Sort(transactions,options2 );
    // }

    let Content = {};
    for (file in transactions) {
        //Check the movements
        let movements = transactions[file]["movements"].length;

        for (let i = 0; i < movements; i++) {
            var amount = transactions[file]["movements"][i]["amount"];
            var curr = transactions[file]["movements"][i]["currency"];
            var description = transactions[file]["movements"][i]["description"];
            //Check description
            if (Content[description] != undefined) {
                Content[description][0] += amount;
            } else {
                Content[description] = [amount, curr];
            }
        }
    }
    let sum = {};
    let currency;
    let properties = Object.keys(Content);
    for (let des in properties) {
        currency = Content[properties[des]][1];
        if (sum.hasOwnProperty(currency)) {
            sum[currency] += Content[properties[des]][0];
        } else {
            sum[currency] = Content[properties[des]][0];
        }
    }
        let testsumA=0;
        let testsumB=0;
        let totalTEST=0;

    for (let i in properties) {
        let money = `${Content[properties[i]][1]} ${Content[properties[i]][0]}`;
        let qnt = money.padStart(20, " ") + "  ";

        //PriceDB
        let money_balance = 1;
        let value = 1;
        let curr;

        if (options2.market === true) {
            qnt = money.match(/(.*)\s(-?\d+\.?\d*)/);

            if (qnt) {
                curr = qnt[1];
                money_balance = qnt[2];
                if (curr != New_commodity.trim()) {

                    value = CountDT[curr].value.replace("$", "");
                    let new_amountB = money_balance * value;
                    new_amountB = new_amountB.toFixed(2);
                    New_commodity = New_commodity.padStart(10, " ") ;

                    testsumA=parseFloat(new_amountB) ;
                    totalTEST+=parseFloat(testsumA);


                    if (new_amountB > 0) {
                        console.log("\x1b[33m",`${New_commodity} ${new_amountB} ${properties[i]} `,"\x1b[0m");
                    } else {
                        console.log( "\x1b[31m",`${New_commodity} ${new_amountB} ${properties[i]} `,"\x1b[0m");
                    }
                }
                else {
                    testsumB=parseFloat(money_balance) ;
                    totalTEST+=parseFloat(testsumB);

                    if (Content[properties[i]][0] > 0) {
                      
                        console.log( "\x1b[33m",`${curr.padStart(10," ")} ${money_balance} ${properties[i]}`, "\x1b[0m");
                        
                    } else {
                        
                        console.log( "\x1b[31m",`${curr.padStart(10," ")} ${money_balance} ${properties[i]}`, "\x1b[0m");
                    }
                }
            }

        } else {
            if (Content[properties[i]][0] > 0) {
                // console.log( qnt, properties[i]);
                console.log("\x1b[33m", `${qnt} ${properties[i]}`, "\x1b[0m");
            } else {
                console.log("\x1b[31m", `${qnt} ${properties[i]}`, "\x1b[0m");
            }
        }
    }
    console.log("--------------------");
    let sumA=0;
    let sumB=0;
    let total=0; 
    for (var i in sum) {
        if (sum.hasOwnProperty(i)) {

            let balance = i.padStart(12, " ");
            if(options2.market === false){
                console.log(balance.padStart(15," "), sum[i]);
            }
        }
    }
    if (options2.market === true) 
    {
        console.log(New_commodity, totalTEST);
    }
}
