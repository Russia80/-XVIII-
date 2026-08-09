javascript
/**
 * Meridian: CLI Интерфейс
 * Консольный интерфейс для игры
 */

const chalk = require('chalk');
const readline = require('readline');
const { MeridianEngine } = require('../core/engine');
const logger = require('../utils/logger');

class CLInterface {
  constructor(engine) {
    this.engine = engine || new MeridianEngine();
    this.running = true;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
    this.history = [];
  }

  async start() {
    console.log(chalk.dim('\nНажмите Enter, чтобы начать...'));
    await this.waitForEnter();
    
    if (this.engine.currentNode) {
      await this.mainLoop();
    }
    
    this.rl.close();
  }

  async mainLoop() {
    while (this.running && this.engine.state !== 'EPILOGUE') {
      const node = this.engine.currentNode;
      if (!node) {
        console.log(chalk.red('❌ Ошибка: нет активного диалога'));
        break;
      }

      await this.showDialogue(node);
      const input = await this.getInput();
      
      if (!this.running) break;
      
      const handled = await this.handleCommand(input);
      if (handled) continue;
      
      const choiceIndex = parseInt(input) - 1;
      if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= node.choices.length) {
        console.log(chalk.red('❌ Введите номер выбора или команду.'));
        continue;
      }
      
      const result = this.engine.processAction(choiceIndex);
      if (result && result.error) {
        console.log(chalk.red(`❌ ${result.error}`));
        if (result.required) {
          console.log(chalk.dim(`   Требуется: Род ${result.required.dynasty || 0}+, Честь ${result.required.honor || 0}+, Интерес ${result.required.interest || 0}+`));
        }
        continue;
      }
      
      if (result && result.success) {
        if (result.result) {
          console.log(chalk.green(`\n📌 ${result.result}`));
        }
        
        if (result.achievements && result.achievements.length > 0) {
          for (const achievement of result.achievements) {
            console.log(chalk.yellow(`\n🏆 ДОСТИЖЕНИЕ: ${achievement}`));
          }
        }
        
        await this.sleep(1500);
      }
    }
    
