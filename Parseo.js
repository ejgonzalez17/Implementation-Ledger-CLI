// ; Bitcoin trades
// 2012/11/16 Sold some bitcoins
// 	Asset:Bitcoin Wallet	-3.5 BTC
// 	Bank:Paypal		$42.21
// 2012/11/29 Purchased bitcoins
// 	Asset:Bitcoin Wallet   	15 BTC
// 	Bank:Paypal		-$300


// [
//     { description: 'Bank:Paypal', amount: 350, currency: '$' },
//     { description: 'Income:Hard Work', amount: -350, currency: '$' }
//   ]


//Facilitar lectura linea por linea
const lineByLine = require('n-readlines');

const Parseo = (file) => { 
    
    const entry = new lineByLine(`ledger-sample-files/${file}`);
    let line = entry.next();
    // while (line = entry.next()) {
         line = line.toString('ascii');
        console.log(line)
        // if  (line.startsWith(";")) {
            
        // }

        // else if (line.match(RGX_DATE)){
        //     if (JSON.stringify(transaccion)!='{}') {
        //         array_transactions.push(transaccion);
        //     } 
        //     transaccion = { movements: []}
            
        //     var date= (line.match(RGX_DATE).toString());
        //     transaccion['date'] = date;
        
        //     var description = (line.match(RGX_DESCRIPTION).toString().trim());
        //     transaccion['description'] = description; 


            
        // } else if (line.match(RGX_ACCOUNT_NAME)) {
        //     movement['description'] = line.match(RGX_ACCOUNT_NAME).toString().trim();
        //     if (line.match(RGX_AMOUNTTEST)) {
        //         var cantidad = line.match(RGX_AMOUNTTEST).toString().trim();
        //         if (cantidad.startsWith('$')|| cantidad.startsWith('-$')) {
        //             cantidad = cantidad.replace('$','');
        //             var monto = parseFloat(cantidad);
        //             var currency = '$';
        //         } else {
        //             cantidad = cantidad.split(' ');
        //             var monto = parseFloat(cantidad[0]);
        //             var currency = cantidad[1];
        //         }
        //         contador += monto;
        //         negcurrency = currency;
                
        //         movement['amount'] = monto;
        //         movement['currency'] = currency;
        //         account = {}
        //     } else {
        //         movement['amount'] = -contador;
        //         movement['currency'] = negcurrency;
        //         account = {}
        //         contador = 0;
        //     }
        //     transaccion['movements'].push(movement);
        //     movement = {}
        // }     
    // }
    // transactions.push(transaccion);
    
    //  console.log(sprintf("%5j",array_transactions));

    //  return transactions; 
}

module.exports = Parseo;