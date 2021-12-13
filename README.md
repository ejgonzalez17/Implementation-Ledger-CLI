# Implementation Ledger CLI 
 Ledger-CLI Implementation 


## Description

Ledger is a double-entry accounting command line tool created by John Wiegley with a community of active contributors. It is an extremely potent tool and it takes some time and effort to be able to unleash its power. However, once mastered there is not much you may miss while doing personal or professional accounting.

Extensive documentation can be found at http://ledger-cli.org.

## Getting Started

### Dependencies

* comander.js
* ledgercli

### Prerequisites
Install Node, if you using Homebrew, then installing the node is breeze with just following command -
```
 brew install node
```


### Installing
#### 1.Clone the repo
```
 git clone git@github.com:ejgonzalez17/Implementation-Ledger-CLI.git
```

### Executing program

#### Commands
PRINT
```
 node index.js -f print balance FILE 
```
BALANCE
```
 node index.js -f balance balance FILE 
```
REGISTER
```
 node index.js -f register balance FILE 
```

#### Flags
-Sort By DateTime
```
node index.js -f -s d OPERATION FILE
```
-Sort By Name/Description
```
node index.js -f -s n OPERATION FILE
```
-Price-Db
```
node index.js -f --price-db prices_db -mk -ex CURRENCY OPERATION FILE
```


## License

This project is licensed under the [EJGONZALEZ17] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [ledger-cli](https://www.ledger-cli.org/3.0/doc/ledger3.pdf)
* [ledger-Commodity-Reporting](https://www.ledger-cli.org/3.0/doc/ledger3.html#Commodity-Reporting)
* [AboutLedger](https://lukasjoswiak.com/tracking-commodity-prices-in-ledger/)
