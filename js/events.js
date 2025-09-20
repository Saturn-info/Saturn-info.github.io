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
        if (info.img) card.style.backgroundImage = `url("img/events/${info.img}")`;
        card.style.backgroundSize = "cover";
        card.style.backgroundPosition = "center";
        card.style.borderRadius = "0.4rem";
        card.style.padding = "1rem";
        card.style.marginBottom = "1rem";
        card.style.color = "#fff";
        card.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
        if (time === 'future') card.style.border = "5px solid #939347"; // желтая рамка для будущих событий

        const overlay = document.createElement("div");
        // затемняющий фон, чтобы текст читался на ярком фоне
        // overlay.style.background = "rgba(0,0,0,0.45)";
        overlay.style.padding = "0.5rem";
        overlay.style.borderRadius = "0.6rem";

        const title = document.createElement("h2");
        title.textContent = info.name || eventId;
        overlay.appendChild(title);

        const date = document.createElement("p");
        date.textContent = info.date || formatDateDDMMYYYY(dateObj) || "";
        overlay.appendChild(date);

        const players = document.createElement("p");
        players.textContent = "Players: " + (data.players.length ? data.players.join(", ") : "-");
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
                alert(`🏅 ${obj.award.name}\nПолучили: ${obj.players.join(", ")}`);
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
            <div style="padding: 1rem; margin: 1rem 0; background: #333; color: #fff; text-align: center; border-radius: 0.5rem;">
                🌟 Here will be advertising of <a href="https://eeditor-ws.github.io/">EEditor - best scenario editor for Warnament</a> 🌟
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
