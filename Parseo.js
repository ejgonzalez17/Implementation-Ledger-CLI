//--------------------------------------------------------------------------
// ; Bitcoin trades
// 2012/11/16 Sold some bitcoins
// 	Asset:Bitcoin Wallet	-3.5 BTC
// 	Bank:Paypal		$42.21
// 2012/11/29 Purchased bitcoins
// 	Asset:Bitcoin Wallet   	15 BTC
// 	Bank:Paypal		-$300

//--------------------------With Parseo--------------------------------------

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

const Parseo = (file) => { 
    
    const entry = new lineByLine(`ledger-sample-files/${file}`);
    let row = "";
    let operations={}
    let movement={}
    var transactions = []
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
                    

                    if(quantity[0]=="$" || quantity[1]=="$" ){
                        quantity = quantity.replace('$','');
                        console.log(quantity)
                        // var monto = parseFloat(cantidad);
                        // var currency = '$';
                    }

                }
            }
 
    

        }

    }

    
}

module.exports = Parseo;