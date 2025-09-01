class leaderboard {
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
                    score += types[awardInfo.type];
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
            const tdScore = document.createElement('th');
            tdScore.textContent = user.score;
            tr.appendChild(tdScore);

            // Discord name column
            const tdDiscord = document.createElement('th');
            const discordLink = document.createElement('a');
            discordLink.href = `https://discord.com/users/${user.discordid}`;
            discordLink.textContent = user.discord;
            discordLink.target = '_blank'; // Открывать в новой вкладке
            tdDiscord.appendChild(discordLink);
            tr.appendChild(tdDiscord);

            // Game name column
            const tdGame = document.createElement('th');
            tdGame.textContent = user.gamename;
            tr.appendChild(tdGame);

            // Awards column
            const tdAwards = document.createElement('th');
            user.awards.forEach(awardKey => {
                const award = awards[awardKey];
                if (award) {
                    const img = document.createElement('img');
                    img.src = `img/${award.img}`;
                    img.title = award.name;
                    tdAwards.appendChild(img);
                }
            });
            tr.appendChild(tdAwards);

            // Events column (placeholder for now)
            const tdEvents = document.createElement('th');
            tdEvents.textContent = user.events;
            tr.appendChild(tdEvents);

            tbody.appendChild(tr);
        });
    }
}

// Создаем глобальный экземпляр менеджера после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация leaderboard...');
    window.leaderboard = new leaderboard();
    console.log('leaderboard инициализирован:', window.leaderboard);

    window.leaderboard.update();
});
