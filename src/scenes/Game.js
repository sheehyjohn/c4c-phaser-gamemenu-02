import Phaser from 'phaser';
import gameState from '../model/gameState';
import levels from '../data/levels'; 
import Hero from '../entities/Hero';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.levelIndex = data.levelIndex;
    this.levelData = levels[this.levelIndex];
    console.log('--game.js');
    //console.log(this.levelIndex);
    //console.log(this.levelData);
  }

  preload() {

    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');
    this.load.tilemapTiledJSON('level-2', 'assets/tilemaps/level-2.json');
    this.load.tilemapTiledJSON('level-3', 'assets/tilemaps/level-3.json');
    this.load.tilemapTiledJSON('level-4', 'assets/tilemaps/level-4.json');
    //this.load.tilemapTiledJSON('level-1a', 'assets/tilemaps/level-1a.json');

    this.load.image('world-1-sheet', 'assets/tilesets/world-1.png');

    this.load.audio('jump1', ['assets/sound/jump1.wav']);
    this.load.audio('jump2', ['assets/sound/jump2.wav']);

    this.load.spritesheet('hero-idle-sheet', 'assets/hero/idle.png', {
        frameWidth: 32,
        frameHeight: 64,
      });      
  
    //this.load.image('logo', 'assests/phase3-logo.png');
    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
        frameWidth: 32,
        frameHeight: 64,      
    //endframe/startFrame are options here
    });

    this.load.spritesheet('hero-pivot-sheet', 'assets/hero/pivot.png', {
        frameWidth: 32,
        frameHeight: 64,
    });
  
    this.load.spritesheet('hero-jump-sheet', 'assets/hero/jump.png', {
        frameWidth: 32,
        frameHeight: 64,
    });
  
    this.load.spritesheet('hero-flip-sheet', 'assets/hero/spinjump.png', {
        frameWidth: 32,
        frameHeight: 64,
    });
  
    this.load.spritesheet('hero-fall-sheet', 'assets/hero/fall.png', {
        frameWidth: 32,
        frameHeight: 64,
    }); 
}

  create(data) {
    this.add.text(10, 10, this.levelData.name, { font: '48px Arial', fill: '#000000' });

   // const hero = this.add.sprite(26 + this.levelIndex * 70, 80, 'hero-run-sheet', 1);
   // hero.anims.play('hero-running');

    const loseButton = this.add.text(80, 400, 'Menu', { font: '30px Arial', fill: '#000000' });
    loseButton.setInteractive();
    loseButton.on('pointerup', this.failLevel, this);
    const winButton = this.add.text(900, 400, 'Win', { font: '30px Arial', fill: '#000000' });
    winButton.setInteractive();
    winButton.on('pointerup', this.completeLevel, this);

    // Game Code
    this.jump1 = this.sound.add('jump1', { loop: false });
    this.jump2 = this.sound.add('jump2', { loop: false }); 
    
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'hero-idle',
        frames: this.anims.generateFrameNumbers('hero-idle-sheet'),
    }); 

    this.anims.create({
        key: 'hero-running',
        frames: this.anims.generateFrameNumbers('hero-run-sheet'),
        frameRate: 30,      // 10 times per second - Demo 100 & 1
        repeat: -1,
    });

    this.anims.create({
        key: 'hero-pivoting',
        frames: this.anims.generateFrameNumbers('hero-pivot-sheet'),
    });
  
    this.anims.create({
        key: 'hero-jumping',
        frames: this.anims.generateFrameNumbers('hero-jump-sheet'),
        frameRate: 10,
        repeat: -1,
    });
  
    this.anims.create({
        key: 'hero-flipping',
        frames: this.anims.generateFrameNumbers('hero-flip-sheet'),
        frameRate: 30,
        repeat: 0,
    });
  
    this.anims.create({
        key: 'hero-falling',
        frames: this.anims.generateFrameNumbers('hero-fall-sheet'),
        frameRate: 10,
        repeat: -1,
    });

    this.addMap(); 
    this.addHero();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);   


  }

  addHero() {
    this.hero = new Hero(this, 250, 160); 
    this.physics.add.collider(this.hero, this.map.getLayer('Ground').tilemapLayer);
  }

  addMap() {
    console.log(this.levelIndex);
    console.log(this.levelData);
    console.log('level = ' + this.levelData.map);
    //this.map = this.make.tilemap({ key: 'level-1' });
    this.map = this.make.tilemap({ key: this.levelData.map });

    
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');

    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([1, 2, 4], true);

    this.map.createStaticLayer('Ground', groundTiles);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);
  }

  failLevel() {
    this.scene.start('MenuScene');
  }
  
  completeLevel() {
    gameState.completeLevel(this.levelIndex);
    this.scene.start('MenuScene');
  }

  update(time, delta) {}
}

export default Game;