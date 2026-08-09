javascript
/**
 * Meridian: Класс персонажа
 * Управляет всеми характеристиками героя
 */

const { v4: uuidv4 } = require('uuid');

class Character {
  constructor(name = 'Наследник') {
    this.id = uuidv4();
    this.name = name;
    
    // Три столпа
    this.dynasty = 50;      // Род
    this.honor = 50;        // Честь
    this.interest = 30;     // Интерес
    
    // Скрытые параметры
    this.conscience = 0;    // Совесть (0-100)
    this.faith = 40;        // Вера
    this.health = 100;      // Здоровье
    
    // Инвентарь и квесты
    this.inventory = [];
    this.activeQuests = [];
    this.completedQuests = [];
    this.flags = {};
    
    // Прогресс
    this.location = 'Заозерье';
    this.clearance = 'UNREGISTERED';
    this.achievements = [];
    this.stats = {
      kills: 0,
      duels: 0,
      trades: 0,
      rituals: 0,
      dialogues: 0,
      travels: 0,
      choices: 0
    };
    
    // Временные эффекты
    this.buffs = [];
    this.debuffs = [];
  }

  getStats() {
    return {
      dynasty: this.dynasty,
      honor: this.honor,
      interest: this.interest,
      conscience: this.conscience,
      health: this.health,
      faith: this.faith
    };
  }

  applyCost(cost) {
    this.dynasty += cost.dynastyCost || 0;
    this.honor += cost.honorCost || 0;
    this.interest += cost.interestCost || 0;
    this.conscience += cost.conscienceGain || 0;
    this.health += cost.healthCost || 0;
    this.faith += cost.faithGain || 0;
    this.stats.choices++;

    // Clamp values (0-100)
    this.dynasty = Math.max(0, Math.min(100, this.dynasty));
    this.honor = Math.max(0, Math.min(100, this.honor));
    this.interest = Math.max(0, Math.min(100, this.interest));
    this.conscience = Math.max(0, Math.min(100, this.conscience));
    this.health = Math.max(0, Math.min(100, this.health));
    this.faith = Math.max(0, Math.min(100, this.faith));

    // Проверка на смерть
    if (this.health <= 0) {
      this.health = 0;
      return { death: true };
    }
    
    return { death: false };
  }

  addItem(item) {
    if (!this.inventory.includes(item)) {
      this.inventory.push(item);
      return true;
    }
    return false;
  }

  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  hasItem(item) {
    return this.inventory.includes(item);
  }

  hasFlag(flag) {
    return !!this.flags[flag];
  }

  setFlag(flag) {
    this.flags[flag] = true;
    return this;
  }

  addQuest(questId) {
    if (!this.activeQuests.includes(questId)) {
      this.activeQuests.push(questId);
      return true;
    }
    return false;
  }

  completeQuest(questId) {
    const index = this.activeQuests.indexOf(questId);
    if (index > -1) {
      this.activeQuests.splice(index, 1);
      this.completedQuests.push(questId);
      return true;
    }
    return false;
  }

  addBuff(buff) {
    this.buffs.push(buff);
    return this;
  }

  addDebuff(debuff) {
    this.debuffs.push(debuff);
    return this;
  }

  clearBuffs() {
    this.buffs = [];
    this.debuffs = [];
    return this;
  }

  getDescription() {
    const stats = this.getStats();
    return `📜 ${this.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Род: ${this.dynasty}%
⚔️ Честь: ${this.honor}%
💰 Интерес: ${this.interest}%
❤️ Совесть: ${this.conscience}%
⛪ Вера: ${this.faith}%
❤️‍🩹 Здоровье: ${this.health}%
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${this.location}
🔑 ${this.clearance}
📦 ${this.inventory.length > 0 ? this.inventory.join(', ') : 'пуст'}`;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      dynasty: this.dynasty,
      honor: this.honor,
      interest: this.interest,
      conscience: this.conscience,
      health: this.health,
      faith: this.faith,
      inventory: this.inventory,
      activeQuests: this.activeQuests,
      completedQuests: this.completedQuests,
      flags: this.flags,
      location: this.location,
      clearance: this.clearance,
      achievements: this.achievements,
      stats: this.stats,
      buffs: this.buffs,
      debuffs: this.debuffs
    };
  }

  fromJSON(data) {
    Object.assign(this, data);
    return this;
  }
}

module.exports = { Character };
