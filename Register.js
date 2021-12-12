const Register = (transactions,sort) => {
    // const sortby = require("./Sort");
    // sortby(transactions, sort);


    console.log(transactions)
    // var Content = [];
    // var sum = {};
    // var total = [];

    // for (row in transactions) {
    //     //Checa cuantos hay (row)
    //     var movements = transactions[row]["movements"].length;
    //     var date = transactions[row]["date"];
    //     date = date.replace(/\//g, "-");
    //     var description = transactions[row]["description"];

    //     console.log(`${date} ${description}`);
    //       //Redondeo de valores
    //       function round(x) {
    //         return Number.parseFloat(x).toFixed(2);
    //     }

    //     for (var i = 0; i < movements; i++) {
    //         var amount = transactions[row]["movements"][i]["amount"];
    //         var curr = transactions[row]["movements"][i]["currency"];
    //         var desc = transactions[row]["movements"][i]["description"];
    //         //Checa si el objeto tiene la llave
    //         if (sum.hasOwnProperty(curr)) {
    //             sum[curr] += amount;
    //         } else {
    //             sum[curr] = amount;
    //         }
    //         total.push(sum[curr]);

    //         var state = [desc, amount, curr];
    //         Content.push(state);

    //         new_desc = desc.padEnd(40, ".");
    //         new_curr = curr.padEnd(10, ".");
    //         new_amount = round(amount);
    //         new_sum = round(sum[curr]);
    //         //Cadena Fancy
    //         console.log(`${new_desc} ${new_curr} ${new_amount} ${new_curr} ${new_sum}`);

    //     }

    //     for (quantity in sum) {
    //         new_quantity = quantity.padEnd(77, ".");
    //         new_total = round(sum[i]);
    //         console.log(new_quantity, new_total);
    //     }
    // }
};
module.exports = Register;
