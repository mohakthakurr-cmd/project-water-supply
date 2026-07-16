const wards = [
  {
    number: "1",
    area: "Sanjauli",
    zone: "North",
    days: "Monday and Thursday",
    time: "6:00 AM - 8:00 AM"
  },
  {
    number: "2",
    area: "Mall Road",
    zone: "Central",
    days: "Tuesday and Friday",
    time: "7:00 AM - 9:00 AM"
  },
  {
    number: "3",
    area: "Summer Hill",
    zone: "South",
    days: "Wednesday and Saturday",
    time: "6:30 AM - 8:30 AM"
  }
];

const themeToggle = document.getElementById("themeToggle");
const pageLoader = document.getElementById("pageLoader");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const result = document.getElementById("result");
const feedbackForm = document.getElementById("feedbackForm");
const feedbackButton = document.getElementById("feedbackButton");
const feedbackMessage = document.getElementById("feedbackMessage");
const lastUpdated = document.getElementById("lastUpdated");


function setTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light");
  localStorage.setItem("waterPortalTheme", theme);

  const themeLabel = document.querySelector(".theme-label");
  const themeIcon = document.querySelector(".theme-icon");

  if (theme === "light") {
    themeLabel.textContent = "Light";
    themeIcon.textContent = "☀";
  } else {
    themeLabel.textContent = "Dark";
    themeIcon.textContent = "◐";
  }
}


function setLastUpdatedText() {
  const today = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date());

  lastUpdated.textContent = `Updated ${today}`;
}


function findSchedule() {
  const input = searchInput.value.toLowerCase().trim();

  if (input === "") {
    result.innerHTML = `
      <div class="result-card">
        <h3>Search required</h3>
        <p>Please enter a ward number or an area name.</p>
      </div>
    `;
    return;
  }

  searchButton.classList.add("loading");
  searchButton.disabled = true;

  setTimeout(function () {
    const ward = wards.find(function (item) {
      return (
        item.number === input ||
        item.area.toLowerCase().includes(input)
      );
    });

    if (ward) {
      result.innerHTML = `
        <article class="result-card">
          <p class="eyebrow">SCHEDULE FOUND</p>
          <h3>Ward ${ward.number} — ${ward.area}</h3>
          <p><b>Service zone:</b> ${ward.zone}</p>
          <p><b>Supply days:</b> ${ward.days}</p>
          <p><b>Supply time:</b> ${ward.time}</p>
        </article>
      `;
    } else {
      result.innerHTML = `
        <div class="result-card">
          <p class="eyebrow">NO MATCH FOUND</p>
          <h3>Ward not found</h3>
          <p>Try Sanjauli, Mall Road, Summer Hill, or ward number 1, 2, or 3.</p>
        </div>
      `;
    }

    searchButton.classList.remove("loading");
    searchButton.disabled = false;
  }, 500);
}


async function submitFeedback(event) {
  event.preventDefault();

  feedbackButton.classList.add("loading");
  feedbackButton.disabled = true;
  feedbackMessage.textContent = "";

  const formData = new FormData(feedbackForm);

  try {
    const response = await fetch("/submit-feedback", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Feedback could not be submitted.");
    }

    feedbackMessage.textContent =
      data.message || "Thank you. Your feedback has been submitted.";

    feedbackForm.reset();
  } catch (error) {
    feedbackMessage.textContent =
      "Could not submit feedback right now. Please try again.";
  } finally {
    feedbackButton.classList.remove("loading");
    feedbackButton.disabled = false;
  }
}


themeToggle.addEventListener("click", function () {
  const currentTheme = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  setTheme(newTheme);
});


searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    findSchedule();
  }
});


feedbackForm.addEventListener("submit", submitFeedback);


window.addEventListener("load", function () {
  const savedTheme = localStorage.getItem("waterPortalTheme") || "dark";

  setTheme(savedTheme);
  setLastUpdatedText();

  setTimeout(function () {
    if (pageLoader) {
  pageLoader.classList.add("hidden");
}
  }, 550);
});