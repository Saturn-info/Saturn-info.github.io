class leaderboardSat {
    init() {
        this.fromWhereUsers = 'all';
    }

    calcScoreAwardSat(id) {
        if (!SatAwards[id]) {
            console.warn(`Award not found: ${id}`);
            return 0;
        }
        if (SatAwards[id].score) {
            return SatAwards[id].score * 1.5;
        } else if (SatAwards[id].type && SatTypes[SatAwards[id].type]) {
            return SatTypes[SatAwards[id].type] * 1.5;
        }
        console.warn(`Award score/type not found for: ${id}`);
        return 0;
    }

    // Вспомогательный метод для определения типа награды
    getAwardType(awardKey) {
        if (SatAwards?.[awardKey] !== undefined) {
            return 'sat';
        }
        // Проверяем формат NWF награды (например: "eventname_type")
        if (typeof awardKey === 'string' && awardKey.includes('_')) {
            const parts = awardKey.split('_');
            if (parts.length >= 2 && NwfTypes?.[parts[1]]) {
                return 'nwf';
            }
        }
        return 'unknown';
    }

    update() {
        const tbody = document.getElementById('leadertablebody');
        if (!tbody) return;
        tbody.innerHTML = '';

        // === 1. Создаём карту пользователей для объединения по user.id ===
        const allUsersMap = new Map();

        // === 2. Добавляем/обрабатываем пользователей из SAT ===
        if (this.fromWhereUsers != 'nwf') {
        Object.entries(SatUsers || {}).forEach(([key, user]) => {
            let satScore = 0;
            (user.awards || []).forEach(award => {
                if (this.getAwardType(award) === 'sat') {
                    const awardInfo = SatAwards[award];
                    if (awardInfo && SatTypes?.[awardInfo.type]) {
                        satScore += this.calcScoreAwardSat(award);
                    }
                }
            });

            allUsersMap.set(user.id, {
                ...user,
                satScore,
                nwfScore: 0,
                satAwards: (user.awards || []).filter(aw => this.getAwardType(aw) === 'sat'),
                nwfAwards: (user.awards || []).filter(aw => this.getAwardType(aw) === 'nwf'),
                satEvents: [...(user.events || [])],
                nwfEvents: [],
                source: ['sat']
            });
        });
        };

        // === 3. Добавляем/объединяем пользователей из NWF ===
        if (window.leaderboardNwf && typeof NwfUsers !== 'undefined' && NwfUsers && this.fromWhereUsers != 'saturn') {
            Object.entries(NwfUsers).forEach(([key, user]) => {
                let nwfScore = 0;
                (user.awards || []).forEach(awardKey => {
                    if (this.getAwardType(awardKey) === 'nwf') {
                        nwfScore += window.leaderboardNwf.calcScoreAward(awardKey);
                    }
                });

                if (allUsersMap.has(user.id)) {
                    // Объединяем с существующим пользователем
                    const existing = allUsersMap.get(user.id);
                    existing.nwfScore = nwfScore;
                    existing.nwfAwards = (user.awards || []).filter(aw => this.getAwardType(aw) === 'nwf');
                    existing.nwfEvents = [...(user.events || [])];
                    if (!existing.source.includes('nwf')) {
                        existing.source.push('nwf');
                    }
                } else {
                    // Новый пользователь только из NWF
                    allUsersMap.set(user.id, {
                        ...user,
                        satScore: 0,
                        nwfScore,
                        satAwards: [],
                        nwfAwards: (user.awards || []).filter(aw => this.getAwardType(aw) === 'nwf'),
                        satEvents: [],
                        nwfEvents: [...(user.events || [])],
                        source: ['nwf']
                    });
                }
            });
        }

        // === 4. Преобразуем в массив и вычисляем итоговые значения ===
        const usersArray = Array.from(allUsersMap.values()).map(user => ({
            ...user,
            score: user.satScore + user.nwfScore,
            awards: [...user.satAwards, ...user.nwfAwards],
            events: [...user.satEvents, ...user.nwfEvents]
        }));

        // === 5. Сортировка по рейтингу ===
        const calculateRatio = (user) => {
            // Для пользователей с данными NWF применяем логику NWF
            const hasNwfData = user.source.includes('nwf') && window.leaderboardNwf;
            
            if (hasNwfData) {
                const eventCount = user.events?.length || 0;
                const awardCount = user.awards?.length || 1;
                const divisor = (eventCount > 0 && eventCount >= awardCount) ? eventCount : awardCount;
                return user.score / divisor;
            }
            
            // Для чистых SAT-пользователей - оригинальная логика
            return (user.events?.length > 0) ? user.score / user.events.length : 0;
        };

        usersArray.sort((a, b) => calculateRatio(b) - calculateRatio(a));

        // === 6. Отрисовка строк таблицы ===
        usersArray.forEach(user => {
            const tr = document.createElement('tr');
            if (user.id === localStorage.getItem('account')) {
                tr.classList.add('userThisIs');
            }

            // Ratio column
            const tdRatio = document.createElement('td');
            tdRatio.textContent = calculateRatio(user).toFixed(2);
            tr.appendChild(tdRatio);

            // Discord name column
            const tdDiscord = document.createElement('td');
            if (user.discordid) {
                const discordLink = document.createElement('a');
                discordLink.href = `https://discord.com/users/${user.discordid.trim()}`;
                discordLink.textContent = user.discord || 'Unknown';
                discordLink.target = '_blank';
                discordLink.rel = 'noopener noreferrer';
                tdDiscord.appendChild(discordLink);
            } else {
                tdDiscord.textContent = user.discord || 'Unknown';
            }
            tr.appendChild(tdDiscord);

            // Awards column
            const tdAwards = document.createElement('td');
            tdAwards.classList.add('awardslist');

            // Сортируем все награды пользователя: сначала по источнику, потом по ценности
            const sortedAwards = [...user.awards].sort((a, b) => {
                const typeA = this.getAwardType(a);
                const typeB = this.getAwardType(b);
                
                // SAT награды идут первыми
                if (typeA === 'sat' && typeB !== 'sat') return -1;
                if (typeA !== 'sat' && typeB === 'sat') return 1;
                
                // Внутри одного источника - сортируем по ценности
                if (typeA === 'sat' && typeB === 'sat') {
                    return this.calcScoreAwardSat(b) - this.calcScoreAwardSat(a);
                } else if (typeA === 'nwf' && typeB === 'nwf' && window.leaderboardNwf) {
                    return window.leaderboardNwf.calcScoreAward(b) - window.leaderboardNwf.calcScoreAward(a);
                }
                return 0;
            });

            sortedAwards.forEach(awardKey => {
                const awardType = this.getAwardType(awardKey);
                
                // SAT награда
                if (awardType === 'sat') {
                    const award = SatAwards[awardKey];
                    const div = document.createElement('div');
                    div.classList.add('squareMedal');
                    
                    if (award.imgType === 'metro' || award.imgType === 'special') {
                        div.classList.add('none');
                    } else if (award.type === 'winSide' && !award.imgType) {
                        div.classList.add('winSide');
                    } else if (award.type) {
                        div.classList.add(award.type);
                    }
                    
                    const img = document.createElement('img');
                    img.src = SatTypesImg?.includes(award.imgType) 
                        ? `img/award/${award.img}` 
                        : 'img/award/blank.png';
                    img.title = `${award.event} ${award.name}`;
                    img.alt = award.name;
                    img.onclick = (e) => {
                        e.stopPropagation();
                        this.showAward(awardKey);
                    };
                    div.appendChild(img);
                    tdAwards.appendChild(div);
                } 
                // NWF награда
                else if (awardType === 'nwf' && window.leaderboardNwf) {
                    const award = window.leaderboardNwf.awards(awardKey);
                    if (award && NwfTypes?.[award.type]) {
                        const img = document.createElement('img');
                        img.src = `img/award/${award.type}.png`;
                        img.title = `${NwfTypes[award.type].name} ${NwfEvents?.[award.event]?.name || ''}`;
                        img.alt = award.type;
                        img.className = 'smallAwardIcon';
                        img.onclick = (e) => {
                            e.stopPropagation();
                            window.leaderboardNwf.showAward(awardKey);
                        };
                        tdAwards.appendChild(img);
                    }
                }
            });

            tr.appendChild(tdAwards);

            // Events column
            const tdEvents = document.createElement('td');
            const eventCount = user.events?.length || 0;
            const awardCount = user.awards?.length || 0;
            
            // Применяем логику NWF если есть данные NWF
            if (user.source.includes('nwf') && window.leaderboardNwf) {
                tdEvents.textContent = (eventCount > 0 && eventCount >= awardCount) ? eventCount : awardCount;
            } else {
                tdEvents.textContent = eventCount;
            }
            tr.appendChild(tdEvents);

            tbody.appendChild(tr);
        });
    }

    showAward(id) {
        const modalElement = document.getElementById('modal');
        if (!modalElement || !SatAwards[id]) return;
        
        modalElement.classList.add('active');
        modalElement.innerHTML = `
        <div class="modalcontent">
            <button onclick="document.getElementById('modal').classList.remove('active')" class="modalClose">×</button>
            <div class="stroke">
                <b data-translate="nameDT">${window.langMgr?.trs('nameDT') || 'Name'}</b>
                <p>${SatAwards[id].name}</p>
            </div>
            <div class="stroke">
                <b data-translate="eventDT">${window.langMgr?.trs('eventDT') || 'Event'}</b>
                <p>${SatAwards[id].event}</p>
            </div>
            <div class="stroke">
                <b data-translate="typeDT">${window.langMgr?.trs('typeDT') || 'Type'}</b>
                <p data-translate="${SatAwards[id].type}">${window.langMgr?.trs(SatAwards[id].type) || SatAwards[id].type}</p>
            </div>
            <div class="stroke">
                <b data-translate="scoreDT">${window.langMgr?.trs('scoreDT') || 'Score'}</b>
                <p>${this.calcScoreAwardSat(id)}</p>
            </div>
            <div class="stroke">
                <b data-translate="dateDT">${window.langMgr?.trs('dateDT') || 'Date'}</b>
                <p>${SatEvents?.[SatAwards[id].event]?.date || 'N/A'}</p>
            </div>
            <div class="imageDiv">
                <img src="img/award/${SatAwards[id].img}" alt="${SatAwards[id].name}">
            </div>
        </div>`;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация leaderboardSat...');
    window.leaderboardSat = new leaderboardSat();
    console.log('leaderboardSat инициализирован:', window.leaderboardSat);

    if (document.baseURI.includes('sat')) {
        window.leaderboardSat.update();

        const fromWhereBtns = document.querySelectorAll('#fromWhereInfo button');
        fromWhereBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                fromWhereBtns.forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                window.leaderboardSat.fromWhereUsers = btn.getAttribute('data-where');
                window.leaderboardSat.update();
            });
        });
    }
});