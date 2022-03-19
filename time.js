const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];

const getCurrentMonth = () => {
  date = new Date();
  return months[date.getMonth()];
}

const getPreviousMonth = () => {
  date = new Date();
  return months[date.getMonth() - 1];
}

module.exports = {
  getCurrentMonth,
  getPreviousMonth,
}
