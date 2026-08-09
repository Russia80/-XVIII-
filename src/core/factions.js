javascript
class FactionManager {
  constructor() {
    this.factions = {
      church: { name: 'Церковь', trust: 50, influence: 0 },
      merchants: { name: 'Купцы', trust: 50, influence: 0 },
      nobility: { name: 'Дворянство', trust: 50, influence: 0 },
      people: { name: 'Простой народ', trust: 50, influence: 0 },
      protocol: { name: 'Протокол Meridian', trust: 50, influence: 0 }
    };
  }

  get(name) { return this.factions[name]; }
  getAll() { return this.factions; }
}

module.exports = { FactionManager };
