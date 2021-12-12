//--------------------------------------------------------------------------
// ; Bitcoin trades
// 2012/11/16 Sold some bitcoins
// 	Asset:Bitcoin Wallet	-3.5 BTC
// 	Bank:Paypal		$42.21
// 2012/11/29 Purchased bitcoins
// 	Asset:Bitcoin Wallet   	15 BTC
// 	Bank:Paypal		-$300

//--------------------------With Tokenizacion--------------------------------------

// [
//     {
//       movements: [ [Object], [Object] ],
//       date: '2012/11/16',
//       description: 'Sold some bitcoins'
//     },
//     {
//       movements: [ [Object], [Object] ],
//       date: '2012/11/29',
//       description: 'Purchased bitcoins'
//     }
//   ]

//------OBJECT
// [
//     { description: 'Bank:Paypal', amount: 350, currency: '$' },
//     { description: 'Income:Hard Work', amount: -350, currency: '$' }
//   ]


//Facilitar lectura linea por linea
const lineByLine = require('n-readlines');

const tokenizer = (file) => { 
    
    const entry = new lineByLine(`ledger-sample-files/${file}`);
    let row = "";
    let operations={}
    let movement={}
    var transactions = []
    let currency;
    let aux=0;
    //Mientras haya una sig linea lee la sig linea 
    while (row = entry.next())
    {
        //El uso de ledger en el shell de comandos de Windows tiene una limitación significativa. CMD.EXE está limitado a caracteres ASCII estándar y, como tal, no puede mostrar ningún símbolo de moneda que no sea el signo de dólar.PS
       
        row = row.toString('ascii');
        
        if(row[0]!=";"){
            let SecondRow = row.match(/^(\d{4}\/\d{1,2}\/\d{1,2})\s(.*)/);
            let MovRow=row.match(/(^[^\-?\$?\d+\.?\d+$]+)(.*)?/);

            //Second Row         2012/11/16 Sold some bitcoins
            if(SecondRow){
 
                if (Object.entries(operations).length!=0) 
                {
                    //Si se lee otra fecha se puede pushear al arreglo
                    transactions.push(operations);

                } 
                operations = { movements: []}
                //Separate in date - descripction
                let date = (SecondRow[1]);
                let description = (SecondRow[2]);
                operations['description'] = description;
                operations['date'] = date;
            }

            if(MovRow)
            { 
                movement['description'] = MovRow[1].trim();        
               

                if(MovRow[2])
                {
                    let quantity = MovRow[2].trim();
                    let amount;
                    if(quantity[0]=="$" || quantity[1]=="$" ){
                        quantity = quantity.replace('$','');
                        
                        amount = parseFloat(quantity);
                        currency = '$';
                        
                    }
                    else {
                        quantity = quantity.split(' ');       
                        //In case -3.5 BTC 
                        amount = parseFloat(quantity[0]);
                        currency = quantity[1];
                    }
                    aux += amount;
                    
                    movement['amount'] = amount;
                    movement['currency'] = currency;
                }
                else{
                    movement['amount'] = -aux;
                    movement['currency'] = currency;
                    aux = 0;
                }
                operations['movements'].push(movement);
                //Restart Movment para tomar otros movimientos!
                movement = {}
              //  console.log(movement)
            }
        }
           
    }
   transactions.push(operations);
    // console.log(transactions[0]);
    return transactions;       
}

module.exports = tokenizer;