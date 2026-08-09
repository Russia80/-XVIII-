javascript
/**
 * Meridian: Действия персонажа
 * Все функции, которые выполняются при выборе
 */

const actions = {
  // ============ АКТ I: КОРНИ ============
  
  openChest(player) {
    player.setFlag('chestOpened');
    player.addItem('свинцовый пенал');
    player.addItem('письмо отца');
    player.addItem('механический жук');
    player.addItem('обгоревший портрет');
    return 'Ты открываешь сундук. Внутри — тайна, которая изменит твою жизнь.';
  },

  goToPriest(player) {
    player.setFlag('priestVisited');
    return 'Ты идёшь к отцу Владимиру. Ступаешь на порог храма.';
  },

  goToManager(player) {
    player.setFlag('managerVisited');
    return 'Управляющий встретил тебя настороженно, но дал рекомендательное письмо в город.';
  },

  gatherVillage(player) {
    player.setFlag('villageGathered');
    return 'Сход постановил: отправить тебя в город как доверенного человека. Народ верит в тебя.';
  },

  runToForest(player) {
    player.setFlag('fledToForest');
    player.addItem('лесной компас');
    return 'Ты бежишь через болото. Матрена ведёт тебя тайной тропой. Ветер в лицо.';
  },

  leadRebellion(player) {
    player.setFlag('rebellionLed');
    return 'Гридка собирает мужиков. Ты — впереди. Слышен звон наковален. Кузнецы готовят оружие.';
  },

  joinProtocol(player) {
    player.setFlag('protocolJoined');
    player.clearance = 'VALIDATOR';
    player.addItem('жетон валидатора');
    return 'Ты надеваешь пенал. Толпа расступается. Протокол признал тебя. Ты чувствуешь холодный разум.';
  },

  destroyArtifact(player) {
    player.setFlag('artifactDestroyed');
    return 'Ты разбиваешь пенал молотом. Внутри — пустота. Или свобода? Ты выбираешь не знать.';
  },

  acceptBlessing(player) {
    player.setFlag('blessed');
    player.addItem('икона Николая Чудотворца');
    player.addItem('пергамент с цитатой');
    return 'Отец Владимир благословляет тебя. Ты чувствуешь тепло в груди. Вера укрепляется.';
  },

  learnOldBooks(player) {
    player.setFlag('oldBooksRead');
    return 'Ты учишься читать старые славянские книги. Мир открывается по-новому. Ты видишь слова предков.';
  },

  // ============ АКТ II: ТОРГОВЫЕ РЯДЫ ============

  goToMerchants(player) {
    player.setFlag('merchantWork');
    player.addItem('купчая книга');
    player.location = 'Губерния';
    return 'Купцы принимают тебя приказчиком. Ты учишься вести счета и понимать цену вещей.';
  },

  goToGarrison(player) {
    player.setFlag('garrisonService');
    player.addItem('солдатская сабля');
    player.location = 'Губерния';
    return 'Ты поступаешь на службу в гарнизон. Учишься владеть саблей и держать строй.';
  },

  findChapel(player) {
    player.setFlag('chapelFound');
    player.addItem('свинцовая пластина');
    player.location = 'Губерния';
    return 'Ты находишь часовню. Механический орган играет без музыканта. Кто-то ждал тебя здесь.';
  },

  // ============ АКТ III: ГРАНИТ ИМПЕРИИ ============

  learnEtiquette(player) {
    player.setFlag('etiquetteLearned');
    player.location = 'Санкт-Петербург';
    return 'Церемониймейстер учит тебя кланяться. Он знал твоего отца. «Будь осторожен, — шепчет он. — За тобой следят».';
  },

  findEmissaries(player) {
    player.setFlag('emissariesFound');
    player.location = 'Санкт-Петербург';
    player.addItem('эмиссарский перстень');
    return 'Ты находишь эмиссаров Протокола. Они ждали тебя. «Ты — наследник, — говорят они. — Иди к императрице».';
  },

  visitAcademy(player) {
    player.setFlag('academyVisited');
    player.location = 'Санкт-Петербург';
    return 'Ломоносов говорит с тобой о науке и вере. «Машина не зла. Она просто не знает боли. Научи её боли — и она станет ангелом».';
  },

  // ============ АКТ IV: БОЛЬШАЯ ИГРА ============

  goEurope(player) {
    player.setFlag('europeRoute');
    player.clearance = 'AMBASSADOR';
    player.location = 'Европа';
    player.addItem('европейский дипломатический паспорт');
    return 'Ты едешь в Европу. Встреча с Фридрихом Великим и Марией-Терезией. Интриги старого света.';
  },

  goChina(player) {
    player.setFlag('chinaRoute');
    player.clearance = 'AMBASSADOR';
    player.location = 'Китай';
    player.addItem('нефритовая печать');
    return 'Ты едешь в Китай. Беседа с министром Ли и поклон албазинцам. Ты понимаешь: Восток знает больше.';
  },

  goAmerica(player) {
    player.setFlag('americaRoute');
    player.clearance = 'AMBASSADOR';
    player.location = 'США';
    player.addItem('американский торговый контракт');
    return 'Ты плывёшь в Америку. Встреча с Франклином и закупка кораблей. Новый мир открывает двери.';
  }
};

module.exports = actions;
