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

function findSchedule() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  const ward = wards.find(function (item) {
    return item.number === input || item.area.toLowerCase().includes(input);
  });

  if (input === "") {
    result.innerHTML = "<p>Please enter an area name or ward number.</p>";
  } else if (ward) {
    result.innerHTML = `
      <div class="result-card">
        <h3>Ward ${ward.number} — ${ward.area}</h3>
        <p><b>Zone:</b> ${ward.zone}</p>
        <p><b>Supply days:</b> ${ward.days}</p>
        <p><b>Water supply time:</b> ${ward.time}</p>
      </div>
    `;
  } else {
    result.innerHTML = "<p>Ward not found. Try Mall Road, Sanjauli, or ward 2.</p>";
  }
}

async function submitFeedback(event) {
  event.preventDefault();

  const feedbackMessage = document.getElementById("feedbackMessage");
  const formData = new FormData(event.target);

  try {
    const response = await fetch("/submit-feedback", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    feedbackMessage.textContent = data.message;
    event.target.reset();
  } catch (error) {
    feedbackMessage.textContent = "Could not submit feedback. Please try again.";
  }
}