
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
            },
            "ru": {
                "leaderboard": "Доска лидеров",
                "discord": "Discord",
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
                el.textContent = translation;
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