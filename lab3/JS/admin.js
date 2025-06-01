document.addEventListener("DOMContentLoaded", () => {
  // // Перевірка статусу адміністратора
  // const isAdmin = JSON.parse(localStorage.getItem("currentUser"))?.isAdmin;
  // if (!isAdmin) {
  //   window.location.href = "logging.html";
  //   return;
  // }

  const form = document.getElementById("add-dish-form");
  const messageContainer = document.querySelector(".message-container");

  // Поля форми
  const dishName = document.getElementById("dish-name");
  const calories100g = document.getElementById("calories-100g");
  const protein100g = document.getElementById("protein-100g");
  const fat100g = document.getElementById("fat-100g");
  const carbs100g = document.getElementById("carbs-100g");
  const portionWeight = document.getElementById("portion-weight");
  const caloriesPortion = document.getElementById("calories-portion");
  const proteinPortion = document.getElementById("protein-portion");
  const fatPortion = document.getElementById("fat-portion");
  const carbsPortion = document.getElementById("carbs-portion");

  // Завантаження страв із localStorage
  let dishes = JSON.parse(localStorage.getItem("dishes")) || [];

  // Оновлення КБЖВ для порції
  function updatePortionValues() {
    const weight = parseFloat(portionWeight.value) || 0;
    const calPer100g = parseFloat(calories100g.value) || 0;
    const protPer100g = parseFloat(protein100g.value) || 0;
    const fatPer100g = parseFloat(fat100g.value) || 0;
    const carbsPer100g = parseFloat(carbs100g.value) || 0;

    const factor = weight / 100;
    caloriesPortion.value = (calPer100g * factor).toFixed(1);
    proteinPortion.value = (protPer100g * factor).toFixed(1);
    fatPortion.value = (fatPer100g * factor).toFixed(1);
    carbsPortion.value = (carbsPer100g * factor).toFixed(1);
  }

  // Подія при зміні ваги порції
  portionWeight.addEventListener("input", updatePortionValues);

  // Подія при зміні значень на 100 г
  [calories100g, protein100g, fat100g, carbs100g].forEach(input => {
    input.addEventListener("input", updatePortionValues);
  });

  // Обробка додавання страви
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = dishName.value.trim();
    if (dishes.some(dish => dish.name === name)) {
      messageContainer.innerHTML = "";
      const message = document.createElement("p");
      message.className = "message";
      message.style.color = "#dc3545";
      message.textContent = "Ця страва вже існує!";
      messageContainer.appendChild(message);
      return;
    }

    const dish = {
      name,
      calories100g: parseFloat(calories100g.value),
      protein100g: parseFloat(protein100g.value),
      fat100g: parseFloat(fat100g.value),
      carbs100g: parseFloat(carbs100g.value),
      portionWeight: parseFloat(portionWeight.value),
      caloriesPortion: parseFloat(caloriesPortion.value),
      proteinPortion: parseFloat(proteinPortion.value),
      fatPortion: parseFloat(fatPortion.value),
      carbsPortion: parseFloat(carbsPortion.value)
    };

    dishes.push(dish);
    localStorage.setItem("dishes", JSON.stringify(dishes));

    messageContainer.innerHTML = "";
    const message = document.createElement("p");
    message.className = "message";
    message.style.color = "#28a745";
    message.textContent = "Страву додано успішно!";
    messageContainer.appendChild(message);

    form.reset();
    updatePortionValues();
  });
});