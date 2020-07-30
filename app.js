// Budget Controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    // empty array to save expensive and incomes
    allItems: {
      exp: [],
      inc: [],
    },
    // sum of expensives and incomes
    totals: {
      exp: 0,
      inc: 0,
    },
  };
  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push and return the new item: type exp it´s the same name that the array of expensives (and the same to incomes)
      data.allItems[type].push(newItem);
      return newItem;
    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI Controller
var UIController = (function () {
  var DOMstrings = {
    // Add
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    // Print
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };
  return {
    getinput: function () {
      // Return an object with the 3 inputs
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value, // item
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value), // $$
      };
    },
    // The same object that we created in the budget controller
    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create html string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div></div>';
      }
      // Replace the text
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description", obj.description);
      newHtml = newHtml.replace("%value", obj.value);

      // Insert the HTML into the DOM (as a last child in the list)
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    // Clear input field; convert the list in an array and use slice
    clearFields: function () {
      var fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArray[0].focus();
    },
    // To became in public and use it in the Global Controller
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// Global Controller: pass the other two modules as arguments
var controller = (function (budgetCtl, UICtl) {
  var setupEventListener = function () {
    var DOM = UIController.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keycode === 13 || event.which === 13) {
        // console.log("enter was pressed");
        ctlAddItem();
      }
    });
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    // 2. Return the budget
    // 2. Display the budget in the UI
  };

  var ctlAddItem = function () {
    var input, newItem;
    // 1. Get the field input value
    input = UIController.getinput();
    // console.log(input);

    // 2. Add the item to the budget controller
    newItem = budgetController.addItem(
      input.type,
      input.description,
      input.value
    );
    console.log(newItem);

    // 3. Add the item to the UI controller
    UIController.addListItem(newItem, input.type);

    // 4. Clear the fields
    UIController.clearFields();
    // console.log("it works");

    // 5. Calculate and update budget
    updateBudget();
  };
  return {
    init: function () {
      console.log("Application has started.");
      setupEventListener();
    },
  };
})(budgetController, UIController);

// Application has started
controller.init();
