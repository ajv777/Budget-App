// BUDGET CONTROLLER
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // Prototype chain
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
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
    // incomes - expensives
    budget: 0,
    // expensives / incomes
    percentage: 0,
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

    deleteItem: function (type, id) {
      var ids, index;
      // Map: return a new array with all id
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        // Splice: remove elements (start by index and delete 1 element)
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // 1. calculate total incomes and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      // 2. calculate the budget (inc - exp)
      data.budget = data.totals.inc - data.totals.exp;

      // 3. calculate the percentage of incomes that we spent (exp/inc)
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = 1;
      }
    },

    // Calculate and get percentages (using map, return an array with all percentages)
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI Controller
var UIController = (function () {
  var DOMstrings = {
    // Add item
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    // Print item
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    // Print budget
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    // Delete item
    container: ".container",
    // Print percentages of expenses
    expensesPercLabel: ".item__percentage",
  };
  // Format numbers (+incomes -expenses with "," and 2 decimals)
  var formatNumber = function (num, type) {
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    // Ej. 2310.4567 -> + 2,310.46
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
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
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button> </div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the text
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

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

    // Delete item from the DOM
    deleteListItem: function (selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(document.getElementById(selectorID));
    },

    // Print the budget
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "--";
      }
    },

    // Print percentages of expenses
    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      // This function is the callback in "var nodeListForEach"
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    // To became in public and use it in the Global Controller
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL CONTROLLER: pass the other two modules as arguments
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctlDeleteItem);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetController.calculateBudget();

    // 2. Return the budget
    var budget = budgetController.getBudget();

    // 3. Display the budget in the UI
    // console.log(budget);
    UIController.displayBudget(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate the percentages
    budgetController.calculatePercentages();
    // 2. Read percentages for the budget Controller
    var percentages = budgetController.getPercentages();
    // 3. Update in the UI
    console.log(percentages);
    UIController.displayPercentages(percentages);
  };

  var ctlAddItem = function () {
    var input, newItem;
    // 1. Get the field input value
    input = UIController.getinput();
    // console.log(input);

    // 2. Add the item to the budget controller
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );
    }
    console.log(newItem);

    // 3. Add the item to the UI controller
    UIController.addListItem(newItem, input.type);

    // 4. Clear the fields
    UIController.clearFields();
    // console.log("it works");

    // 5. Calculate and update budget
    updateBudget();

    // 6. Calculate and update percentages
    updatePercentages();
  };

  // Delete an item
  var ctlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // split: inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1. Delete item from the array
      budgetController.deleteItem(type, ID);

      // 2. Delete from the ui
      UIController.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Update and show the new percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started.");
      // Reset to 0
      UIController.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: -1,
      });
      setupEventListener();
    },
  };
})(budgetController, UIController);

// Application has started
controller.init();
