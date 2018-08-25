require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: process.env.DB_PASS,
    database: "bamazon_db"
});

function start() {
    inquirer
        .prompt([{
            name: 'menu',
            type: 'list',
            message: 'Welcome. Please pick an option.',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
        }])
        .then(function (res) {
            switch (res.menu) {
                case 'View Products for Sale':
                    displayProducts();
                    break;
                case 'View Low Inventory':
                    viewLowInv();
                    break;
                case 'Add to Inventory':
                    addToInv();
                    break;
                case 'Add New Product':
                    addNewProd();
                    break;
                case 'Exit':
                    process.exit();
                    break;
                default:
                    console.log('Bad entry, try again');
                    start();
            }
        });
}

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //console.log(results);
        results.forEach(function (e) {
            console.log('\n----------');
            console.log(`Item ID: ${e.item_id}`);
            console.log(`${e.product_name}`);
            console.log(`Price $${e.price}`);
            console.log(`Available Stock: ${e.stock_quantity}`)
            console.log('----------\n');
        });

        start();
    });
}

function viewLowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        //console.log(results);
        results.forEach(function (e) {
            console.log('\n----------');
            console.log(`Item ID: ${e.item_id}`);
            console.log(`${e.product_name}`);
            console.log(`Price $${e.price}`);
            console.log(`Available Stock: ${e.stock_quantity}`)
            console.log('----------\n');
        });

        start();
    });
}

function addToInv() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        //console.log(results);
        results.forEach(function (e) {
            console.log('\n----------');
            console.log(`Item ID: ${e.item_id}`);
            console.log(`${e.product_name}`);
            console.log(`Available Stock: ${e.stock_quantity}`)
            console.log('----------\n');
        });

        inquirer
            .prompt([
                {
                    name: 'itemID',
                    type: 'input',
                    message: 'Enter ID of item you would like to add to: '
                },
                {
                    name: 'addStock',
                    type: 'input',
                    message: 'Enter amount of stock to add: '
                }
            ])
            .then(function (res) {
                if (res.addStock <= 0) {
                    console.log('Please enter valid number of stock to add.');
                    console.log(`Quantity entered: ${res.addStock}`);
                    start();
                }
                else {
                    connection.query("SELECT * FROM products WHERE item_id = ?", [res.itemID], function (err, results) {
                        if (err) throw err;
                        if (results.length === 0) {
                            console.log('Invalid ID');
                            console.log('Please enter a valid ID');
                            start();
                        } else {
                            console.log(`Item ID entered: ${res.itemID}`);
                            console.log(`Quantity entered: ${res.addStock}`);
                            //updateItem(res.buyID, results[0].stock_quantity, res.buyCount);
                            var stockQuantity = results[0].stock_quantity;
                            var stockToAdd = parseInt(res.addStock);
                            var totalStock = stockQuantity + stockToAdd;
                            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [totalStock, res.itemID], function (err, results) {
                                if (err) throw err;
                                console.log('Stock updated.');
                                console.log(`Updated Stock: ${totalStock}`);
                                start();
                            });
                        }
                    });
                }
            });
    });
}

function addNewProd() {
    inquirer
        .prompt([
            {
                name: 'newName',
                type: 'input',
                message: 'Please enter product name: ',
            },
            {
                name: 'newDepartment',
                type: 'input',
                message: 'Please enter product department: ',
            },
            {
                name: 'newPrice',
                type: 'input',
                message: 'Please enter product price (ex. 1.99): ',
            },
            {
                name: 'newStock',
                type: 'input',
                message: 'Please enter initial stock: ',
            }
        ])
        .then(function (results) {
            console.log('\n----------');
            console.log('Review Input');
            console.log('----------');
            console.log(`Product Name: ${results.newName}`);
            console.log(`Department: ${results.newDepartment}`);
            console.log(`Price $${results.newPrice}`);
            console.log(`Initial Stock: ${results.newStock}`)
            console.log('----------\n');

            var invalidField = false;
            for (var x in results) {
                if (results[x] === '' || results[x] === undefined) {
                    invalidField = true;
                }
            }
            
            if (invalidField) {
                console.log('Invalid field detected.')
                console.log('Please fix invalid field(s).');
                console.log('----------\n');
                start();
            }
            else {
                inquirer
                .prompt({
                    name: 'confirm',
                    type: 'rawlist',
                    message: 'Confirm entry: ',
                    choices: ['Yes', 'No']              
                })
                .then(function(confirm) {
                    switch (confirm.confirm) {
                        case 'Yes':
                            var addQuery = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ( ?, ?, ?, ?)';
                            var params = [results.newName, results.newDepartment, results.newPrice, results.newStock];
                            connection.query(addQuery, params, function(err, mysqlResults) {
                                if (err) throw err;
                                console.log('Item added');
                                start();
                            });
                        break;
                        case 'No':
                            start();
                        break;
                        default:
                            start();
                        break;
                    }
                });
            }
            
        });
}

start();