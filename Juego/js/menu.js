/* Este código define una nueva clase llamada `Escena1` que amplía la clase `Phaser.Scene`. Tiene un
método `initialize` que establece la clave de la escena en `'Escena1'`, y un método `create` que
agrega un objeto de texto a la escena y configura un detector de eventos de puntero hacia abajo que
inicia la `'Escena2'`. escena cuando se activa. */
var Escena1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Escena1(){
        Phaser.Scene.call(this, {key: 'Escena1'});
    },
    create(){
        texto = this.add.text(game.config.width / 2, game.config.height / 2, 'Iniciar.',{
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.input.on('pointerdown', (pointer)=>{
            this.scene.start('Escena2');
        });
    }
});

var Escena2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Escena1(){
        Phaser.Scene.call(this, {key: 'Escena2'});
    },
    create(){
        texto = this.add.text(game.config.width / 2, game.config.height / 2, 'Iniciar.',{
            fontSize: '40px',
            fill: '#ffffff'
        }).setOrigin(0.5);
    }
});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'Escenas',
    scene: [Escena1, Escena2]
};

var game = new Phaser.Game(config);