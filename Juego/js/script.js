/* La variable `config` es un objeto que contiene los ajustes de configuración para un juego de Phaser.
Especifica el tipo de renderizador a usar (`Phaser.AUTO`), el ancho y alto del lienzo del juego, el
motor de física a usar (Arcade) y las funciones que se llamarán para las fases de precarga, creación
y actualización de el juego. */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var score = 0;
var scoreText;
var gameOver= false;
var saltoa;
var camina;
var Agmoneda;
var damage;
var background;
var GaO;
var spawn = false;
var sc;

/* Crea una nueva instancia del juego Phaser utilizando el objeto de configuración `config`. */
var game = new Phaser.Game(config);

/**
 * La función precarga varias imágenes y archivos de audio para el juego.
 */
function preload(){
    this.load.image('sky', 'Imagenes/fondo1.png');
    this.load.image('ground', 'Imagenes/platform.png');
    this.load.image('star', 'Imagenes/taco.png');
    this.load.image('bomb', 'Imagenes/Enemigo-Marijuana.png');
    this.load.spritesheet('dude', 'Imagenes/Terminaaaaoo.png', {frameWidth: 32,frameHeight: 32});
    this.load.spritesheet('enemy', 'Imagenes/dude.png', {frameWidth: 32,frameHeight: 48});

    this.load.audio('salto', 'Sonidos/Salto.mp3');
    this.load.audio('caminar', 'Sonidos/caminar.mp3');
    this.load.audio('agarrarmoneda', 'Sonidos/pickupCoin (1).wav');
    this.load.audio('golpe', 'Sonidos/sound (1).wav');
    this.load.audio('fondo', 'Sonidos/8-bit-universe.mp3');
    this.load.audio('GaOv', 'Sonidos/GameOver1.mp3');
}

/**
 * Esta función crea una escena de juego con plataformas, un personaje de jugador, tacos para
 * recolectar, bombas en forma de 'maria' para evitar y efectos de sonido.
 */
function create(){
    //this.add.image(x, y, nombre);
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setCollideWorldBounds(true);
    player.setBounce(0.2);
    player.setScale(1.5);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 16}),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dude', { start: 10, end: 11}),
        frameRate: 10,
        repeat: 2
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 1, end: 5}),
        frameRate: 10,
        repeat: -1
    });

    // player.body.setGravityY(300);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY:{x: 12, y:0, stepX: 70}
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, true);

    scoreText = this.add.text(16, 16, 'Tacos: 0', {fontSize: '32px', fill: '#ffffff'});

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    saltoa = this.sound.add('salto');
    camina = this.sound.add('caminar');
    Agmoneda = this.sound.add('agarrarmoneda');
    damage = this.sound.add('golpe');
    background = this.sound.add('fondo');
    background.play();
    GaO = this.sound.add('GaOv');
}

/**
 * Esta función actualiza el movimiento del jugador en función de la entrada del teclado y reproduce
 * animaciones en consecuencia.
 * El comando return sirve si el juego termina, la función regresa y no ejecuta ningún código adicional.
 */
function update(){

    if(gameOver){
        return
    }
    
    if(cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }else if(cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
        saltoa.play();
    }
}

/**
 * La función recolecta estrellas, aumenta la puntuación, reinicia un contador y crea bombas cuando se
 * recolectan todas las estrellas.
 * @param player - El objeto jugador que recoge la estrella.
 * @param star - El parámetro estrella es un objeto que representa el sprite estrella con el que el
 * jugador ha chocado y recogido.
 */
function collectStar(player, star){
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Tacos: '+score);
    sc += 10;

    if(sc>=130){
        sc=0;
    }

    if(stars.countActive(true)===0){
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
    Agmoneda.play();
}

/**
 * La función causa daño al jugador, detiene la física, cambia el tinte del jugador, reproduce un juego
 * sobre la animación, detiene la música de fondo y reproduce un juego sobre el efecto de sonido.
 * @param player - El objeto del jugador que chocó con la bomba.
 * @param bomb - El parámetro "bomba" es un objeto que representa la bomba con la que el jugador ha
 * chocado en el juego. Es probable que se use para activar la función "hitBomb" cuando el jugador
 * choca con una bomba, lo que hace que el juego se detenga, el jugador se ponga rojo y el "gameOver".
 */
function hitBomb(player, bomb){
    damage.play();

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

    background.stop();
    GaO.play();
}