document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector("#eventstable");
    if (!container) return;

    container.innerHTML = ""; // очищаем контейнер

    // -------------------------
    // 1) Собираем данные о событиях из users (если пользователи есть)
    // -------------------------
    const eventsMap = {};
    for (const userId in users) {
        const user = users[userId];
        (user.events || []).forEach(eventId => {
            if (!eventsMap[eventId]) {
                eventsMap[eventId] = { players: [], awards: {} };
            }
            eventsMap[eventId].players.push(user.gamename || user.id);

            (user.awards || []).forEach(awardId => {
                const award = awards && awards[awardId];
                if (award && award.event === eventId) {
                    if (!eventsMap[eventId].awards[awardId]) {
                        eventsMap[eventId].awards[awardId] = { award, players: [] };
                    }
                    eventsMap[eventId].awards[awardId].players.push(user.gamename || user.id);
                }
            });
        });
    }

    // -------------------------
    // 2) Парсер дат -> возвращает Date (без времени) или null
    // Поддерживает: DD.MM.YYYY, DD.MM.YY, YYYY-MM-DD и ISO-подобные строки
    // -------------------------
    function parseDateToDateObject(str) {
        if (!str) return null;
        str = String(str).trim();

        // DD.MM.YYYY или DD.MM.YY
        let m = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
        if (m) {
            let day = parseInt(m[1], 10);
            let month = parseInt(m[2], 10);
            let year = parseInt(m[3], 10);
            if (year < 100) {
                // 2-digit year: 00-69 -> 2000-2069, 70-99 -> 1970-1999
                year += (year >= 70 ? 1900 : 2000);
            }
            const d = new Date(year, month - 1, day);
            if (!isNaN(d)) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return null;
        }

        // YYYY-MM-DD
        m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (m) {
            const year = parseInt(m[1], 10);
            const month = parseInt(m[2], 10);
            const day = parseInt(m[3], 10);
            const d = new Date(year, month - 1, day);
            if (!isNaN(d)) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
            return null;
        }

        // Попытка распарсить стандартными средствами (ISO и т.п.)
        const dt = new Date(str);
        if (!isNaN(dt)) return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());

        return null;
    }

    // форматирование даты для отображения DD.MM.YYYY
    function formatDateDDMMYYYY(dateObj) {
        if (!dateObj) return "";
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const yyyy = String(dateObj.getFullYear());
        return `${dd}.${mm}.${yyyy}`;
    }

    // isPast: true если дата строго меньше сегодняшней (без времени)
    function isPast(dateObj) {
        if (!dateObj) return false;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return dateObj.getTime() < today.getTime();
    }

    // -------------------------
    // 3) Строим eventsArray ПО ВСЕМ событиям (не только тем, где есть игроки)
    // -------------------------
    const eventsArray = Object.keys(events).map(eventId => {
        const info = events[eventId] || {};
        const mapData = eventsMap[eventId] || { players: [], awards: {} };
        const parsedDate = parseDateToDateObject(info.date); // Date или null
        return {
            eventId,
            data: mapData,
            info,
            dateObj: parsedDate
        };
    });

    // Разбиваем на прошедшие / будущие
    const pastEvents = [];
    const futureEvents = [];
    eventsArray.forEach(e => {
        // Если нет даты — можно выбрать показывать в отдельной секции или пропускать.
        // Сейчас: пропускаем события без даты
        if (!e.dateObj) return;
        if (isPast(e.dateObj)) {
            pastEvents.push(e);
        } else {
            futureEvents.push(e);
        }
    });

    // -------------------------
    // 4) Сортировка
    // Требование: будущие над прошедшими, и внутри каждой секции более поздние события выше.
    // Значит: сортируем по убыванию даты (b - a)
    // -------------------------
    pastEvents.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    futureEvents.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

    // -------------------------
    // 5) Создание карточки события
    // -------------------------
    function createCard({ eventId, data, info, dateObj }, time) {
        const card = document.createElement("div");
        card.className = "event-card";
        if (info.map) {
            let mapId = info.map.replace(/^([^_]*_[^_]*)_.*$/, '$1');
            mapId = mapId.replace(/_/g, '/');
            if (window.location.href.includes('file:///')) {
            card.style.backgroundImage = `url("http://192.168.100.18:8081/lib/${mapId}/${info.map}.png")`;
            } else {
            card.style.backgroundImage = `url("http://raw.githubusercontent.com/EEditor-WS/eeditor-ws-data/refs/heads/main/lib/${mapId}/${info.map}.png")`;
            }
        } else if (info.img) card.style.backgroundImage = `url("img/events/${info.img}")`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.borderRadius = "0.4rem";
        card.style.padding = "1rem";
        card.style.marginBottom = "1rem";
        card.style.color = "#fff";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
        if (time === 'future') card.style.border = "5px solid #939347"; // желтая рамка для будущих событий
        if (info.canceled) card.style.border = "5px solid #934747ff"; // желтая рамка для проваленных событий

        const extrabtnsdiv = document.createElement("div");
        extrabtnsdiv.className = 'extrabtnsdiv';
        if (info.discord) extrabtnsdiv.innerHTML = `<button class="extrabtn discord" onclick="window.open('https://discord.com/channels/1194999547571744888/${info.discord}')"><img src="img/icons/discord-white.svg"></button>`;
        // extrabtnsdiv.innerHTML = extrabtnsdiv.innerHTML + `<button class="extrabtn" onclick="downloadScenario('${info.map}')"><img src="img/icons/download.svg"></button>`
        extrabtnsdiv.innerHTML = extrabtnsdiv.innerHTML + `<button class="extrabtn" onclick="window.open('https://eeditor-ws.github.io/page/library/download?fullid=${info.map}')"><img src="img/icons/download.svg"></button>`
        card.appendChild(extrabtnsdiv);

        const overlay = document.createElement("div");
        // затемняющий фон, чтобы текст читался на ярком фоне
        // overlay.style.background = "rgba(0,0,0,0.45)";
        overlay.style.padding = "0.5rem";
        overlay.style.borderRadius = "0.6rem";

        const title = document.createElement("h2");
        title.textContent = info.name || eventId;
        overlay.appendChild(title);

        // /--------------------------------------------\
        let finaltime = '';
        let moscowISOString;
        const [day, month, year] = info.date.split('.'); 
        const isoDatePart = `${year}-${month}-${day}`;
        if (info.time)  { moscowISOString = `${isoDatePart}T${info.time}:00+03:00` }
        else            { moscowISOString = `${isoDatePart}T${'19:00'}:00+03:00` };
        const eventDate = new Date(moscowISOString);
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        };
        finaltime = eventDate.toLocaleString(
            navigator.language,
            options
        );

        const date = document.createElement("p");
        date.textContent = finaltime || info.date || formatDateDDMMYYYY(dateObj) || "";
        overlay.appendChild(date);
        // \--------------------------------------------/

        const players = document.createElement("p");
        players.textContent = "Players: " + (data.players.length ? data.players.join(", ") : "-");
        players.style.maxHeight = '35px';
        players.style.overflowY = 'auto';
        overlay.appendChild(players);

        const medals = document.createElement("div");
        medals.style.display = "flex";
        medals.style.gap = "8px";
        medals.style.marginTop = "0.5rem";

        for (const awardId in data.awards) {
            const obj = data.awards[awardId];
            const img = document.createElement("img");
            img.src = "img/award/" + (obj.award.img || "noimg.png");
            img.alt = obj.award.name || "";
            img.title = obj.award.name || "";
            img.style.width = "32px";
            img.style.height = "32px";
            img.style.cursor = "pointer";

            img.onclick = () => {
                window.leaderboard.showAward(awardId);
                //alert(`🏅 ${obj.award.name}\nПолучили: ${obj.players.join(", ")}`);
            };

            medals.appendChild(img);
        }

        overlay.appendChild(medals);
        card.appendChild(overlay);
        return card;
    }

    // -------------------------
    // 6) Рендер: сначала будущие, затем разделитель, затем прошедшие
    // -------------------------
    // будущее
    if (futureEvents.length) {
        /*const futureTitle = document.createElement("h3");
        futureTitle.textContent = "Будущие события:";
        futureTitle.style.margin = "0.5rem 0 1rem 0";
        container.appendChild(futureTitle);*/

        futureEvents.forEach(e => container.appendChild(createCard(e, 'future')));
    }

    // разделитель (если есть и те, и другие)
    if (pastEvents.length && futureEvents.length) {
        const divider = document.createElement("div");
        divider.innerHTML = `
            <div class="ads" style="padding: 1rem; background: #333; color: #fff; text-align: center; border-radius: 0.5rem;">
                🌟 Here will be advertising of <a href="https://eeditor-ws.vercel.app/">EEditor - best scenario editor for Warnament</a> 🌟
                <br>
                <br>
                🌟 Тут должна быть реклама <a href="https://eeditor-ws.github.io/">EEditor'а - лучшего редактора сценариев для Warnament</a> 🌟
            </div>
        `;
        container.appendChild(divider);
    }

    // прошедшие
    if (pastEvents.length) {
        const pastTitle = document.createElement("h3");
        /*pastTitle.textContent = "Прошедшие события:";
        pastTitle.style.margin = "1rem 0 0.5rem 0";
        container.appendChild(pastTitle);*/

        pastEvents.forEach(e => container.appendChild(createCard(e)));
    }

    // Если нужно — можно вывести лог для отладки
    // console.log('Всего событий (events):', Object.keys(events).length);
    // console.log('Событий с игроками (eventsMap):', Object.keys(eventsMap).length);
    // console.log('Будущие:', futureEvents.map(e => ({ id: e.eventId, date: formatDateDDMMYYYY(e.dateObj) })));
    // console.log('Прошедшие:', pastEvents.map(e => ({ id: e.eventId, date: formatDateDDMMYYYY(e.dateObj) })));
});

async function downloadFile(url, fileName) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();
    const enhancedBlob = new Blob([blob], { type: contentType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(enhancedBlob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
    return new Promise(resolve => setTimeout(resolve, 100));
}

async function downloadScenario(id) {
    // Разбиваем id на части, предполагая формат 'часть1_часть2_часть3_часть4'
    const parts = id.split('_');

    // Берем первые две части и соединяем их через '/'.
    // Например, 'parkourcat_euro4_vg_1956' -> 'parkourcat/euro4'
    const scenarioPath = parts.slice(0, 2).join('/');

    // Формируем полный путь к файлу.
    // Если id = 'parkourcat_euro4_vg_1956', то filePath будет:
    // https://raw.githubusercontent.com/EEditor-WS/eeditor-ws-data/refs/heads/main/lib/parkourcat/euro4
    const filePath = `https://raw.githubusercontent.com/EEditor-WS/eeditor-ws-data/refs/heads/main/lib/${scenarioPath}/${id}.json`;

    // Используем последнюю часть id для имени файла
    const fileName = `${id}.json`; 

    // Загружаем файл
    await downloadFile(filePath, fileName);
}