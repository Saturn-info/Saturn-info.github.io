class leaderboard {

    calcScoreAward(id) {
        if (awards[id].score) {
            return awards[id].score
        } else {
            return types[awards[id].type]
        }
    }

    update() {
        const tbody = document.getElementById('leadertablebody');
        tbody.innerHTML = '';

        // Convert users object to array and calculate scores
        const usersArray = Object.entries(users).map(([key, user]) => {
            let score = 0;
            // Calculate score based on awards
            user.awards.forEach(award => {
                const awardInfo = awards[award];
                if (awardInfo && types[awardInfo.type]) {
                    score += window.leaderboard.calcScoreAward(award);
                }
            });
            return { ...user, score };
        });

        // Sort users by score (highest first)
        usersArray.sort((a, b) => b.score - a.score);

        // Create table rows
        usersArray.forEach(user => {
            const tr = document.createElement('tr');
            if (user.id === localStorage.getItem('account')) {
                tr.classList.add('userThisIs');
            }
            
            // Score column
            const tdScore = document.createElement('td');
            tdScore.textContent = user.score;
            tr.appendChild(tdScore);

            // Discord name column
            const tdDiscord = document.createElement('td');
            const discordLink = document.createElement('a');
            discordLink.href = `https://discord.com/users/${user.discordid}`;
            discordLink.textContent = user.discord;
            discordLink.target = '_blank'; // Открывать в новой вкладке
            tdDiscord.appendChild(discordLink);
            tr.appendChild(tdDiscord);

            // Game name column
            const tdGame = document.createElement('td');
            tdGame.textContent = user.gamename;
            tr.appendChild(tdGame);

        // Awards column
        const tdAwards = document.createElement('td');
        tdAwards.classList.add('awardslist');
        user.awards.forEach(awardKey => {
            const award = awards[awardKey];
            if (award) {
                const img = document.createElement('img');
                img.src = `img/award/${award.img}`;
                img.title = `${award.event} ${award.name}`;
                img.onclick = () => window.leaderboard.showAward(awardKey); // функция, а не строка
                tdAwards.appendChild(img);
            }
        });
        tr.appendChild(tdAwards);

            // Events column (placeholder for now)
            const tdEvents = document.createElement('td');
            tdEvents.textContent = user.events;
            tr.appendChild(tdEvents);

            tbody.appendChild(tr);
        });
    }

    showAward(id) {
        const modalElemetn = document.getElementById('modal');
        modalElemetn.classList.add('active');
        modalElemetn.innerHTML = `
        <div class="modalcontent">
            <div style="justify-self: right;">
                <button onclick="document.getElementById('modal').classList.remove('active')" class="modalClose">×</button>
            </div>
            <div class="stroke">
                <b data-translate="nameDT">${window.langMgr.trs('nameDT')}</b><p>${awards[id].name}</p>
            </div>
            <div class="stroke">
                <b data-translate="eventDT">${window.langMgr.trs('eventDT')}</b><p>${awards[id].event}</p>
            </div>
            <div class="stroke">
                <b data-translate="typeDT">${window.langMgr.trs('typeDT')}</b><p data-translate="${awards[id].type}">${window.langMgr.trs(awards[id].type)}</p>
            </div>
            <div class="stroke">
                <b data-translate="scoreDT">${window.langMgr.trs('scoreDT')}</b><p>${types[awards[id].type]}</p>
            </div>
            <div class="imageDiv"><img src="img/award/${awards[id].img}"></div>
        </div>
        `;

    }
}

// Создаем глобальный экземпляр менеджера после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация leaderboard...');
    window.leaderboard = new leaderboard();
    console.log('leaderboard инициализирован:', window.leaderboard);

    window.leaderboard.update();
});
