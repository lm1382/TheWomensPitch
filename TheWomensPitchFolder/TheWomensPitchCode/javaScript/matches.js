const apiUrl = "https://football-api-tf6g.onrender.com/api/fixtures?league=44&season=2023"; //API URL

//declare globally
let fixturesData = []; 
let loadingBarContainer = document.getElementById("loadingContainer");
let loadingBar = document.getElementById("loader");


function showProgressBar() {
  loadingBarContainer.style.display = "block"; //show progress bar
  let progress = 0;
  let interval = setInterval(() => {
    if (progress < 100) {
      progress += 2; //increment progress 
      loadingBar.value = progress;
    }
  }, 800); 

  return interval; 
}

//function to hide progress bar
function hideProgressBar(interval) {
  clearInterval(interval); 
  loadingBarContainer.style.display = "none"; //hide progress bar
}


//function to fetch fixtures data
async function fetchFixtures() {
    let progressInterval = showProgressBar(); //start progress bar
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("API Response:", data); 

    if (data.errors && data.errors.length > 0) {
      console.error("API Error:", data.errors);
      return;
    }

    fixturesData = data.response; 
    populateDropdown(fixturesData); //populate dropdown
    displayFixtures(fixturesData, "all"); //display fixtures with no filter by default
    hideProgressBar(progressInterval);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    hideProgressBar(progressInterval);
  }
}

//function to sort fixtures asc and des
function sortFixtures(fixtures, order) {
  return fixtures.sort((a, b) => {
    const dateA = new Date(a.fixture.date);
    const dateB = new Date(b.fixture.date);
    return order === "asc" ? dateA - dateB : dateB - dateA;
})
}

//function to filter home and away
function filterFixturesByMatchType(fixtures, matchType, selectedTeam) {
  return fixtures.filter(fixture => {
    if (matchType === "home") {
      return selectedTeam === "all" || fixture.teams.home.name === selectedTeam;
    } else if (matchType === "away") {
      return selectedTeam === "all" || fixture.teams.away.name === selectedTeam;
    } else {
      return true;
    }
  });
}

//event listener for home/away 
document.getElementById("sort-homeaway").addEventListener("change", (e) => {
  const matchType = e.target.value;
  const selectedTeam = document.getElementById("team-select").value;
  const filteredFixtures = filterFixturesByMatchType(fixturesData, matchType, selectedTeam);
  displayFixtures(filteredFixtures, selectedTeam);
});


//event listener to sort asc/dec
document.getElementById("sort-date").addEventListener("change", (e) => {
  const sortOrder = e.target.value; 
  
  //sort fixtures based on selected order
  const sortedFixtures = sortFixtures(fixturesData, sortOrder);
  
  displayFixtures(sortedFixtures, document.getElementById("team-select").value);
});

//populate dropdown menu with teams
function populateDropdown(fixtures) {
  const teamSelect = document.getElementById("team-select");
  const teams = new Set(); 

  fixtures.forEach(fixture => {
    teams.add(fixture.teams.home.name);
    teams.add(fixture.teams.away.name);
  });

  //"All Teams" option
  teamSelect.innerHTML = `<option value="all">All Teams</option>`;
  

  //add all teams to dropdown
  teams.forEach(team => {
    const option = document.createElement("option");
    option.value = team;
    option.textContent = team;
    teamSelect.appendChild(option);
  });

  //event listener for dropdown
  teamSelect.addEventListener("change", () => {
    const selectedTeam = teamSelect.value;
    displayFixtures(fixtures, selectedTeam);
  });
}

function displayFixtures(fixtures, selectedTeam) {
  const matchTableBody = document.querySelector("#match-table tbody");
  matchTableBody.innerHTML = ""; // Clear previous rows

  const filteredFixtures = fixtures.filter(fixture => {
    return (
      selectedTeam === "all" ||
      fixture.teams.home.name === selectedTeam ||
      fixture.teams.away.name === selectedTeam
    );
  });


  filteredFixtures.forEach(fixture => {
    const row = document.createElement("tr");
    const matchDate = new Date(fixture.fixture.date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });
    
//final score for both home and away teams 
    const homeScore = fixture.score.fulltime.home ?? "-"; //- if score in null
    const awayScore = fixture.score.fulltime.away ?? "-"; //- would be used if match hasnt been played yet

    row.innerHTML = `
      <td>${matchDate}</td>
      <td>
        <img src="${fixture.teams.home.logo}" alt="${fixture.teams.home.name} Logo" width="20" height="20">
        ${fixture.teams.home.name}
      </td>
      <td>
        <img src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name} Logo" width="20" height="20">
        ${fixture.teams.away.name}
      </td>
      <td>${fixture.fixture.venue.name || "TBD"}</td>
      <td>${homeScore} - ${awayScore}</td> <!-- Final Score Column -->
    `;

    matchTableBody.appendChild(row);
  });
}

//call fetchFixtures when the page loads
fetchFixtures();

