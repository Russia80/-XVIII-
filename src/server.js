javascript
/**
 * Meridian: Web Server
 * Веб-интерфейс с Socket.IO
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const chalk = require('chalk');
const { MeridianEngine } = require('./core/engine');

class WebServer {
  constructor(engine) {
    this.engine = engine || new MeridianEngine();
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server);
    this.port = process.env.PORT || 3000;
    this.clients = new Map();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSockets();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(express.static(path.join(__dirname, '../public/css')));
    this.app.use(express.static(path.join(__dirname, '../public/js')));
  }

  setupRoutes() {
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    this.app.get('/api/state', (req, res) => {
      res.json(this.engine.getState());
    });

    this.app.get('/api/inventory', (req, res) => {
      res.json({ inventory: this.engine.player.inventory });
    });

    this.app.get('/api/history', (req, res) => {
      res.json({ history: this.engine.history.slice(-50) });
    });

    this.app.post('/api/action', (req, res) => {
      const { action } = req.body;
      const result = this.engine.processAction(action);
      res.json(result);
    });

    this.app.post('/api/save', (req, res) => {
      try {
        this.engine.saveGame();
        res.json({ success: true, message: 'Игра сохранена' });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  }

  setupSockets() {
    this.io.on('connection', (socket) => {
      console.log(chalk.green('🔗 Клиент подключен:'), socket.id);
      
      // Отправка начального состояния
      socket.emit('init', this.engine.getState());
      
      // Обработка действий
      socket.on('action', (data) => {
        try {
          const result = this.engine.processAction(data);
          socket.emit('update', result);
          
          // Рассылка всем клиентам (для мультиплеера)
          this.io.emit('game_update', {
            player: this.engine.player.getStats(),
            location: this.engine.player.location,
            turn: this.engine.turnCounter
          });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
      
      // Сохранение
      socket.on('save', () => {
        try {
          this.engine.saveGame();
          socket.emit('saved', { success: true });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
      
      // Загрузка
      socket.on('load', () => {
        try {
          this.engine.loadGame();
          socket.emit('loaded', this.engine.getState());
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
      
      // Отключение
      socket.on('disconnect', () => {
        console.log(chalk.yellow('🔗 Клиент отключен:'), socket.id);
      });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(chalk.green('🌐 Сервер запущен:'), `http://localhost:${this.port}`);
      console.log(chalk.dim('   Нажмите Ctrl+C для остановки'));
    });
    
    return this.server;
  }

  stop() {
    this.server.close();
  }
}

module.exports = { WebServer };
