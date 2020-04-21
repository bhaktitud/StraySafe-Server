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

function setDate(year, month){
  if(!year || !Number(year)) {
    year = new Date().getFullYear();
  }
  if(!month || !Number(month)) {
    month = new Date().getMonth() + 1;
  }

  let result = new Date(`${year}-${month}-01`);
  return result;
}

module.exports = {
  convert,
  setDate
}