avascript
#!/usr/bin/env node

/**
 * Meridian: Шёпот Железных Нервов
 * Версия: 1.0.0
 * Точка входа в игру
 */

const chalk = require('chalk');
const { program } = require('commander');
const { MeridianEngine } = require('./core/engine');
const { CLInterface } = require('./cli/interface');
const logger = require('./utils/logger');

// Версия
const VERSION = '1.0.0';

// Настройка CLI
program
  .version(VERSION)
  .name('meridian')
  .description('Исторический симулятор личности в эпоху Просвещения')
  .option('-w, --web', 'Запустить в веб-режиме')
  .option('-s, --save <file>', 'Загрузить сохранение из файла')
  .option('-d, --debug', 'Включить отладку')
  .option('-c, --color', 'Принудительно включить цвета')
  .parse(process.argv);

const options = program.opts();

// Настройка логов
if (options.debug) {
  logger.level = 'debug';
}

// Главная функция
async function main() {
  console.clear();
  
  console.log(chalk.hex('#FFD700')('═'.repeat(70)));
  console.log(chalk.hex('#FFD700')(' ' + ' '.repeat(12) + 'МЕРИДИАН: ШЁПОТ ЖЕЛЕЗНЫХ НЕРВОВ'));
  console.log(chalk.hex('#C0C0C0')(' ' + ' '.repeat(10) + `v${VERSION}  |  Исторический симулятор личности`));
  console.log(chalk.hex('#FFD700')('═'.repeat(70)));

  try {
    const engine = new MeridianEngine();
    
    // Загрузка сохранения
    if (options.save) {
      try {
        engine.loadGame(options.save);
        console.log(chalk.green('✓ Загружено сохранение: ' + options.save));
      } catch (err) {
        console.log(chalk.yellow('⚠️ Не удалось загрузить сохранение: ' + err.message));
        console.log(chalk.dim('   Начинаем новую игру...'));
      }
    }

    // Веб-режим
    if (options.web) {
      const { WebServer } = require('./server');
      const server = new WebServer(engine);
      server.start();
      return;
    }

    // CLI-режим
    const cli = new CLInterface(engine);
    await cli.start();

  } catch (error) {
    logger.error('Критическая ошибка:', error);
    console.log(chalk.red('❌ Критическая ошибка: ' + error.message));
    console.log(chalk.dim('   Проверьте логи для деталей.'));
    process.exit(1);
  }
}

// Обработка прерывания
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Выход...'));
  process.exit(0);
});

// Запуск
main();
