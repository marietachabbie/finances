const Utils = require('./utils');
const plan = Utils.plan;
const { getCurrentMonth } = require('./time');

const suggestOptions = async function() {
  const currentMonth = getCurrentMonth();
  const startInput = await Utils.readLineAsync('Would you like to see the data of (month/remaining/specific)?\n');
  switch (startInput) {
    case 'm':
      Utils.readData(`${currentMonth}.json`);
      break;
    case 'r':
      Utils.readData(`${currentMonth}_remaining.json`);
      break;
    case 's':
      console.log('What exactly? Available options are:');
      const expenseInput = await Utils.readLineAsync(Object.keys(plan).join(' ') + '\n');
      Utils.readSpecificData(expenseInput);
      break;
    default:
      console.log('Something I cannot understand!');
      Utils.suggestOptions();
  }
}

const execute = async function() {
  const startInput = await Utils.readLineAsync('What you have got? (salary/expense/add/other)\n');
  switch (startInput) {
    case 's':
      Utils.finalizeAndStartNewMonth();
      break;
    case 'e':
      console.log('What did you spend on and how much? (ex: hair=2000 cloths=4000)\nAvailable options are:');
      const expenseInput = await Utils.readLineAsync(Object.keys(plan).join(' ') + '\n');
      if (expenseInput.length > 0) {
        const groupOfSpendings = expenseInput.split(' ');
        Utils.addNewdData(groupOfSpendings, '-')
      } else {
        execute();
      }
      break;
    case 'a':
      console.log('What are you adding to and how much? (ex: hair=2000 cloths=4000)\nAvailable options are:');
      const addingInput = await Utils.readLineAsync(Object.keys(plan).join(' ') + '\n');
      if (addingInput.length > 0) {
        const groupOfAddings = addingInput.split(' ');
        Utils.addNewdData(groupOfAddings, '+');
      } else {
        execute();
      }
      break;
    case 'o':
      suggestOptions();
      break;
    default:
      console.log('Something I cannot understand!')
      execute();
    }
}

execute();
