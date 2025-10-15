class leaderboard {

    calcScoreAward(id) {
        if (SatAwards[id].score) {
            return SatAwards[id].score
        } else {
            return SatTypes[SatAwards[id].type]
        }
    }

    update() {
        const tbody = document.getElementById('leadertablebody');
        tbody.innerHTML = '';

        // Convert users object to array and calculate scores
        const usersArray = Object.entries(SatUsers).map(([key, user]) => {
            let score = 0;
            // Calculate score based on awards
            user.awards.forEach(award => {
                const awardInfo = SatAwards[award];
                if (awardInfo && SatTypes[awardInfo.type]) {
                    score += window.leaderboard.calcScoreAward(award);
                }
            });
            return { ...user, score };
        });

        // Sort users by score (highest first)
        //usersArray.sort((a, b) => b.score - a.score);
        // Sort users by ratio (highest first)
        usersArray.sort((a, b) => {
            const ratioA = a.events.length > 0 ? a.score / a.events.length : 0;
            const ratioB = b.events.length > 0 ? b.score / b.events.length : 0;
            return ratioB - ratioA; // от большего к меньшему
        });

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
            
            // Ratio column
            const tdRatio = document.createElement('td');
            tdRatio.textContent = (user.score / user.events.length).toFixed(2);
            tr.appendChild(tdRatio);

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

            // сортируем награды: от большего веса к меньшему
            const sortedAwards = [...user.awards].sort((a, b) => {
                const scoreA = window.leaderboard.calcScoreAward(a);
                const scoreB = window.leaderboard.calcScoreAward(b);
                return scoreB - scoreA; // от большего к меньшему
            });

            sortedAwards.forEach(awardKey => {
                const award = SatAwards[awardKey];
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
            tdEvents.textContent = user.events.length;
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
                <b data-translate="nameDT">${window.langMgr.trs('nameDT')}</b><p>${SatAwards[id].name}</p>
            </div>
            <div class="stroke">
                <b data-translate="eventDT">${window.langMgr.trs('eventDT')}</b><p>${SatAwards[id].event}</p>
            </div>
            <div class="stroke">
                <b data-translate="typeDT">${window.langMgr.trs('typeDT')}</b><p data-translate="${SatAwards[id].type}">${window.langMgr.trs(SatAwards[id].type)}</p>
            </div>
            <div class="stroke">
                <b data-translate="scoreDT">${window.langMgr.trs('scoreDT')}</b><p>${window.leaderboard.calcScoreAward(id)}</p>
            </div>
            <div class="stroke">
                <b data-translate="dateDT">${window.langMgr.trs('dateDT')}</b><p>${SatEvents[SatAwards[id].event].date}</p>
            </div>
            <div class="imageDiv"><img src="img/award/${SatAwards[id].img}"></div>
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
