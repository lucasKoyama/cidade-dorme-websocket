const deathsEl = document.getElementById("deaths");
const totalPlayersEl = document.getElementById("total-players");

const playersList = document.querySelector(".players-list");
const createPlayersList = (users) => {
  playersList.innerHTML = '';
  Object.values(users).forEach((user) => {
    const { name, role, alive, icon } = user;

    const playerElement = `
      <div class="player" data-user=${name} data-role=${role} data-alive=${alive}>
        ${ name }
        <i class="fa-solid ${icon}"></i>
      </div>
    `
    
    playersList.innerHTML += playerElement;
  });
};