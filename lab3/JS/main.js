document.addEventListener("DOMContentLoaded", () => {
  const addBtns = document.querySelectorAll(".add-btn");
  const consumedCalories = document.getElementById("consumed-calories");
  const remainingCalories = document.getElementById("remaining-calories");
  const dailyGoal = document.getElementById("daily-goal");
  const progressCircle = document.querySelector(".progress-ring__circle");
  const waterTotal = document.getElementById("water-total");
  const waterContainer = document.getElementById("water-container");
  const glassesContainer = document.getElementById("glasses-container");
  const breakfastCalories = document.getElementById("breakfast-calories");
  const lunchProducts = document.getElementById("lunch-products");
  const dinnerCalories = document.getElementById("dinner-calories");
  const snackCalories = document.getElementById("snack-calories");
  const breakfastProducts = document.getElementById("breakfast-products");
  const dinnerProducts = document.getElementById("dinner-products");
  const snackProducts = document.getElementById("snack-products");
  const recommendationsBtn = document.getElementById("recommendations-btn");
  const videoBlock = document.getElementById("video-block");
  const playlistCount = document.getElementById("playlist-count");
  const logoutBtn = document.getElementById("logout-btn"); // Додано для кнопки виходу

  // Завантаження даних користувача
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let consumedMeals = JSON.parse(localStorage.getItem("consumedMeals")) || {};
  let videos = JSON.parse(localStorage.getItem("videos")) || [];

  // Розрахунок денної норми калорій
  function calculateDailyGoal() {
    if (!currentUser) return 1500;

    const { age, height, weight, activityLevel, goal, gender } = currentUser;
    let bmr;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    const activityFactors = {
      low: 1.2,
      moderate: 1.375,
      high: 1.55,
      "very-high": 1.725
    };
    const activityFactor = activityFactors[activityLevel] || 1.2;

    const goalAdjustments = {
      "lose-weight": -500,
      "healthy-lifestyle": 0,
      "maintain-weight": 0,
      "gain-weight": +500
    };
    const goalAdjustment = goalAdjustments[goal] || 0;

    const dailyGoalCalories = Math.round(bmr * activityFactor + goalAdjustment);
    return Math.max(1200, dailyGoalCalories);
  }

  const calculatedGoal = calculateDailyGoal();
  dailyGoal.textContent = calculatedGoal;

  // Оновлення калорій та продуктів
  function updateCalorieCounter() {
    let totalConsumed = 0;
    const meals = {
      "Сніданок": breakfastCalories,
      "Обід": document.getElementById("calories-total"),
      "Вечеря": dinnerCalories,
      "Перекус": snackCalories
    };
    const productDivs = {
      "Сніданок": breakfastProducts,
      "Обід": lunchProducts,
      "Вечеря": dinnerProducts,
      "Перекус": snackProducts
    };

    for (let meal in consumedMeals) {
      let mealCalories = 0;
      productDivs[meal].innerHTML = "";
      consumedMeals[meal].forEach(product => {
        mealCalories += product.calories || 0;
        const productItem = document.createElement("div");
        productItem.className = "product-item";
        productItem.innerHTML = `
          ${product.name} (${product.weight} г) - ${product.calories} ккал
          <button class="remove-btn" data-meal="${meal}" data-name="${product.name}" data-weight="${product.weight}">×</button>
        `;
        productDivs[meal].appendChild(productItem);
      });
      totalConsumed += mealCalories;
      meals[meal].textContent = `Калорії: ${mealCalories} ккал`;
    }

    const remaining = Math.max(0, calculatedGoal - totalConsumed);
    consumedCalories.textContent = totalConsumed;
    remainingCalories.textContent = remaining;

    const percentage = Math.min(100, (totalConsumed / calculatedGoal) * 100);
    const circumference = 440;
    const offset = circumference - (percentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  // Функція для оновлення відображення відео
  function updateVideoBlock() {
    if (!videoBlock) return;
    videoBlock.innerHTML = "";
    videos.forEach((video, index) => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${video.id}`;
      iframe.frameborder = "0";
      iframe.allowFullscreen = true;
      iframe.title = `Відео ${index + 1}`;
      const p = document.createElement("p");
      p.textContent = video.title;
      videoBlock.appendChild(iframe);
      videoBlock.appendChild(p);
    });
    if (playlistCount) playlistCount.textContent = videos.length;
  }

  // Обробка додавання страв
  addBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const meal = btn.closest(".meal").querySelector("h3").textContent;
      window.location.href = `search.html?meal=${encodeURIComponent(meal)}`;
    });
  });

  // Обробка води
  let glassCount = parseInt(localStorage.getItem("glassCount")) || 0;
  const waterPerGlass = 0.25;

  // Функція для оновлення відображення склянок
  function updateGlasses() {
    glassesContainer.innerHTML = "";
    for (let i = 0; i < glassCount; i++) {
      const glassImg = document.createElement("img");
      glassImg.src = "images/water.webp";
      glassImg.alt = "Склянка води";
      glassImg.className = "glass-img";
      glassesContainer.appendChild(glassImg);
    }
    const totalWater = glassCount * waterPerGlass;
    waterTotal.textContent = `${totalWater.toFixed(1)} л`;
    localStorage.setItem("glassCount", glassCount);
  }

  // Початкове відображення склянок
  updateGlasses();

  waterContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("minus-icon")) {
      if (glassCount > 0) {
        glassCount--;
        updateGlasses();
      }
    } else if (e.target.classList.contains("plus-icon")) {
      glassCount++;
      updateGlasses();
    }
  });

  // Обробка видалення продуктів
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const meal = e.target.getAttribute("data-meal");
      const name = e.target.getAttribute("data-name");
      const weight = e.target.getAttribute("data-weight");

      consumedMeals[meal] = consumedMeals[meal].filter(
        item => !(item.name === name && item.weight === parseFloat(weight))
      );
      localStorage.setItem("consumedMeals", JSON.stringify(consumedMeals));
      updateCalorieCounter();
    }
  });

  // Обробка рекомендацій
  recommendationsBtn.addEventListener("click", () => {
    const dailyCalories = calculatedGoal;
    const proteinGrams = Math.round((dailyCalories * 0.30) / 4);
    const fatGrams = Math.round((dailyCalories * 0.30) / 9);
    const carbGrams = Math.round((dailyCalories * 0.40) / 4);
    const stepsPerDay = 10000;

    const recommendations = `
Рекомендації:
- Кількість калорій на день: ${dailyCalories} ккал
- Білки: ${proteinGrams} г
- Жири: ${fatGrams} г
- Вуглеводи: ${carbGrams} г
- Кроки на день: ${stepsPerDay} кроків
`;

    const blob = new Blob([recommendations], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recommendations.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  });

  // Обробка виходу
  logoutBtn.addEventListener("click", () => {
  
    localStorage.removeItem("currentUser");
 
    window.location.href = "logging.html";
  });

  updateCalorieCounter();
  updateVideoBlock();
});