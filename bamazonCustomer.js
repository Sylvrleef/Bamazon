var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "^yours001",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  connection.query("select * from products", function(err, results, fields) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      console.log("Product ID:", results[i].item_id, "\nProduct:", results[i].product_name, "\nPrice: $" + results[i].price + ".00\n\n");
    }
    itemQuestion();

  });
});

function itemQuestion() {
  inquirer.prompt([{
    name: "id",
    message: "What item would you like to buy? Please enter the item ID."
  }, {
    name: "quantity",
    message: "How many do you want?"
  }, ]).then(function(answers) {

    connection.query("select * from products where item_id = " + answers.id, function(err, results) {
      if (answers.quantity > results[0].stock_quantity) {
        console.log("I'm sorry there is insufficiant quantity to purchase " + answers.quantity + " of " + results[0].product_name + ".");
        correctQuantity(answers.id, results[0].product_name);
      } else {
        removeQuantity(answers.quantity, answers.id, results[0].stock_quantity, results[0].price);
      }
    });
  });

};

function removeQuantity(quantity, id, num, price) {
  var orderTotal = quantity * price;
  console.log("Your total is $" + orderTotal + ".00.");
  var newQuantity = num - quantity;
  var sql = "UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + id + ";";
  var updatedQuantity = "SELECT stock_quantity FROM products;";
    connection.query(sql, function (err, results) {
      if (err) throw err;
      connection.query(updatedQuantity, function(err,results) {
        if(err) throw err;
      })
      connection.end();

    });

};

function correctQuantity(id, product){
  inquirer.prompt([{
    name: "correctQuantity",
    message: "How many do you want?"
  }, ]).then(function(answers) {

       connection.query("select * from products where item_id = " + id, function(err, results) {
        if (answers.correctQuantity > results[0].stock_quantity) {
          console.log("I'm sorry there is insufficiant quantity to purchase " + answers.correctQuantity + " of " + results[0].product_name + ".");
          correctQuantity(id);
        } else {
          var orderTotal = answers.correctQuantity * results[0].price;
          removeQuantity(answers.correctQuantity, id, results[0].stock_quantity, results[0].price);
        };
      });
    });
};
