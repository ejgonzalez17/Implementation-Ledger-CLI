
function Sortby(transactions, Sort) {
    
    if (Sort == 'n') {
        return  sortByDescriptionName(transactions);
    } if (Sort == 'd') { 
        return sortByDate(transactions);
    }
} 


function sortByDescriptionName(transactions) {
    transactions.sort(function(a, b) {
        var nameA = a.description.toUpperCase(); 
        var nameB = b.description.toUpperCase(); 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }); 
    return transactions;
}

function sortByDate(transactions) {
    transactions.sort(function(a,b) { 
        return new Date(a.date).getTime() - new Date(b.date).getTime() 
    });
    return transactions;
}


module.exports = Sortby;
