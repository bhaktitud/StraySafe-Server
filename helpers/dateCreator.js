function convert(year, month){
  if(!year || !Number(year)) {
    year = 0;
  }
  if(!month || !Number(month)) {
    month = 0;
  }

  let date = new Date().getDate();
  let newMonth = new Date().getMonth() + 1 - month;
  let newYear = new Date().getFullYear() - year;
  let result = new Date(`${newYear}-${newMonth}-${date}`);
  return result;
}

module.exports = {
  convert
}