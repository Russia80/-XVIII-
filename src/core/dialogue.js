javascript
/**
 * Meridian: Диалоговая система
 * Управление узлами диалога и действиями
 */

const { NODES } = require('../data/nodes');
const { QUESTS } = require('../data/quests');
const logger = require('../utils/logger');

class Choice {
  constructor(config) {
    this.text = config.text;
    this.action = config.action || null;
    this.dynastyCost = config.dynastyCost || 0;
    this.honorCost = config.honorCost || 0;
    this.interestCost = config.interestCost || 0;
    this.conscienceGain = config.conscienceGain || 0;
    this.faithGain = config.faithGain || 0;
    this.requiresDynasty = config.requiresDynasty || 0;
    this.requiresHonor = config.requiresHonor || 0;
    this.requiresInterest = config.requiresInterest || 0;
    this.requiresConscience = config.requiresConscience || 0;
    this.requiresItem = config.requiresItem || null;
    this.requiresFlag = config.requiresFlag || null;
    this.unlockedByFlag = config.unlockedByFlag || '';
    this.hidden = config.hidden || false;
    this.result = config.result || '';
    this.nextNode = config.nextNode || null;
    this.questId = config.questId || null;
  }
}

class DialogueNode {
  constructor(config) {
    this.id = config.id;
    this.narrator = config.narrator;
    this.text = config.text;
    this.choices = config.choices || [];
    this.location = config.location || '';
    this.atmos = config.atmos || '';
    this.nextNode = config.nextNode || null;
    this.ritualRequired = config.ritualRequired || null;
    this.onEnter = config.onEnter || null;
    this.onExit = config.onExit || null;
  }

  addChoice(choice) {
    this.choices.push(choice);
    return this;
  }
}

class DialogueManager {
  constructor() {
    this.nodes = new Map();
    this.actions = new Map();
    this.currentNode = null;
    this.history = [];
    this.loadNodes();
  }

  loadNodes() {
    // Загружаем базовые узлы
    for (const [id, nodeData] of NODES) {
      this.nodes.set(id, nodeData);
    }
    
    // Загружаем квестовые узлы
    for (const [id, questData] of QUESTS) {
      if (!this.nodes.has(id)) {
        this.nodes.set(id, questData);
      }
    }
    
    logger.info(`Загружено ${this.nodes.size} узлов диалога`);
    this.registerActions();
  }

  registerActions() {
    // Регистрация всех действий
    const actions = require('../data/actions');
    for (const [name, fn] of Object.entries(actions)) {
      this.actions.set(name, fn);
    }
  }

  getNode(id) {
    const node = this.nodes.get(id);
    if (!node) {
      logger.warn(`Узел не найден: ${id}`);
      return null;
    }
    this.currentNode = node;
    return node;
  }

  getAction(name) {
    return this.actions.get(name) || null;
  }

  processChoice(choiceIndex, player) {
    if (!this.currentNode) {
      throw new Error('Нет активного диалога');
    }

    const choice = this.currentNode.choices[choiceIndex];
    if (!choice) {
      throw new Error('Выбор не найден');
    }

    // Проверка требований
    if (choice.requiresItem && !player.hasItem(choice.requiresItem)) {
      return { error: `Требуется предмет: ${choice.requiresItem}` };
    }

    if (choice.requiresFlag && !player.hasFlag(choice.requiresFlag)) {
      return { error: `Требуется флаг: ${choice.requiresFlag}` };
    }

    // Выполнение действия
    let result = '';
    if (choice.action) {
      const actionFn = this.getAction(choice.action);
      if (actionFn) {
        result = actionFn(player);
      }
    }

    // Добавление квеста
    if (choice.questId) {
      player.addQuest(choice.questId);
    }

    // Переход к следующему узлу
    if (choice.nextNode) {
      this.currentNode = this.getNode(choice.nextNode);
    }

    return {
      success: true,
      result,
      node: this.currentNode,
      next: choice.nextNode
    };
  }

  addNode(node) {
    this.nodes.set(node.id, node);
    return this;
  }

  getCurrentChoices(player) {
    if (!this.currentNode) return [];
    return this.currentNode.choices.filter(choice => {
      // Проверка видимости
      if (choice.hidden) return false;
      if (choice.unlockedByFlag && !player.hasFlag(choice.unlockedByFlag)) return false;
      
      // Проверка требований
      if (choice.requiresDynasty && player.dynasty < choice.requiresDynasty) return false;
      if (choice.requiresHonor && player.honor < choice.requiresHonor) return false;
      if (choice.requiresInterest && player.interest < choice.requiresInterest) return false;
      if (choice.requiresConscience && player.conscience < choice.requiresConscience) return false;
      if (choice.requiresItem && !player.hasItem(choice.requiresItem)) return false;
      if (choice.requiresFlag && !player.hasFlag(choice.requiresFlag)) return false;
      
      return true;
    });
  }

  reset() {
    this.currentNode = this.getNode('prologue');
    this.history = [];
    return this;
  }

  toJSON() {
    return {
      currentNodeId: this.currentNode?.id || null,
      history: this.history
    };
  }

  fromJSON(data) {
    if (data.currentNodeId) {
      this.currentNode = this.getNode(data.currentNodeId);
    }
    this.history = data.history || [];
    return this;
  }
}

module.exports = { DialogueManager, DialogueNode, Choice };
