const emissionFactors = {
  flight: 0.20,
  bus: 0.06,
  plant: 0.25,
  electricity: 0.80,
  vegMeal: 0.50,
  nonVegMeal: 2.00
};

const activityNames = {
  flight: "✈️ Flight",
  bus: "🚌 Bus",
  plant: "🌱 Plant",
  electricity: "⚡ Electricity",
  vegMeal: "🥗 Veg Meal",
  nonVegMeal: "🍗 Non-Veg Meal"
};

let activities = JSON.parse(localStorage.getItem("planetPulseActivities")) || [];
let weeklyTarget = Number(localStorage.getItem("planetPulseTarget")) || 0;

const activityForm = document.getElementById("activityForm");
const activityType = document.getElementById("activityType");
const quantity = document.getElementById("quantity");
const historyList = document.getElementById("historyList");
const totalFootprint = document.getElementById("totalFootprint");

const travelTotal = document.getElementById("travelTotal");
const foodTotal = document.getElementById("foodTotal");
const electricityTotal = document.getElementById("electricityTotal");
const plantTotal = document.getElementById("plantTotal");

const weeklyTargetInput = document.getElementById("weeklyTarget");
const setTargetBtn = document.getElementById("setTargetBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const filterType = document.getElementById("filterType");
const filterDate = document.getElementById("filterDate");

const nudge = document.getElementById("nudge");
const nudgeMessage = document.getElementById("nudgeMessage");
const inputMessage = document.getElementById("inputMessage");


function saveData() {
  localStorage.setItem(
    "planetPulseActivities",
    JSON.stringify(activities)
  );

  localStorage.setItem(
    "planetPulseTarget",
    weeklyTarget
  );
}


function getEmission(type, amount) {
  return emissionFactors[type] * amount;
}


function getTotal() {
  return activities.reduce((sum, activity) => {
    return sum + activity.emission;
  }, 0);
}


function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();

  const difference = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + difference);
  d.setHours(0, 0, 0, 0);

  return d;
}


function getThisWeekActivities() {
  const today = new Date();
  const weekStart = getWeekStart(today);

  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= weekStart;
  });
}


function updateDashboard() {
  const total = getTotal();

  totalFootprint.textContent = total.toFixed(2);

  let travel = 0;
  let food = 0;
  let electricity = 0;
  let plants = 0;

  activities.forEach(activity => {
    if (activity.type === "flight" || activity.type === "bus") {
      travel += activity.emission;
    }

    if (activity.type === "vegMeal" || activity.type === "nonVegMeal") {
      food += activity.emission;
    }

    if (activity.type === "electricity") {
      electricity += activity.emission;
    }

    if (activity.type === "plant") {
      plants += activity.emission;
    }
  });

  travelTotal.textContent = `${travel.toFixed(2)} kg`;
  foodTotal.textContent = `${food.toFixed(2)} kg`;
  electricityTotal.textContent = `${electricity.toFixed(2)} kg`;
  plantTotal.textContent = `${plants.toFixed(2)} kg`;

  updateWeeklyProgress();
}


function updateWeeklyProgress() {
  if (!weeklyTarget || weeklyTarget <= 0) {
    progressBar.style.width = "0%";
    progressText.textContent =
      "Set a weekly target to track your progress.";
    nudge.classList.add("hidden");
    return;
  }

  const weekActivities = getThisWeekActivities();

  const weeklyTotal = weekActivities.reduce(
    (sum, activity) => sum + activity.emission,
    0
  );

  const percentage = Math.min(
    (weeklyTotal / weeklyTarget) * 100,
    100
  );

  progressBar.style.width = `${percentage}%`;

  progressText.textContent =
    `${weeklyTotal.toFixed(2)} kg of ${weeklyTarget.toFixed(2)} kg used this week (${Math.round(
      (weeklyTotal / weeklyTarget) * 100
    )}%)`;

  if (weeklyTotal > weeklyTarget) {
    nudge.classList.remove("hidden");

    nudgeMessage.textContent =
      `Your weekly footprint is ${weeklyTotal.toFixed(
        2
      )} kg CO₂, which is above your ${weeklyTarget.toFixed(
        2
      )} kg target. Try a lower-carbon option for your next activity.`;
  } else {
    nudge.classList.add("hidden");
  }
}


function renderHistory() {
  const selectedType = filterType.value;
  const selectedDate = filterDate.value;

  let filteredActivities = [...activities];

  if (selectedType !== "all") {
    filteredActivities = filteredActivities.filter(
      activity => activity.type === selectedType
    );
  }

  if (selectedDate) {
  filteredActivities = filteredActivities.filter(activity => {
    const d = new Date(activity.date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const activityDate = `${year}-${month}-${day}`;

    return activityDate === selectedDate;
  });
}

  filteredActivities.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (filteredActivities.length === 0) {
    historyList.innerHTML =
      `<p class="empty-message">No activities found.</p>`;
    return;
  }

  historyList.innerHTML = filteredActivities
    .map(activity => {
      const date = new Date(activity.date);

      return `
        <div class="history-item">
          <div>
            <strong>${activityNames[activity.type]}</strong>
            <div>
              ${activity.quantity} units
            </div>
            <small>
              ${date.toLocaleDateString()}
            </small>
          </div>

          <strong>
            ${activity.emission.toFixed(2)} kg CO₂
          </strong>
          <button onclick="deleteActivity(${activity.id})">
  Delete
</button>
        </div>
      `;
    })
    .join("");
}

function deleteActivity(id) {
  activities = activities.filter(activity => activity.id !== id);

  saveData();
  updateDashboard();
  renderHistory();
}
activityForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const type = activityType.value;
  const amount = Number(quantity.value);

  inputMessage.textContent = "";
  inputMessage.style.color = "";

  if (!type || amount <= 0) {
    inputMessage.textContent =
      "Please enter a valid activity and quantity.";
    return;
  }

  // Decision Point 2: Prevent obviously absurd inputs
  if (amount > 10000) {
    inputMessage.textContent =
      "That quantity seems unusually high. Please enter a realistic value.";
    return;
  }

  const emission = getEmission(type, amount);

  const activity = {
    id: Date.now(),
    type: type,
    quantity: amount,
    emission: emission,
    date: new Date().toISOString()
  };

  activities.push(activity);

  saveData();
  updateDashboard();
  renderHistory();

  inputMessage.textContent =
    `Activity added! Estimated impact: ${emission.toFixed(2)} kg CO₂`;

  inputMessage.style.color = "#287a50";

  activityForm.reset();
});


setTargetBtn.addEventListener("click", function() {
  const target = Number(weeklyTargetInput.value);

  if (target <= 0) {
    progressText.textContent =
      "Please enter a valid weekly target.";
    return;
  }

  weeklyTarget = target;

  saveData();
  updateWeeklyProgress();

  weeklyTargetInput.value = "";
});


filterType.addEventListener("change", renderHistory);
filterDate.addEventListener("change", renderHistory);


updateDashboard();
renderHistory();
