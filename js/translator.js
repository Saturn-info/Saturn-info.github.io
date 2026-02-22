
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
                "ratio": "Ratio",
                "game": "Game-name",
                "awards": "Medals",
                "events": "Events",
                "medalsqe": "Medals",
                
                "winner": "Winner",
                "great power": "Great Power",
                "win side": "Winner Side",
                "strong defender": "Strong Defender",
                "part of winner": "Vassal/Part of Winner",
                
                "nameDT": "Name:",
                "eventDT": "Event:",
                "typeDT": "Type:",
                "scoreDT": "Score:",
                "dateDT": "Date:",

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

                "medals_wintitle":   "Winner",
                "medals_conqtitle":  "Conqueror",
                "medals_greattitle": "Great Power",
                "medals_sidetitle":  "Winner Side",
                "medals_deftitle":   "Strong Defender",
                "medals_wininfo": "Top 1 in the leaderboard, winner of the largest war, or one of the two/three largest +- equally strong countries that do not have open (sanctions/war) confrontation with each other",
                "medals_conqinfo": "A country that does not fulfill the Winner conditions, or controlled large territories at one point",
                "medals_greatinfo": "Top 2/3 in the leaderboard, or a country directly or through vassalage controls +-1/3 of the map's land",
                "medals_sideinfo": "Winner's ally or vassal",
                "medals_definfo": "A country that held a very strong/long defense",
                "leadertable": "Table of Leaders",                "rules":             "Rules",

                "rules_base": `
- 1.1 Users who join the server automatically agree to the rules. Ignorance of the rules does not exempt from responsibility.
- 1.2 The 5 strongest players according to the Saturn leaderboard and the overall leaderboard cannot take the 5 strongest countries
- 1.3 Complaints about the actions of the administration may be written only in private messages to that admin, or in private messages to a higher-ranking admin
- 1.4 The use of multiple accounts (alts) to gain an advantage is prohibited: transferring land, votes, resources, or coordinating actions between your own accounts is considered cheating
- 1.5 It is forbidden to organize "farming" of victories/resources with other players (for example — systematic coordinated attacks in order to transfer resources to one side)
- 1.6 It is forbidden to make a vassal of a country that has revolted inside another country
`,
                "rules_admin": `
- 2.1 Administrators are forbidden to abuse their status and mock those who have fewer rights.
- 2.2 The administration has the right to interpret the rules as it wishes.
- 2.3 The administration has the right to change the rules, notifying players in Discord.
- 2.4 The administration has the right to make exceptions to the rules, even during the course of the game (since the rules are not perfect, to close loopholes in them, etc.)
- 2.5 An admin has the right to adjust borders when creating the second/third/... parts of an event`,
                "rules_wg": `
- 3.1 It is forbidden to transfer all of your territories to another country except for
    - transfer to an ally who has the same enemies when you need to leave
    - capitulation, and the division of territory must be either by agreement of all (non-vassal) winning countries, or in a proportion equal to their contribution in the war (losses, duration of the war)
- 3.2 It is forbidden to become a vassal for a short period (<20 turns), after which to declare independence without the agreement of the suzerain
- 3.3 It is forbidden to transfer illogical territories in order to obtain a vassal, or to create many (more than 2) countries for the sake of a vassal 
- 3.4 It is forbidden to create illogical enclaves, for example, playing as the Netherlands to buy Crimea from Russia
    - Islands and provinces controlling straits are allowed to be taken
- 3.5 You may buy land only from your vassals and other players
    - You may sell land only to your vassals and other players
- 3.6 You may annex vassals created during the game and small (in the opinion of the admins) initial vassals
- 3.7 It is forbidden to sell your territories to a third country in order to cut yourself off from an enemy with whom you are at war`,
                "rules_rp": `
- 5.1 All justifications and actions must be as logical as possible and fit the context of the game
- 5.2 Technologies researched by the player must fit the context of the scenario year
    - ❌ *"I’ll drop a nuke on France in the year 1200, uranium exists, technically I can..)"*
    - ✅ *"Like a gigachad, I will not research tanks before the beginning of the 20th century."*
- 5.3 Weapons may be used only as a last resort in case of heavy losses or when capturing important strategic points
    - ❌ "Launch a missile at London for a landing in Brittany, playing as Germany, without receiving a threat to the capital and sovereignty"
    - ✅ "Launch a volley of nuclear missiles at the USA after the capture of Moscow."
- 5.4 War may be declared only for reasons from the list or with the consent of an admin (if your reason sounds logical but is not on the list)
    - Stopping war crimes — in the case of the use of chemical weapons — vassalization or fragmentation of the country
    - (Democracy) Overthrow of a диктаторский regime — against countries with the ideology of fascism or communism — release or vassalization of the country with corrected ideology
    - (Communism) Overthrow of the bourgeois-imperialist regime — against countries with the ideology of democracy, trade republic, theocracy, monarchy — release or vassalization of the country with corrected ideology or annexation
    - (Monarchy) Restoration of royal power — against countries with the ideology of communism, fascism, democracy — release or vassalization of the country with corrected ideology
    - (Theocracy) Crusade / Jihad — against countries with a different religion or religious branch/sect — release or vassalization or conquest of the country, possible ideology correction
    - Gathering/returning lands — against countries possessing >2 provinces in which in reality a large number of people of your major nationalities live (Russians for Russia, all Chinese and Mongols for China, Austro-Germans and Yugoslavs and Czechoslovaks and Hungarians and Ukrainians for Austria-Hungary) — annexation of lands with a predominant population of yours and vassalization, fragmentation or release of the remaining part
    - (Monarchy, Democracy, Trade Republic) Colonization — against underdeveloped countries — annexation or vassalization 
    - (Monarchy) Vassalization — against countries smaller by 2 or more times — vassalization 
    - (Monarchy, Democracy, Trade Republic, Fascism, Theocracy) — war for a specific territory outside your homeland or vassal — annexation
- 5.5 A change of ideology must be justified, must not violate logic, and preparation for it must be carried out
    - The ideology must correspond to the year of the scenario: communism and fascism may appear only from the 20th century (exceptions are possible with admin permission)
    - The change of ideology must be announced in chat
    - Before changing ideology, there must be a reason for it.
        - Growth of radicalism due to defeat in a war, or surrounding of the country by others with the same ideology (to theocracy, communism or fascism)
        - Restoration of a historical ideology, in case your ideology was changed at a peace conference 
        - Adoption of a constitution (from monarchy/theocracy to trade republic/democracy)
        - Victory in elections / seizure of power by one of the largest parties in the country
        - High social stratification and/or discontent (to communism)
        - Defeat in a major war (to fascism or theocracy)
- 5.6 Transfer/sale of territories must be justified
- 5.7 A rebellion must be justified and this justification must be accepted by an admin
    - A rebellion is possible without the consent of an admin if the suzerain takes territories without consent
- 5.8 All international agreements must be role-played in chat/on the forum and recorded.
    - The terms of treaties must correspond to the capabilities, interests of the parties and the context of the scenario year
    - Termination of treaties requires justification: violation of terms by the partner, change of ideology, direct threat to sovereignty
        - ❌ "Terminate a non-aggression pact because 'I changed my mind'"
        - ✅ "Declare the treaty invalid after the partner violated its terms, role-playing a diplomatic note"
- 5.9 Ban on metagaming and godmodding
    - ❌ Using player knowledge not available to the character/state within the scenario
    - ❌ Controlling the actions, decisions or territories of other players without their consent
    - ✅ Acting only within the information officially received by your state
    - ✅ Respect for roleplay and the sovereignty of other participants
    - ❌ "In the mid-30s to know that Germany will commit genocide against Slavs and Jews"
    - ✅ "Act on the basis of intelligence reports and completed RP actions, which may be incomplete or outdated"
- 5.10 Economic actions and sanctions
    - Sanctions, embargoes, trade preferences must be logical and correspond to the economic potential of the parties
    - Large-scale investments, loans or humanitarian aid require justification of available resources and political motives
    - An economic collapse/boom cannot occur "suddenly" without prior role-play of a crisis or reforms and plunging the country into a real crisis (for example, by lowering tax rates)
        - ❌ "Impose a total embargo against a major power without having alternative markets"
        - ✅ "Gradually introduce restrictions, role-playing the search for new partners and internal consequences"
- 5.11 Appeals to admins and dispute resolution
    - Disputed situations are resolved by contacting an admin with clear argumentation and references to the rules
    - Decisions of admins are final, but may be revised if new significant facts appear or by higher-ranking admins
    - Abuse of appeals to delay the game or pressure opponents is prohibited
        - ✅ "Provide screenshots/logs of correspondence for an objective review of the situation"
- 5.12 Alternative history and the limits of what is acceptable
    - Deviations from historical events are allowed, but must preserve the internal logic of the world and cause-and-effect relationships
    - The "butterfly effect" is taken into account: major changes entail cascading consequences for the region and the world
    - It is forbidden to create "super-states" or "empires of evil" without appropriate multi-stage role-play and balance
        - ❌ "Unite all of Europe in 5 years without wars, uprisings and diplomatic resistance"
        - ✅ "Gradually expand influence, role-playing integration, elite resistance and international reaction"
- 5.14 Management of population and annexed territories
    - Annexation of territories with a foreign population may cause instability, growth of resistance and international condemnation
    - Assimilation, granting autonomy or repression — the choice of policy must be role-played and have long-term consequences
        - ❌ "Annex all vassals you see"
        - ✅ "Introduce autonomy to reduce tension, but role-play resistance from central authorities and local elites"
5.15 Player interaction and etiquette
    - Respect the time, effort and role-play of other participants — the game is team-based
    - Avoid off-topic discussion in game channels; use the appropriate sections to discuss mechanics
    - Conflicts between characters/states are resolved in-character; personal grievances stay out of the game
    - Insults, discrimination and toxic behavior in any form are prohibited
        ✅ "Discuss a controversial point in private messages or with a mediator before escalating the conflict in the game"`,
                "rules_eg": `
- 4.1 In this mode, **war is prohibited**.
    - Any declarations of war, attacks, capture of territories, etc. are strictly prohibited.
- 4.2 **It is forbidden to transfer provinces** between countries.
    - There are no exceptions — any transfers are considered a violation.
- 4.3 **It is forbidden to change the ideology** of your country.
- 4.4 **The goal of the game is maximum income growth.**
    - The winner is the country that increases its income by a factor greater than that of other players.
    - What matters is not the absolute income value, but the growth coefficient relative to the initial value.
- 4.5 Violation of the rules (wars, transfer of provinces, change of ideology) may lead to **annulment of the result**.`,
            },
            "ru": {
                "leaderboard": "Медали",
                "discord": "Discord",
                "donate": "Донат",

                "score": "Счёт",
                "ratio": "Счёт",
                "game": "Ник в игре",
                "awards": "Медальки",
                "events": "Ивенты",
                "medalsqe": "Медали",
                
                "winner": "Победитель",
                "great power": "Великая Держава",
                "win side": "Победившая Сторона",
                "strong defender": "Сильный Защитник",
                "part of winner": "Субъект/Вассал Победителя",
                
                "nameDT": "Название:",
                "eventDT": "Ивент:",
                "typeDT": "Тип:",
                "scoreDT": "Ценность:",
                "dateDT": "Дата:",

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

                "medals_wintitle":   "Победитель",
                "medals_conqtitle":  "Завоеватель",
                "medals_greattitle": "Великая Сила",
                "medals_sidetitle":  "Сторона Победы",
                "medals_deftitle":   "Сильный Защитник",
                "medals_wininfo":    "Топ-1 в таблице лидеров, победитель в крупнейшей войне, или одна из двух/трёх крупнейших +-одинаково сильных стран, не имеющих между собой открытого (санкции/война) противостояния",
                "medals_conqinfo":   "Страна, не выполняющая условия для Победителя, но хотя бы кратковременно завоевавшая значительные территории (треть земли карты, или 2/3 части света)",
                "medals_greatinfo":  "Топ-2/3 в таблице лидеров, или страна прямо или через вассалитет контролирует +-1/3 земли карты",
                "medals_sideinfo":   "Союзник или вассал Победителя",
                "medals_definfo":    "Страна, державшая очень сильную/долгую оборону",
                "leadertable":       "Таблица Лидеров",
                "rules":             "Правила",

                "rules_base": `
- 1.1 Пользователи присоединившиеся на сервер, автоматически соглашаются с правилами. Не знание правил не освобождает от ответственности.
- 1.2 5 сильнейших игроков согласно таблице лидеров Сатурна и общей не могут садится на 5 сильнейших стран
- 1.3 Недовольство деятельностью администрации можно писать только в личку этому админу, или в личку вышестоящему админу
- 1.4 Запрещено использование нескольких аккаунтов (альтов) для получения преимущества: передача земли, голосов, ресурсов или координация действий между своими аккаунтами считается читерством
- 1.5 Запрещено организовывать "фарминг" побед/ресурсов с другими игроками (например — систематическое согласованное нападение ради передачи ресурсов одной стороне)
- 1.6 Запрещено делать вассалом страну, восставшую внутри другой страны
`,
                "rules_admin": `
- 2.1 Администраторам запрещается злоупотреблять своим званием и издеваться над теми, у кого прав меньше.
- 2.2 Администрация имеет право трактовать правила так, как хочет.
- 2.3 Администрация имеет право изменять правила, оповещая игроков в дискорде.
- 2.4 Администрация имеет право вносить исключения в правила, даже по ходу игры (т.к. правила не идеальны, для закрытия дыр в них и т.п.)
- 2.5 Админ в праве корректировать границы при создании второй/третей/... частей ивента`,
                "rules_wg": `
- 3.1 Запрещается передавать все свои территории другой стране за исключением
    - передача союзнику, имеющего одинаковых врагов, когда тебе нужно уходить
    - капитуляция, причём раздел территории должен быть либо по договору всех (не-вассальных) стран-победителей, либо в соотношении равном заслугам в войне (потери, длительность войны)
- 3.2 Запрещено становиться вассалом на короткий срок (<20 ходов), после чего провозглашать независимость без соглашения сюзерена
- 3.3 Запрещено передавать нелогичные территории ради получения вассала, или выделять много (больше 2) стран ради вассала 
- 3.4 Запрещается делать нелогичные анклавы, например играя за Нидерланды купить Крым у России
    - Острова, провки контроля проливов разрешено брать
- 3.5 Покупать земли можно только у своих вассалов и других игроков
    - Продавать земли можно только своим вассалам и другим игрокам
- 3.6 Аннексировать можно вассалов созданных во время игры и небольших (по мнению админов) изначальных вассалов
- 3.7 Запрещено продавать свои территории третей стране для отрезания себя от противника, с которым идёт война`,
                "rules_rp": `
- 5.1 Все обоснования и действия должны быть максимально логичны и подпадать под контекст игры
- 5.2 Технологии изучаемые игроком, должны подходить под контекст года сценария
    - ❌ *"Скину-ка я ядерку на Францию в 1200 году, уран же есть, технически могу..)"*
    - ✅ *"Как гигачад не буду изучать танки до начала 20 века."*
- 5.3 Можно использовать оружие только в крайнем случае при больших потерях или при захвате важных стратегических точек
    - ❌ "Кинуть ракету в Лондон за высадку в Бретань, играя за Германию, не получая угрозы на столицу и суверенитет"
    - ✅ "Бросить залп ядерных ракет по США после взятия Москвы."
- 5.4 Войну можно объявлять только по причинам из списка или с согласия админа (если ваша причина звучит логично, но отсутствует в списке)
    - Прекращение военных преступлений - в случае использования химического оружия - вассализация или дробление страны
    - (Демократия) Свержение диктаторского режима - против стран с идеологией фашизм или коммунизм - отпускание или вассализация страны с исправленной идеологией
    - (Коммунизм) Свержение буржуйско-имперского режима - против стран с идеологией демократия, торговая республика, теократия, монархия - отпускание или вассализация страны с исправленной идеологией или аннексия
    - (Монархия) Восстановление царской власти - против стран с идеологией коммунизм, фашизм, демократия - отпускание или вассализация страны с исправленной идеологией
    - (Теократия) Крестовый Поход / Джихад - против стран с иной религией или религиозным течением/ветвью - отпускание или вассализация или захват страны, возможно исправление идеологии
    - Собирание/возвращение земель - против стран, обладающих >2 провинций, на которых в реальности проживает большой количество людей твоих крупных национальностей (русские для России, все китайцы и монголы для Китая, австро-немцы и югославы и чехословаки и венгры и украинцы для Австровенгриии) - аннексия земель с преобладающим твоим населением и вассализация, дробление или отпускание остальной части
    - (Монархия, Демократия, Торговая Республика) Колонизация - против малоразвитых стран - аннексия или вассализация 
    - (Монархия) Вассализация - против стран меньших в 2 и более раз - вассализация 
    - (Монархия, Демократия, Торговая Республика, Фашизм, Теократия) - война за определённую территорию вне родной земли или вассала - аннексия
- 5.5 Смена идеологии должна быть обоснована, не нарушать логику и быть проведена подготовка к этому
    - Идеология должна подходить к году сценария: коммунизм и фашизм могут появляться только с 20 века (возможны исключения, с разрешения админа)
    - О смене идеологии должно быть уведомление в чате
    - Перед тем как менять идеологию, должна быть причина для этого.
        - Рост радикализма из-за поражения в войне, или окружения страны другими с такой идеологией (в теократию, коммунизм или фашизм)
        - Восстановление исторической идеологии, в случае если ваша идеология была изменена на мирной конференции 
        - Принятие конституции (из монархии/теократии в торговую республику/демократию)
        - Победа на выборах/захват власти одной из крупнейших в стране партий
        - Высокое социальное расслоение и/или недовольство (в коммунизм)
        - Поражение в крупной войне (в фашизм или теократию)
- 5.6 Передача/продажа территорий должна быть обоснована
- 5.7 Восстание должно быть обосновано и это обоснование принято админом
    - Восстание возможно без согласния админа в случае если сюзерен забирает территории без согласия
- 5.8 Все международные соглашения должны быть отыграны в чате/на форуме и зафиксированы.
    - Условия договоров должны соответствовать возможностям, интересам сторон и контексту года сценария
    - Расторжение договоров требует обоснования: нарушение условий партнёром, смена идеологии, прямая угроза суверенитету
        - ❌ "Расторгнуть пакт о ненападении потому что 'передумал'"
        - ✅ "Объявить договор недействительным после того, как партнёр нарушил его условия, отыграв дипломатическую ноту"
- 5.9 Запрет на метагейминг и годмоддинг
    - ❌ Использование знаний игрока, недоступных персонажу/государству в рамках сценария
    - ❌ Контроль действий, решений или территорий других игроков без их согласия
    - ✅ Действия только в пределах информации, официально полученной вашим государством
    - ✅ Уважение к отыгрышу и суверенитету других участников
    - ❌ "В середине 30х знать что Германия устроит геноцид славян и евреев"
    - ✅ "Действовать на основе разведсводок и соврешённых РП-действий, которые могут быть неполными или устаревшими"
- 5.10 Экономические действия и санкции
    - Санкции, эмбарго, торговые преференции должны быть логичны и соответствовать экономическому потенциалу сторон
    - Массовые инвестиции, займы или гуманитарная помощь требуют обоснования наличия ресурсов и политических мотивов
    - Экономический коллапс/бум не может наступить "внезапно" без предшествующего отыгрыша кризиса или реформ и вгонения страны в реальный кризис (например, роняя урвень налогов)
        - ❌ "Ввести тотальное эмбарго против крупной державы, не имея альтернативных рынков"
        - ✅ "Поэтапно вводить ограничения, отыгрывая поиск новых партнёров и внутренние последствия"
- 5.11 Обращение к админам и разрешение споров
    - Спорные ситуации решаются через обращение к админу с чёткой аргументацией и ссылками на правила
    - Решения админов окончательны, но могут быть пересмотрены при появлении новых существенных фактов или вышестоящими админами
    - Злоупотребление апелляциями для затягивания игры или давления на оппонентов запрещено
        - ✅ "Предоставить скриншоты/логи переписки для объективного разбора ситуации"
- 5.12 Альтернативная история и границы допустимого
    - Отклонения от исторических событий допустимы, но должны сохранять внутреннюю логику мира и причинно-следственные связи
    - "Эффект бабочки" учитывается: крупные изменения влекут каскадные последствия для региона и мира
    - Запрещено создавать "супер-государства" или "империи зла" без соответствующего многоступенчатого отыгрыша и баланса
        - ❌ "Объединить всю Европу за 5 лет без войн, восстаний и дипломатического сопротивления"
        - ✅ "Поэтапно расширять влияние, отыгрывая интеграцию, сопротивление элит и международную реакцию"
- 5.14 Управление населением и присоединёнными территориями
    - Присоединение территорий с чуждым населением может вызывать нестабильность, рост сопротивления и международное осуждение
    - Ассимиляция, предоставление автономии или репрессии — выбор политики должен быть отыгран и иметь долгосрочные последствия
        - ❌ "Аннексировать всех вассалов что видишь"
        - ✅ "Ввести автономию для снижения напряжённости, но отыграть сопротивление центральных властей и местных элит"
5.15 Взаимодействие игроков и этикет
    - Уважайте время, усилия и отыгрыш других участников — игра командная
    - Избегайте оффтопа в игровых каналах; для обсуждения механик используйте соответствующие разделы
    - Конфликты между персонажами/государствами решаются in-character; личные обиды остаются вне игры
    - Запрещены оскорбления, дискриминация и токсичное поведение в любой форме
        ✅ "Обсудить спорный момент в ЛС или с медиатором, прежде чем эскалировать конфликт в игре"`,
                "rules_eg": `
- 4.1 В данном режиме **запрещено воевать**.
    - Любые объявления войн, нападения, захваты территорий и т.п. строго запрещены.
- 4.2 **Запрещается передавать провинции** между странами.
    - Исключений нет — любые передачи считаются нарушением.
- 4.3 **Запрещается менять идеологию** своей страны.
- 4.4 **Цель игры — максимальный рост дохода.**
    - Побеждает страна, которая увеличит свой доход во столько раз, сколько больше, чем у других игроков.
    - Важно не абсолютное значение дохода, а именно коэффициент роста относительно начального значения.
- 4.5 Нарушение правил (войны, передача провинций, смена идеологии) может привести к **аннулированию результата**.`,
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
            let translation;
            if (key === 'medalsqe' && window.matchMedia("(orientation: portrait)").matches) {
                translation = '?';
            } else {
                translation = this.translations[this.currentLang]?.[key];
            }
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
        const ret = this.translations[this.currentLang][text];
        if (ret === undefined) {
            return text;
        } else {
            return ret;
        }
    }
}

window.langMgr = new LangMgr(window.translations, "en");

// Авто-применение при загрузке
document.addEventListener("DOMContentLoaded", () => {
    window.langMgr.applyTranslations();
});