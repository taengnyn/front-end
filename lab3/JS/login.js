document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const signupForm = document.getElementById("signup-form");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Обробка стандартного входу
  if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        console.log("Введені дані:", { username, password });
        console.log("Зареєстровані користувачі:", users);

        const user = users.find(u => u.email === username && u.password === password); // Використовуємо email як логін
        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user));
          window.location.href = "main.html";
        } else {
          alert("Неправильний логін або пароль!");
        }
      });
    }

  // Обробка входу як адміністратор
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => {
      console.log("Натиснуто 'Увійти як адміністратор', перенаправляю на admin.html...");
      localStorage.setItem("currentUser", JSON.stringify({ username: "admin", role: "admin" }));
      window.location.href = "admin.html";
    });
  }

  // Обробка переходу до сторінки реєстрації
  const signupLink = document.querySelector(".register-link a");
  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "signup.html";
    });
  }

  // Обробка реєстрації (signup.html)
  if (signupForm) {
    const step1 = document.getElementById("signup-step-1");
    const step2 = document.getElementById("signup-step-2");
    const nextBtn = document.getElementById("next-btn");

    // Перемикання на другий крок
    nextBtn.addEventListener("click", () => {
      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;
      if (username && password) {
        step1.style.display = "none";
        step2.style.display = "block";
      } else {
        alert("Будь ласка, введіть логін і пароль!");
      }
    });

    // Оновлення значень повзунків у реальному часі
    ["age", "height", "weight"].forEach(id => {
      const input = document.getElementById(id);
      const valueSpan = document.getElementById(`${id}-value`);
      if (input && valueSpan) {
        input.addEventListener("input", () => {
          valueSpan.textContent = input.value;
        });
      }
    });

    // Обробка відправки форми
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("signup-username").value;
      const password = document.getElementById("signup-password").value;
      const age = document.getElementById("age").value;
      const height = document.getElementById("height").value;
      const weight = document.getElementById("weight").value;
      const activityLevel = document.getElementById("activityLevel").value;
      const goal = document.getElementById("goal").value;
      const gender = document.getElementById("gender").value;

      // Перевірка, чи користувач із таким логіном уже існує
      if (users.some(u => u.username === username)) {
        alert("Користувач із таким логіном уже існує!");
        return;
      }

      const newUser = {
        username,
        password,
        age: parseInt(age),
        height: parseInt(height),
        weight: parseInt(weight),
        activityLevel,
        goal,
        gender,
        role: "user"
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      alert("Реєстрація успішна! Ви можете увійти.");
      window.location.href = "logging.html";
    });
  }
});