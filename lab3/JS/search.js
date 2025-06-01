document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-dish");
  const searchBtn = document.querySelector(".search-btn");
  const resultsDiv = document.getElementById("results");

  // Завантаження страв із localStorage
  let dishes = JSON.parse(localStorage.getItem("dishes")) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const currentMeal = urlParams.get("meal") || "Обід";

  // Обробка пошуку
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsDiv.innerHTML = "";

    if (!query) {
      const message = document.createElement("p");
      message.className = "message";
      message.textContent = "Введіть назву страви для пошуку!";
      resultsDiv.appendChild(message);
      return;
    }

    const foundDishes = dishes
      .filter(dish => dish.name.toLowerCase().includes(query))
      .slice(0, 5);

    if (foundDishes.length === 0) {
      const message = document.createElement("p");
      message.className = "message";
      message.textContent = "Жодної страви не знайдено!";
      resultsDiv.appendChild(message);
    } else {
      foundDishes.forEach(dish => {
        const dishDiv = document.createElement("div");
        dishDiv.className = "result-item";
        dishDiv.innerHTML = `
          <h3>${dish.name}</h3>
          <input type="number" class="weight-input" placeholder="Вага (г)" min="1">
          <button class="add-to-meal-btn" data-name="${dish.name}" data-calories="${dish.calories100g}" data-protein="${dish.protein100g}" data-fat="${dish.fat100g}" data-carbs="${dish.carbs100g}">Додати</button>
        `;
        resultsDiv.appendChild(dishDiv);
      });

      // Обробка додавання страви
      document.querySelectorAll(".add-to-meal-btn").forEach(button => {
        button.addEventListener("click", () => {
          const name = button.getAttribute("data-name");
          const weightInput = button.parentElement.querySelector(".weight-input");
          const weight = parseFloat(weightInput.value) || 0;

          if (weight < 1) {
            alert("Введіть коректну вагу!");
            return;
          }

          const dish = dishes.find(d => d.name === name);
          const factor = weight / 100;
          const calories = dish.calories100g * factor;
          const protein = dish.protein100g * factor;
          const fat = dish.fat100g * factor;
          const carbs = dish.carbs100g * factor;

          let consumedMeals = JSON.parse(localStorage.getItem("consumedMeals")) || {};
          if (!consumedMeals[currentMeal]) consumedMeals[currentMeal] = [];
          consumedMeals[currentMeal].push({ name, weight, calories: Math.round(calories) });
          localStorage.setItem("consumedMeals", JSON.stringify(consumedMeals));

          window.location.href = `main.html`;
        });
      });
    }
  });
});