    if (this.engine.state === 'EPILOGUE') {
      await this.showEpilogue();
    }
  }

  async showDialogue(node) {
    this.clearScreen();
    
    console.log(chalk.cyan(`\n🏛️ ${node.location}`));
    console.log(chalk.dim(`🌫️  ${node.atmos}`));
    console.log(chalk.dim('─'.repeat(50)));
    
    console.log(`\n${chalk.magenta('🧑‍🎤')} ${node.narrator}:`);
    console.log(chalk.dim('─'.repeat(50)));
    
    // Печать текста с эффектом печатной машинки
    const words = node.text.split(' ');
    for (const word of words) {
      process.stdout.write(word + ' ');
      await this.sleep(30);
    }
    console.log('\n');
    
    // Показ доступных выборов
    const availableChoices = [];
    node.choices.forEach((choice, index) => {
      const available = this.engine.checkRequirements(choice);
      if (available) {
        availableChoices.push(index);
        const status = choice.conscienceGain > 0 ? chalk.green('✅') : 
                      choice.conscienceGain < 0 ? chalk.yellow('⚠️') : chalk.gray('➖');
        console.log(`${chalk.green(`${index + 1}.`)} ${choice.text} ${status}`);
      } else {
        console.log(`${chalk.red(`${index + 1}.`)} ${chalk.dim('⛔ ' + choice.text + ' (недоступно)')}`);
      }
    });
    
    console.log('\n' + chalk.dim('─'.repeat(50)));
    console.log(chalk.dim('[i] - Инвентарь | [s] - Статистика | [r] - Ритуал | [save/load] | [q] - Выход'));
    console.log(chalk.dim('─'.repeat(50)));
  }

  async handleCommand(input) {
    const cmd = input.toLowerCase().trim();
    
    switch (cmd) {
      case 'q':
      case 'quit':
      case 'exit':
        this.running = false;
        console.log(chalk.yellow('\n👋 До встречи, Наследник Меридиана!'));
        return true;
        
      case 'i':
      case 'inventory':
        this.clearScreen();
        console.log(chalk.cyan('\n📦 ИНВЕНТАРЬ'));
        console.log(chalk.dim('─'.repeat(40)));
        if (this.engine.player.inventory.length === 0) {
          console.log(chalk.dim('   пуст'));
        } else {
          this.engine.player.inventory.forEach(item => {
            console.log(`  • ${item}`);
          });
        }
        console.log(chalk.dim('\nНажмите Enter, чтобы продолжить...'));
        await this.waitForEnter();
        return true;
        
      case 's':
      case 'stats':
        this.clearScreen();
        console.log(this.engine.player.getDescription());
        console.log(chalk.dim('\nНажмите Enter, чтобы продолжить...'));
        await this.waitForEnter();
        return true;
        
      case 'r':
      case 'ritual':
        const ritualResult = this.engine.dialogue.processRitual(this.engine.player);
        console.log(chalk.cyan(`\n🕯️ ${ritualResult}`));
        await this.sleep(1500);
        return true;
        
      case 'save':
        try {
          this.engine.saveGame();
          console.log(chalk.green('💾 Игра сохранена!'));
        } catch (err) {
          console.log(chalk.red(`❌ Ошибка сохранения: ${err.message}`));
        }
        await this.sleep(1000);
        return true;
        
      case 'load':
        try {
          this.engine.loadGame();
          console.log(chalk.green('📂 Игра загружена!'));
          await this.sleep(1000);
          return true;
        } catch (err) {
          console.log(chalk.red(`❌ Ошибка загрузки: ${err.message}`));
          await this.sleep(1000);
          return true;
        }
        
      case 'help':
      case '?':
        console.log(chalk.cyan('\n📖 КОМАНДЫ:'));
        console.log(chalk.dim('─────────────────────────────'));
        console.log('  1-9    - Выбор варианта');
        console.log('  i      - Инвентарь');
        console.log('  s      - Статистика');
        console.log('  r      - Ритуал');
        console.log('  save   - Сохранить игру');
        console.log('  load   - Загрузить игру');
        console.log('  q      - Выход');
        console.log(chalk.dim('─────────────────────────────\n'));
        await this.sleep(2000);
        return true;
        
      default:
        return false;
    }
  }

  async showEpilogue() {
    const node = this.engine.currentNode || this.engine.dialogue.getNode('epilogueGarden');
    
    this.clearScreen();
    
    console.log(chalk.hex('#FFD700')('═'.repeat(70)));
    console.log(chalk.hex('#FFD700')(' ' + ' '.repeat(20) + 'ЭПИЛОГ: ПРОТОКОЛ ВРЕМЕНИ'));
    console.log(chalk.hex('#FFD700')('═'.repeat(70)));
    console.log();
    
    console.log(chalk.hex('#C0C0C0')(node.text));
    
    console.log('\n' + chalk.dim('─'.repeat(70)));
    console.log(this.engine.player.getDescription());
    
    // Расчёт концовки
    const totalScore = this.engine.player.dynasty + this.engine.player.honor + 
                       this.engine.player.interest + this.engine.player.conscience;
    let ending = '';
    
    if (this.engine.player.conscience >= 80 && this.engine.player.dynasty >= 50) {
      ending = chalk.green('🌳 **Садовая концовка** — ты посадил живой сад, где каждый узел — это человек.');
    } else if (this.engine.player.interest >= 80) {
      ending = chalk.hex('#FFD700')('🏛️ **Имперская концовка** — ты построил величайшую машину управления в истории.');
    } else if (this.engine.player.honor >= 80) {
      ending = chalk.blue('⚔️ **Героическая концовка** — ты стал легендой, о которой слагают песни.');
    } else if (this.engine.player.conscience >= 80) {
      ending = chalk.magenta('🙏 **Святая концовка** — ты обрёл покой, поняв, что машина не может заменить душу.');
    } else {
      ending = chalk.dim('🌫️ **Туманная концовка** — ты прошёл свой путь, но так и не нашёл ответа.');
    }
    
    console.log('\n' + chalk.hex('#FFD700')('═'.repeat(70)));
    console.log(chalk.hex('#FFD700')(`         🏆   ИТОГОВЫЙ РЕЙТИНГ: ${totalScore}   🏆`));
    console.log(chalk.hex('#FFD700')('═'.repeat(70)));
    console.log('\n' + ' '.repeat(15) + ending);
    console.log('\n' + chalk.hex('#FFD700')('═'.repeat(70)));
    console.log(chalk.hex('#FFD700')(' ' + ' '.repeat(22) + 'Спасибо за игру, Наследник Меридиана.'));
    console.log(chalk.hex('#FFD700')(' ' + ' '.repeat(25) + 'Протокол завершён.'));
    console.log(chalk.hex('#FFD700')('═'.repeat(70)));
    
    this.engine.state = 'EPILOGUE';
  }

  clearScreen() {
    console.clear();
  }

  getInput() {
    return new Promise((resolve) => {
      this.rl.question(chalk.cyan('\n→ '), resolve);
    });
  }

  waitForEnter() {
    return new Promise((resolve) => {
      this.rl.once('line', resolve);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { CLInterface };
