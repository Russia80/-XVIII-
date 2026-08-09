javascript
/**
 * Meridian: Web Client
 * Клиентская часть веб-интерфейса
 */

class MeridianClient {
  constructor() {
    this.socket = io();
    this.state = null;
    this.isProcessing = false;
    this.elements = {
      text: document.getElementById('text'),
      narrator: document.getElementById('narrator'),
      atmosphere: document.getElementById('atmosphere'),
      choices: document.getElementById('choices'),
      input: document.getElementById('command-input'),
      sendBtn: document.getElementById('send-btn')
    };
    
    this.initEvents();
  }

  initEvents() {
    // Socket events
    this.socket.on('connect', () => {
      console.log('🔗 Подключено к серверу');
    });

    this.socket.on('init', (state) => {
      this.state = state;
      this.renderState(state);
    });

    this.socket.on('update', (data) => {
      this.isProcessing = false;
      if (data.success) {
        this.state = data.state;
        this.renderState(data.state);
        if (data.result) {
          this.addText(`\n📌 ${data.result}`);
        }
        if (data.achievements && data.achievements.length > 0) {
          data.achievements.forEach(a => {
            this.addText(`\n🏆 ДОСТИЖЕНИЕ: ${a}`);
          });
        }
      } else if (data.error) {
        this.showError(data.error);
      }
    });

    this.socket.on('error', (data) => {
      this.isProcessing = false;
      this.showError(data.message);
    });

    this.socket.on('saved', () => {
      this.addText('\n💾 Игра сохранена!');
    });

    this.socket.on('loaded', (state) => {
      this.state = state;
      this.renderState(state);
      this.addText('\n📂 Игра загружена!');
    });

    // UI events
    this.elements.sendBtn.addEventListener('click', () => this.sendCommand());
    this.elements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.sendCommand();
      }
    });

    // Фокус на ввод
    document.addEventListener('click', () => {
      this.elements.input.focus();
    });
  }

  renderState(state) {
    if (!state) return;

    // Обновление статус-бара
    this.updateStats(state.player);
    this.updateLocation(state.location);

    // Обновление диалога
    if (state.currentNode) {
      this.renderNode(state.currentNode);
    }

    // Обновление выборов
    this.renderChoices(state.currentNode);
  }

  renderNode(node) {
    if (!node) return;
    
    this.elements.atmosphere.textContent = node.atmos || '🌫️';
    this.elements.narrator.textContent = node.narrator || 'Система';
    
    // Эффект печатающей машинки
    this.typeText(node.text);
  }

  renderChoices(node) {
    const container = this.elements.choices;
    container.innerHTML = '';
    
    if (!node || !node.choices || node.choices.length === 0) {
      return;
    }

    node.choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = `${index + 1}. ${choice.text}`;
      
      // Проверка доступности
      const available = this.isChoiceAvailable(choice);
      btn.disabled = !available;
      
      if (!available) {
        btn.textContent += ' ⛔ (недоступно)';
        btn.style.opacity = '0.4';
      } else {
        // Показ статуса
        const status = document.createElement('span');
        status.className = 'status';
        if (choice.conscienceGain > 0) {
          status.textContent = '✅';
          status.className += ' positive';
        } else if (choice.conscienceGain < 0) {
          status.textContent = '⚠️';
          status.className += ' negative';
        } else {
          status.textContent = '➖';
          status.className += ' neutral';
        }
        btn.appendChild(status);
        
        // Обработчик клика
        btn.addEventListener('click', () => {
          if (!this.isProcessing) {
            this.sendAction(index);
          }
        });
      }
      
      container.appendChild(btn);
    });
  }

  updateStats(player) {
    const stats = {
      dynasty: document.getElementById('stat-dynasty'),
      honor: document.getElementById('stat-honor'),
      interest: document.getElementById('stat-interest'),
      conscience: document.getElementById('stat-conscience')
    };
    
    if (player) {
      stats.dynasty.textContent = `Род: ${player.dynasty}%`;
      stats.honor.textContent = `Честь: ${player.honor}%`;
      stats.interest.textContent = `Интерес: ${player.interest}%`;
      stats.conscience.textContent = `Совесть: ${player.conscience}%`;
    }
  }

  updateLocation(location) {
    const el = document.getElementById('stat-location');
    if (location) {
      el.textContent = `📍 ${location}`;
    }
  }

  typeText(text) {
    const el = this.elements.text;
    el.innerHTML = '';
    
    let i = 0;
    const chars = text.split('');
    let isHtml = false;
    let buffer = '';
    
    const interval = setInterval(() => {
      if (i >= chars.length) {
        clearInterval(interval);
        return;
      }
      
      const char = chars[i];
      
      // Поддержка HTML-тегов
      if (char === '<') isHtml = true;
      if (isHtml) {
        buffer += char;
        if (char === '>') {
          el.innerHTML += buffer;
          buffer = '';
          isHtml = false;
        }
      } else {
        el.textContent += char;
      }
      
      i++;
      this.elements.input.scrollIntoView({ behavior: 'smooth' });
    }, 25);
  }

  addText(text) {
    const el = this.elements.text;
    el.textContent += text;
  }

  showError(error) {
    const el = this.elements.text;
    el.textContent += `\n❌ ${error}`;
    setTimeout(() => {
      // Очищаем сообщение об ошибке через 3 секунды
    }, 3000);
  }

  isChoiceAvailable(choice) {
    // Проверка требований
    if (choice.requiresDynasty && this.state.player.dynasty < choice.requiresDynasty) return false;
    if (choice.requiresHonor && this.state.player.honor < choice.requiresHonor) return false;
    if (choice.requiresInterest && this.state.player.interest < choice.requiresInterest) return false;
    if (choice.requiresConscience && this.state.player.conscience < choice.requiresConscience) return false;
    if (choice.unlockedByFlag && !this.state.flags[choice.unlockedByFlag]) return false;
    return true;
  }

  sendAction(index) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.socket.emit('action', index);
    this.elements.input.value = '';
  }

  sendCommand() {
    const input = this.elements.input.value.trim();
    if (!input) return;
    
    this.elements.input.value = '';
    
    // Обработка команд
    const cmd = input.toLowerCase();
    
    if (cmd === 'q' || cmd === 'quit' || cmd === 'exit') {
      if (confirm('Выйти из игры?')) {
        window.close();
      }
      return;
    }
    
    if (cmd === 'i' || cmd === 'inventory') {
      this.showInventory();
      return;
    }
    
    if (cmd === 's' || cmd === 'stats') {
      this.showStats();
      return;
    }
    
    if (cmd === 'save') {
      this.socket.emit('save');
      return;
    }
    
    if (cmd === 'load') {
      this.socket.emit('load');
      return;
    }
    
    // Попытка выбрать вариант
    const choiceIndex = parseInt(input) - 1;
    if (!isNaN(choiceIndex) && choiceIndex >= 0) {
      this.sendAction(choiceIndex);
    } else {
      this.addText(`\n❌ Неизвестная команда: ${input}`);
      this.addText('\n📖 Доступные команды: i, s, save, load, q');
    }
  }

  showInventory() {
    const items = this.state.inventory || [];
    if (items.length === 0) {
      this.addText('\n📦 Инвентарь: пуст');
    } else {
      this.addText(`\n📦 Инвентарь: ${items.join(', ')}`);
    }
  }

  showStats() {
    const p = this.state.player;
    this.addText(`
\n📊 СТАТИСТИКА:
━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Род: ${p.dynasty}%
⚔️ Честь: ${p.honor}%
💰 Интерес: ${p.interest}%
❤️ Совесть: ${p.conscience}%
⛪ Вера: ${p.faith}%
❤️‍🩹 Здоровье: ${p.health}%
━━━━━━━━━━━━━━━━━━━━━━━━
📍 ${this.state.location}
🔑 ${this.state.clearance || 'UNREGISTERED'}`);
  }
}

// Запуск клиента
document.addEventListener('DOMContentLoaded', () => {
  const client = new MeridianClient();
  
  // Фокус на ввод
  document.getElementById('command-input').focus();
  
  // Обработка глобальных событий
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('command-input').blur();
    }
  });
});
