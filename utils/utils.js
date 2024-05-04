export const calculateCalories = (data) => {
  let calories = 0;
  let fat = 0;
  let protien = 0;
  data.forEach((item) => {
    calories += item.cal;
    fat += item.fat;
    protien += item.protien;
  });
  return {calories, fat, protien};
};

export const filterByPrevdate = (date) => {
  return storedItem.filter(
    (item) => item.timestamp.split("T")[0] === date
  );
};

export const getNextDate = (currentDate) => {
  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() + 1);
  return previousDate.toISOString().split("T")[0];
};

export const getPreviousDate = (currentDate) => {
  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate.toISOString().split("T")[0];
};