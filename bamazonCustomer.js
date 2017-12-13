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
      console.log("Product ID: ", results[i].item_id, "Product: ", results[i].product_name, "Price: ", results[i].price);
    }
itemQuestion();

  });
});

function itemQuestion (){
  inquirer.prompt([
    {
      name: "id",
      message: "What item would you like to buy? Please enter the item ID."
    }, {
      name: "quantity",
      message: "How many do you want?"
    },
  ]).then(function(answers) {

    console.log(answers);

    connection.query("select stock_quantity from products where item_id = " + answers.id, function(err, results) {
if (answers.quantity > results) {
  console.log("I'm sorry there is insufficiant quantity to purchase " + answers.quantity + ".");
} else {
  console.log("Your total is " + orderTtotal + ".");
  removeQuantity()
}
    });

  });

}

function removeQuantity(answers.quantity) {
  
}
