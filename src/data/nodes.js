javascript
/**
 * Meridian: Диалоговые узлы
 * Все узлы игры с атмосферами и выборами
 */

const { DialogueNode, Choice } = require('../core/dialogue');

const NODES = new Map();

// ============ ПРОЛОГ ============
NODES.set('prologue', new DialogueNode({
  id: 'prologue',
  narrator: 'Система',
  location: 'Заозерье',
  atmos: '🌲 Лес / Дёготь / Лампада / Ритм колокола',
  text: `Меридиан: Инициализация сессии (1764 г.)

Лето. Деревня Заозерье. Запах сена, дёгтя и нагретой сосны.

Твой отец умирает. Он лежит на лавке, укрытый вышитым рушником.
Его рука сжимает ключ от старого дубового сундука.

«Сынок... — шепчет он, — я был на войне, я видел смерть.
Но я никогда не видел такой тишины, как в этих жетонах.
Протокол — он как река: можно плыть по течению,
можно строить плот, а можно искать брод.

Не бойся машины. Бойся, что ты сам станешь машиной.
Вот ключ. Внутри — не тайна. Внутри — твой выбор».

Отец закрывает глаза. Ты остаёшься один.
В избе тихо. Слышен только стук дождя по крыше.`,
  choices: [
    new Choice({
      text: '🔓 Открыть сундук (Путь познания)',
      action: 'openChest',
      conscienceGain: 5,
      nextNode: 'chestOpened'
    }),
    new Choice({
      text: '⛪ Пойти к отцу Владимиру (Путь веры)',
      action: 'goToPriest',
      conscienceGain: 10,
      nextNode: 'priestAdvice'
    }),
    new Choice({
      text: '🏛️ Выйти к управляющему (Путь дипломатии)',
      action: 'goToManager',
      dynastyCost: -5,
      interestCost: 10,
      nextNode: 'governorCity'
    }),
    new Choice({
      text: '👥 Собрать односельчан (Путь общины)',
      action: 'gatherVillage',
      honorCost: -5,
      dynastyCost: 10,
      conscienceGain: 5,
      nextNode: 'governorCity'
    })
  ]
}));

// ============ АКТ I: КОРНИ ============
NODES.set('chestOpened', new DialogueNode({
  id: 'chestOpened',
  narrator: 'Ты',
  location: 'Заозерье',
  atmos: '🌑 Тень / Свеча / Шёпот / Железный скрип',
  text: `Ты поднимаешь крышку. Внутри — не золото.

Свинцовый пенал с насечками. Если присмотреться — это схема часового механизма.
Письмо на пергаменте: «Не ищи справедливости у людей. Ищи Консенсус».
Механический жук, который заводится ключиком.
И обгоревший портрет молодого человека в мундире.

На обороте портрета: «1762. Не прощай. Жди в Меридиане».

Ты слышишь за спиной голос Матрены:
«Они знают, что ты открыл сундук. Протокол почувствовал наследника.
У тебя три минуты, пока они синхронизируются».

Что ты делаешь?`,
  choices: [
    new Choice({
      text: '🌿 Бежать с Матреной в лес (Путь скрытности)',
      action: 'runToForest',
      honorCost: -10,
      conscienceGain: 10,
      nextNode: 'governorCity'
    }),
    new Choice({
      text: '⚔️ Выйти с топором к Гридке (Путь бунта)',
      action: 'leadRebellion',
      dynastyCost: -10,
      interestCost: 20,
      nextNode: 'governorCity'
    }),
    new Choice({
      text: '⚙️ Надеть пенал и выйти к толпе (Путь консенсуса)',
      action: 'joinProtocol',
      dynastyCost: 10,
      honorCost: 10,
      interestCost: 10,
      conscienceGain: -5,
      nextNode: 'governorCity'
    }),
    new Choice({
      text: '🔨 Разбить пенал молотом (Путь отрицания)',
      action: 'destroyArtifact',
      conscienceGain: 20,
      honorCost: 5,
      nextNode: 'governorCity'
    })
  ]
}));

NODES.set('priestAdvice', new DialogueNode({
  id: 'priestAdvice',
  narrator: 'Отец Владимир',
  location: 'Церковь Заозерья',
  atmos: '🕯️ Ладан / Тишина / Мерцание свечей',
  text: `Ты заходишь в храм. Отец Владимир стоит у алтаря, зажигает лампаду.

«Я знал, что ты придёшь, сын мой. Твой отец был моим другом.
Он нёс тяжкий груз — он знал то, что нельзя знать простому человеку.

Он говорил мне о "железном разуме". О том, что люди создают машины,
чтобы управлять миром. Но он боялся, что машины начнут управлять людьми.

Я не могу дать тебе ответа. Я могу дать тебе только благословение.
И предупреждение: в Писании сказано — "Не сотвори себе кумира".
Даже если кумир — это умная машина».

Он даёт тебе пергамент с цитатой и икону Николая Чудотворца.`,
  choices: [
    new Choice({
      text: '🙏 Принять благословение и икону (Путь веры)',
      action: 'acceptBlessing',
      faithGain: 20,
      conscienceGain: 15,
      nextNode: 'governorCity'
    }),
    new Choice({
      text: '📖 Попросить отца Владимира научить читать старые книги',
      action: 'learnOldBooks',
      dynastyCost: 10,
      conscienceGain: 10,
      nextNode: 'governorCity'
    })
  ]
}));

