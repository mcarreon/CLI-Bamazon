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



function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        results.forEach(function (e) {
            console.log('\n----------');
            console.log(`Item ID: ${e.item_id}`);
            console.log(`${e.product_name}`);
            console.log(`Price $${e.price}`);
            console.log('----------\n');
            
        });

        promptUser();

    });


}

function updateItem(id, quantity, buyCount) {
    var itemID = id;
    var stockQunatity = quantity;
    var purchaseCount = buyCount;
    var setQuantity = quantity - buyCount;
    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [setQuantity, itemID], function (err, resutls) {
        if (err) throw err;
        console.log(results);
    });
}

function promptUser() {
    inquirer
        .prompt([{
                name: 'buyID',
                type: 'input',
                message: 'Enter product ID: '
            },
            {
                name: 'buyCount',
                type: 'input',
                message: `How many units of would you like? `
            }
        ])
        .then(function (res) {
            connection.query("SELECT * FROM products WHERE item_id = ?", [res.buyID], function (err, results) {
                if (err) throw err;
                if (results.length === 0 || res.buyCount == 0) {
                    console.log('Invalid ID');
                    console.log('Please enter a valid ID');
                    promptUser();
                }
                else if (results[0].stock_quantity >= res.buyCount) {
                    console.log(`Your total is ${results[0].price * res.buyCount}`);
                    console.log(`Deducting ${res.buyCount} from item stock.`);
                    //updateItem(res.buyID, results[0].stock_quantity, res.buyCount);
                    var stockQuantity = results[0].stock_quantity;
                    var purchaseCount = res.buyCount;
                    var setQuantity = stockQuantity - purchaseCount;

                    var product_sales = results[0].product_sales;
                    var userSale = res.buyCount * results[0].price;
                    console.log(userSale);
                    var currentSale = userSale + product_sales;
                    console.log(currentSale); 

                    connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [setQuantity, currentSale, res.buyID], function (err, results) {
                        if (err) throw err;
                    });
                    exit();

                } 
                else {
                    console.log(`Out of Stock! We have ${results[0].stock_quantity} items left.`);
                    exit();

                }

            });
        });
}

function exit() {
    inquirer
        .prompt({
            name: 'exit',
            type: 'rawlist',
            message: 'Would you like to continue shopping?',
            choices: ['Yes', 'No']
        })
        .then(function (res) {
            if (res.exit === 'No') {
                process.exit();
            } else {
                displayItems();
            }
        })
}



connection.connect(function (err) {
    if (err) throw err;

    displayItems();

});

