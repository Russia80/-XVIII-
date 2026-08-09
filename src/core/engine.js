javascript
/**
 * Meridian: Игровой движок
 * Ядро игры, управляет состоянием и логикой
 */

const { EventEmitter } = require('events');
const { Character } = require('./character');
const { DialogueManager } = require('./dialogue');
const { FactionManager } = require('./factions');
const { CombatSystem } = require('../mechanics/combat');
const { WeatherSystem } = require('../mechanics/weather');
const { AchievementSystem } = require('../mechanics/achievements');
const logger = require('../utils/logger');

class MeridianEngine extends EventEmitter {
  constructor() {
    super();
    this.player = new Character();
    this.factions = new FactionManager();
    this.dialogue = new DialogueManager();
    this.combat = new CombatSystem();
    this.weather = new WeatherSystem();
    this.achievements = new AchievementSystem();
    this.currentNode = null;
    this.state = 'MENU';
    this.turnCounter = 0;
    this.history = [];
    this.version = '1.0.0';
    this.initialized = false;
    
    this.init();
  }

  init() {
    try {
      this.dialogue.loadNodes();
      this.currentNode = this.dialogue.getNode('prologue');
      this.initialized = true;
      logger.info('Игровой движок Меридиан инициализирован');
      this.emit('ready');
    } catch (error) {
      logger.error('Ошибка инициализации:', error);
      throw error;
    }
  }

  getState() {
    return {
      player: this.player.getStats(),
      location: this.player.location,
      currentNode: this.currentNode?.id || null,
      state: this.state,
      turnCounter: this.turnCounter,
      weather: this.weather.current,
      factions: this.factions.getAll(),
      inventory: this.player.inventory,
      flags: this.player.flags,
      achievements: this.achievements.getUnlocked(),
      clearance: this.player.clearance
    };
  }

  processAction(action) {
    try {
      if (!this.currentNode) {
        throw new Error('Нет активного узла диалога');
      }

      const choice = this.currentNode.choices[action];
      if (!choice) {
        throw new Error('Неверный выбор');
      }

      // Проверка требований
      if (!this.checkRequirements(choice)) {
        return { 
          error: 'Недостаточно ресурсов', 
          required: {
            dynasty: choice.requiresDynasty,
            honor: choice.requiresHonor,
            interest: choice.requiresInterest,
            conscience: choice.requiresConscience
          }
        };
      }

      // Применение стоимости
      this.player.applyCost(choice);
      
      // Выполнение действия
      let result = '';
      if (choice.action) {
        const actionFn = this.dialogue.getAction(choice.action);
        if (actionFn) {
          result = actionFn(this.player);
        }
      }

      // Обновление состояния
      this.turnCounter++;
      this.history.push({ 
        action, 
        result, 
        turn: this.turnCounter,
        timestamp: new Date().toISOString()
      });

      // Проверка достижений
      this.achievements.check(this.player, this.turnCounter);

      // Обновление узла
      if (this.currentNode && this.currentNode.nextNode) {
        this.currentNode = this.dialogue.getNode(this.currentNode.nextNode);
      }

      this.emit('action', { result, state: this.getState() });

      return {
        success: true,
        result,
        state: this.getState(),
        achievements: this.achievements.getJustUnlocked()
      };
    } catch (error) {
      logger.error('Ошибка обработки действия:', error);
      return { error: error.message };
    }
  }

  checkRequirements(choice) {
    if (choice.requiresDynasty && this.player.dynasty < choice.requiresDynasty) return false;
    if (choice.requiresHonor && this.player.honor < choice.requiresHonor) return false;
    if (choice.requiresInterest && this.player.interest < choice.requiresInterest) return false;
    if (choice.requiresConscience && this.player.conscience < choice.requiresConscience) return false;
    if (choice.unlockedByFlag && !this.player.hasFlag(choice.unlockedByFlag)) return false;
    return true;
  }

  saveGame(filename = 'savegame.json') {
    const fs = require('fs-extra');
    const data = {
      player: this.player,
      factions: this.factions,
      currentNodeId: this.currentNode?.id || null,
      turnCounter: this.turnCounter,
      history: this.history.slice(-100),
      weather: this.weather,
      version: this.version,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    logger.info('Игра сохранена:', filename);
    return true;
  }

  loadGame(filename = 'savegame.json') {
    const fs = require('fs-extra');
    if (!fs.existsSync(filename)) {
      throw new Error('Файл сохранения не найден');
    }
    const data = fs.readJsonSync(filename);
    
    Object.assign(this.player, data.player);
    this.factions = data.factions;
    this.turnCounter = data.turnCounter;
    this.history = data.history || [];
    this.weather = data.weather;
    
    if (data.currentNodeId) {
      this.currentNode = this.dialogue.getNode(data.currentNodeId);
    }
    
    logger.info('Игра загружена:', filename);
    return true;
  }

  reset() {
    this.player = new Character();
    this.turnCounter = 0;
    this.history = [];
    this.achievements = new AchievementSystem();
    this.currentNode = this.dialogue.getNode('prologue');
    this.state = 'MENU';
    logger.info('Игра сброшена');
    return true;
  }
}

module.exports = { MeridianEngine };
