const readline = require('readline');
const fs = require('fs');
const { getCurrentMonth, getPreviousMonth } = require('./time');

const plan = {
  YOUR_GOAL: YOUR_PREFERRED_AMOUNT,
  YOUR_GOAL: YOUR_PREFERRED_AMOUNT,
  YOUR_GOAL: YOUR_PREFERRED_AMOUNT,
}

const readLineAsync = (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer);
    });
  })
  .catch(error => {
    console.log(`Error while getting input: ${error.message}`)
  })
};

const finalizeAndStartNewMonth = async function() {
  return new Promise((resolve, reject) => {
    const previousMonth = getPreviousMonth();
    const currentMonth = getCurrentMonth();
    fs.readFile(`${previousMonth}_remaining.json`, (error, data) => {
      if (error) { reject(error) };
      
      const groupOfSpendings = JSON.parse(data);
      const currentMonthJson = [];
      const newSpending = {};

      for(let thing in plan) {
        let final = 0;
        if (thing in groupOfSpendings) {
          const amount = groupOfSpendings[thing];
          final += parseInt(amount);
        }
        newSpending[thing] = final + parseInt(plan[thing]);
      };
      
      currentMonthJson.push(newSpending);
      calculateFinalResult(currentMonthJson);

      fs.writeFile(`${currentMonth}.json`, JSON.stringify(currentMonthJson), (error, data) => {
        if (error) { reject(error) };
      })
    })

    console.log(`Successfully added data to ${currentMonth}.json`);
    resolve();
  })
  .catch((error) => console.log(`Error while reading | writing to the file: ${error.message}`))
}

const calculateFinalResult = (jsonData) => {
  const currentMonth = getCurrentMonth();
  const result = {};
  let sum = 0; let savings = 0;
  for (let thing in plan) {
    for (let obj of jsonData) {
      if (thing === 'savings' && obj[thing]) {
        savings += parseInt(obj[thing]);
      }
      if (thing in obj) {
        if (!(thing in result)) {
          result[thing] = 0;
        }
        result[thing] += parseInt(obj[thing]);
        sum += parseInt(obj[thing]);
      }
    }
  }
  result.total = sum - savings;

  fs.writeFile(`${currentMonth}_remaining.json`, JSON.stringify(result), (error, data) => {
    if (error) { reject(error) };
  })

  console.log(`Successfully calculated and added remainings to ${currentMonth}_remaining.json`);
}

const addNewdData = async function(groupOfSpendings, action) {
  const newSpending = {};
  for (let pair of groupOfSpendings) {
    const keyValue = pair.split('=');
    newSpending[keyValue[0]] = action == '-' ? - parseInt(keyValue[1]) : parseInt(keyValue[1]);
  }

  return new Promise((resolve, reject) => {
    const currentMonth = getCurrentMonth();
    fs.readFile(`${currentMonth}.json`, (error, data) => {
      if (error) { reject(error) };

      const currentJson = JSON.parse(data);
      currentJson.push(newSpending);
      calculateFinalResult(currentJson);

      fs.writeFile(`${currentMonth}.json`, JSON.stringify(currentJson), (error, data) => {
        if (error) { reject(error) };
      })

      console.log(`Successfully added data to ${currentMonth}.json`);
      resolve();
    })
  })
  .catch((error) => console.log(`Error while reading | writing to the file: ${error.message}`))
}

const readData = async function (filePath) {
  let remaining = {};
  if (!filePath.endsWith('_remaining.json')) {
    const currentMonth = getCurrentMonth();
    const data = fs.readFileSync(`${currentMonth}_remaining.json`);
    remaining = JSON.parse(data);
    delete remaining.total
  }

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) { reject(error) }

      const json = JSON.parse(data);
      // temporary solution
      if (Array.isArray(json)) {
        json.push(remaining);
      }
      console.table(json);
      resolve();
    })
  })
  .catch(error => {
    console.log(`Error while reading ${filePath}: ${error.message}`);
  })
}

const readSpecificData = async function(thing) {
  return new Promise((resolve, reject) => {
    let remaining = 0;
    const result = [];
    const currentMonth = getCurrentMonth();
    fs.readFile(`${currentMonth}.json`, (error, data) => {
      if (error) { reject(error) };

      const dataJson = JSON.parse(data);
      for (let spendings of dataJson) {
        if (thing in spendings) {
          const amount = parseInt(spendings[thing]);
          result.push(amount);
          remaining += amount;
        }
      }

      result.push(remaining);
      console.table(result);
      resolve();
    })
  })
  .catch((error) => console.log(`Error while reading the file: ${error.message}`))
}

 module.exports = {
  plan,
  readLineAsync,
  finalizeAndStartNewMonth,
  addNewdData,
  readData,
  readSpecificData,
 }