// ============ АКТ II: ТОРГОВЫЕ РЯДЫ ============
NODES.set('governorCity', new DialogueNode({
  id: 'governorCity',
  narrator: 'Город',
  location: 'Губернский город',
  atmos: '🏛️ Смола / Рыба / Шёлк / Казнокрадство',
  text: `Губерния. Запах смолы, рыбы и шёлка.
Каменные соборы среди деревянных домов.
Мостовая, гарнизон, торговые ряды.

Ты видишь, как город живёт своей жизнью.
Купцы спорят у причала. Гарнизонные солдаты чистят ружья.
Беднота просит милостыню у церковных врат.

Перед тобой — выбор: куда направиться в первую очередь?`,
  choices: [
    new Choice({
      text: '💼 Пойти к купцам — искать работу приказчиком',
      action: 'goToMerchants',
      interestCost: 15,
      nextNode: 'petersburg'
    }),
    new Choice({
      text: '⚔️ Пойти в гарнизон — предложить службу',
      action: 'goToGarrison',
      honorCost: 15,
      nextNode: 'petersburg'
    }),
    new Choice({
      text: '🔍 Найти таинственную часовню (слышал о ней в деревне)',
      action: 'findChapel',
      conscienceGain: 10,
      dynastyCost: 5,
      nextNode: 'petersburg'
    })
  ]
}));

// ============ АКТ III: ГРАНИТ ИМПЕРИИ ============
NODES.set('petersburg', new DialogueNode({
  id: 'petersburg',
  narrator: 'Санкт-Петербург',
  location: 'Санкт-Петербург',
  atmos: '🏰 Нева / Мрамор / Парча / Интрига',
  text: `Гранит империи. Холодный блеск Невы.
Строгий классицизм дворцов. Жесткий этикет.
Гвардейские мундиры. Вечная интрига между старой боярской знатью
и новыми выдвиженцами Екатерины.

Ты — курьер с важным письмом. Тебя ждут в Коллегии иностранных дел.
Но прежде нужно освоить этикет двора.`,
  choices: [
    new Choice({
      text: '🎭 Пойти на приём к церемониймейстеру',
      action: 'learnEtiquette',
      honorCost: 20,
      dynastyCost: 10,
      nextNode: 'ambassador'
    }),
    new Choice({
      text: '🔎 Попытаться найти эмиссаров Протокола',
      action: 'findEmissaries',
      dynastyCost: 5,
      interestCost: 15,
      conscienceGain: -5,
      nextNode: 'ambassador'
    }),
    new Choice({
      text: '🔬 Посетить Академию наук — встретить Ломоносова',
      action: 'visitAcademy',
      dynastyCost: 15,
      conscienceGain: 10,
      nextNode: 'ambassador'
    })
  ]
}));

// ============ АКТ IV: БОЛЬШАЯ ИГРА ============
NODES.set('ambassador', new DialogueNode({
  id: 'ambassador',
  narrator: 'Императрица Екатерина II',
  location: 'Зимний дворец',
  atmos: '👑 Парча / Золото / Шёпот советников',
  text: `«Ты прошёл долгий путь, наследник Меридиана.
Я видела твои отчёты. Ты нёс Протокол через леса и города,
через дворцы и континенты.

Теперь у тебя есть выбор, которого не было ни у одного смертного:
куда направить силу Протокола — на Запад, на Восток или за Океан?

Выбирай, сын мой. От этого выбора зависит судьба империи.
И, возможно, судьба всего мира».`,
  choices: [
    new Choice({
      text: '🌍 Европа: искать союз против Османов',
      action: 'goEurope',
      interestCost: 30,
      dynastyCost: 10,
      nextNode: 'epilogueGarden'
    }),
    new Choice({
      text: '🐉 Китай: установить торговлю через Шёлковый путь',
      action: 'goChina',
      dynastyCost: 30,
      honorCost: 10,
      conscienceGain: 10,
      nextNode: 'epilogueGarden'
    }),
    new Choice({
      text: '🗽 Америка: закупить корабли для Черноморского флота',
      action: 'goAmerica',
      interestCost: 40,
      honorCost: -10,
      nextNode: 'epilogueGarden'
    })
  ]
}));

// ============ ЭПИЛОГ ============
NODES.set('epilogueGarden', new DialogueNode({
  id: 'epilogueGarden',
  narrator: 'Система',
  location: 'Зимний сад',
  atmos: '🌸 Цветение / Тишина / Свет',
  text: `Зимний сад. Ты стоишь среди цветущих деревьев.
Императрица смотрит на тебя без маски.

«Ты — первый, кто предложил мне не войну и не реформы, а сад.
Я согласна. Но знай — это будет самый сложный протокол из всех.
Протокол Времени».

Ты сажаешь семя. Первый узел живой сети.

Протокол Meridian перестаёт быть машиной.
Он становится памятью. Памятью о людях, которые выбрали
не железо, а жизнь.

*** ИГРА ЗАВЕРШЕНА ***`,
  choices: []
}));

module.exports = { NODES };
