document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector("#eventstable tbody");
    if (!table) return;

    // собираем все события из users
    const eventsMap = {};
    for (const userId in users) {
        const user = users[userId];
        user.events.forEach(eventId => {
            if (!eventsMap[eventId]) {
                eventsMap[eventId] = { players: [], awards: [] };
            }
            eventsMap[eventId].players.push(user.gamename || user.id);

            // соберём награды для этого ивента
            user.awards.forEach(awardId => {
                const award = awards[awardId];
                if (award && award.event === eventId) {
                    eventsMap[eventId].awards.push({
                        player: user.gamename || user.id,
                        award: award
                    });
                }
            });
        });
    }

    // наполняем таблицу
    for (const eventId in eventsMap) {
    const row = document.createElement("tr");

    // Event
    const tdEvent = document.createElement("td");
    tdEvent.textContent = eventId;
    row.appendChild(tdEvent);

    // Date
    const tdDate = document.createElement("td");
    tdDate.textContent = events[eventId] ? events[eventId].date : "";
    row.appendChild(tdDate);

    // Medals
    const tdMedals = document.createElement("td");
    for (const awardId in eventsMap[eventId].awards) {
        const obj = eventsMap[eventId].awards[awardId];
        const img = document.createElement("img");

        img.id = awardId; // <-- вот тут ставим именно id награды
        img.src = "img/award/" + obj.award.img;
        img.onclick = () => window.leaderboard.showAward(awardId);
        img.alt = obj.award.name;
        img.title = obj.player + " - " + obj.award.name;
        img.style.width = "24px";
        img.style.height = "24px";
        img.style.marginRight = "4px";

        tdMedals.appendChild(img);
    }
    row.appendChild(tdMedals);

    // Players
    const tdPlayers = document.createElement("td");
    tdPlayers.textContent = eventsMap[eventId].players.join(", ");
    row.appendChild(tdPlayers);

    table.appendChild(row);
}

});