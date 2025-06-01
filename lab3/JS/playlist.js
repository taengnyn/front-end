document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("video-url");
  const addVideoBtn = document.getElementById("add-video-btn");
  const videoList = document.getElementById("video-list");

  // Завантажуємо відео з localStorage
  let videos = JSON.parse(localStorage.getItem("videos")) || [];

  // Функція для оновлення списку відео
  function updateVideoList() {
    videoList.innerHTML = "";
    videos.forEach((video, index) => {
      const videoItem = document.createElement("div");
      videoItem.className = "video-item";
      videoItem.innerHTML = `
        <p>${video.title}</p>
        <button class="remove-video-btn" data-index="${index}">×</button>
      `;
      videoList.appendChild(videoItem);
    });
    localStorage.setItem("videos", JSON.stringify(videos));
  }

  // Функція для отримання ID відео з URL
  function getVideoId(url) {
    // Підтримуємо різні формати URL: watch?v= і youtu.be/
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Додавання відео
  addVideoBtn.addEventListener("click", () => {
    const url = videoUrlInput.value.trim();
    const videoId = getVideoId(url);

    if (videoId) {
      videos.push({
        id: videoId,
        title: `Відео ${videos.length + 1}`, 
      });
      videoUrlInput.value = "";
      updateVideoList();
    } else {
      alert("Будь ласка, введіть коректний URL відео з YouTube! Наприклад: https://www.youtube.com/watch?v=VIDEO_ID або https://youtu.be/VIDEO_ID");
    }
  });
  
  videoList.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-video-btn")) {
      const index = e.target.getAttribute("data-index");
      videos.splice(index, 1);
      updateVideoList();
    }
  });

  updateVideoList();
});