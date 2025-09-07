
// Проверяем, есть ли translations
const translations = {
}
window.translations = window.translations || {};

class LangMgr {
    constructor(translations, defaultLang = "en") {
        this.translations = {
            "en": {
                "leaderboard": "Leaderboard",
                "discord": "Discord",
                "donate": "Donate Info",

                "score": "Score",
                "game": "Game-name",
                "awards": "Awards",
                "events": "Events",
                
                "winner": "Winner",
                "great power": "Great Power",
                "win side": "Winner Side",
                "strong defender": "Strong Defender",
                "part of winner": "Vassal/Part of Winner",
                
                "nameDT": "Name:",
                "eventDT": "Event:",
                "typeDT": "Type:",
                "scoreDT": "Score:",
                "donatetext": "<div style='display: inline-flex'><p>Not anavible now for Western cards. For read about how to pay using Russian card <i onclick='window.langMgr.setLang(`ru`)' style='color: #b62fe8; cursor: pointer;'>change language</i></p></div>",
                "donateoptions": `
<h2>Elite</h2>
<b>Duration: </b>1 month<br>
<b>Cost: </b>1 USD/100 RUR<br>
<b>Features:</b><br>
1. Cool prefix<br>
2. /civ command<br>
3. Special role in Discord<br>
4. Elite category in Discord<br>
5. Commands for customizing the country<br>
6. /content command and viewing all scenarios and maps<br>
7. Permission to write guides in the Discord server<br>
8. Access to the great server archive<br>
<br>
<i>Pay using western cards coming soon... All information about payment from Russian cards here: <a href="#donateru" onclick="document.getElementById('donateru').classList.add('active')">click</a></i>`,
            },
            "ru": {
                "leaderboard": "Доска лидеров",
                "discord": "Discord",
                "donate": "Информация о Донате",

                "score": "Счёт",
                "game": "Ник в игре",
                "awards": "Медальки",
                "events": "Ивенты",
                
                "winner": "Победитель",
                "great power": "Великая Держава",
                "win side": "Победившая Сторона",
                "strong defender": "Сильный Защитник",
                "part of winner": "Субъект/Вассал Победителя",
                
                "nameDT": "Название:",
                "eventDT": "Ивент:",
                "typeDT": "Тип:",
                "scoreDT": "Ценность:",

                "donatetext": `
<h2> Информация по заказу и оплате доната</h2>

<b>Начните перевод нужной суммы для определённого товара на  карту: 2202208093100387</b><br>
Карта Сбербанка, получатель Денис Д.<br>
<br>
При переводе, заполните сообщение получателю по данной форме, чтобы мы знали, кому и как выдавать товар:<br>
1. Что покупаете<br>
2. Ваше имя пользователя в Discord<br>
3. Ваш ID в Warnament (чтобы узнать, напишите любое сообщение в чате, цифра у ника - ваш ID)<br>
<br>
<b>После выполнения всех указанных с верху действий, просто ждите вашу награду.</b><br>
<br>
<h2>Важно!</h2>
Если вы пришлёте недостаточное количество средств для совершения покупки, мы не несём ответственность за возращение средств. Награда также не будет задействована. Пожалуйста, будьте внимательны при покупке!<br>
<br>
<i>При совершении доната вы не только получаете награду, но и сильно помогаете нам развивать проект.</i><br>`,
                "donateoptions": `
<h2>Elite</h2>
<b>Продолжительность: </b>1 месяц<br>
<b>Стоимость: </b>1 доллар/100 рублей<br>
<b>Особенности:</b><br>
1. Классный префикс<br>
2. команда /civ<br>
3. Особая роль в Discord<br>
4. Элитная категория в Discord<br>
5. Команды для настройки страны<br>
6. Команда /content и просмотра всех сценариев и карт<br>
7. Разрешение на написание руководств на сервере Discord<br>
8. Доступ к большому архиву сервера<br>
<br>
<i>Вся информация об оплате с российских карт здесь: <a href="#donateru" onclick="document.getElementById('donateru').classList.add('active')">click</a></i>`,
            },
        };
        if (localStorage.getItem('SaturnLang')) {
            this.currentLang = localStorage.getItem('SaturnLang');
        } else {
            this.currentLang = defaultLang;
        }

        if (!this.translations[this.currentLang]) {
            console.warn(`Язык "${this.currentLang}" не найден в translations`);
        }
    }

    setLang(lang) {
        if (!this.translations[lang]) {
            console.warn(`Язык "${lang}" не найден, остаёмся на "${this.currentLang}"`);
            return;
        }
        this.currentLang = lang;
        this.applyTranslations();
        localStorage.setItem('SaturnLang', lang)
    }

    applyTranslations(root = document) {
        const elements = root.querySelectorAll("[data-lang]");
        elements.forEach(el => {
            const key = el.getAttribute("data-lang");
            const translation = this.translations[this.currentLang]?.[key];
            if (translation) {
                if (translation.includes('<')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            } else {
                console.warn(`Нет перевода для ключа "${key}" на языке "${this.currentLang}"`);
            }
        });
    }

    trs(text) {
        return this.translations[this.currentLang][text];
    }
}

window.langMgr = new LangMgr(window.translations, "en");

// Авто-применение при загрузке
document.addEventListener("DOMContentLoaded", () => {
    window.langMgr.applyTranslations();
});