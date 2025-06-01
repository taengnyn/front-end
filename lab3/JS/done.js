document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.querySelector(".save-btn");
  const successAnimation = document.getElementById("successAnimation");

  saveBtn.addEventListener("click", () => {
    successAnimation.classList.add("active");

    setTimeout(() => {
      window.location.href = "main.html"; 
    }, 2000);
  });
});