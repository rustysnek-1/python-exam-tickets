const lessonContent = document.querySelector("#lesson-content");

async function loadLessons() {
  const response = await fetch("data.json");
  if (!response.ok) throw new Error("Не удалось загрузить уроки.");
  const lessons = await response.json();

  lessons.forEach((lesson, index) => {
    const number = index + 1;
    const article = document.createElement("article");
    article.className = "lesson";
    article.id = `lesson-${number}`;
    article.innerHTML = `
      <div><h3>${number}. ${lesson.title}</h3>
        <p class="media-title">Видеодемонстрация</p>
        <video controls preload="none" poster="lesson-${number}.jpg">
          <source src="lesson-${number}.mp4" type="video/mp4">
        </video>
        <details><summary>Текст видеодемонстрации</summary>
          ${lesson.frames.map(([title, text]) => `<h4>${title}</h4><pre>${text}</pre>`).join("")}
        </details>
      </div>
      <div class="lab">
        <p class="media-title">Презентация</p>
        <div class="slide" aria-live="polite"></div>
        <div class="controls">
          <button type="button">Назад</button>
          <span class="page"></span>
          <button type="button">Далее</button>
        </div>
        <p><strong>Практика.</strong> ${lesson.task}</p>
      </div>`;
    const slide = article.querySelector(".slide");
    const page = article.querySelector(".page");
    const [previous, next] = article.querySelectorAll("button");
    let current = 0;

    function showSlide() {
      const [heading, content] = lesson.slides[current];
      slide.innerHTML = `<h3>${heading}</h3><p>${content}</p>`;
      page.textContent = `${current + 1} / ${lesson.slides.length}`;
      previous.disabled = current === 0;
      next.disabled = current === lesson.slides.length - 1;
    }

    previous.addEventListener("click", () => { current -= 1; showSlide(); });
    next.addEventListener("click", () => { current += 1; showSlide(); });
    showSlide();
    lessonContent.append(article);
  });

  const anchor = document.getElementById(location.hash.slice(1));
  anchor?.scrollIntoView();
}

loadLessons().catch(error => { lessonContent.textContent = error.message; });
