import { claim_creature_on_coordinates, lookup_creature_on_coordinates } from "../utils/game_actions";

type Coords = {
	x: number,
	y: number,
}

export default class GameScene extends Phaser.Scene {
	showDebug = false;
	player = null;
	helpText = null;
	debugGraphics = null;
	cursors = null;
	map = null;
	graphics: Phaser.GameObjects.Graphics | null = null;
	square: Coords | null = null;
	prevPlayerPosition: { x: number, y: number } | null = null;
	spaceKey: Phaser.Input.Keyboard.Key | null = null;

	feedbackText: Phaser.GameObjects.Text | null = null;

	preload() {
		this.load.image('tiles', 'assets/catastrophi_tiles_32.png');
		this.load.tilemapCSV('map', 'assets/catastrophi_level2.csv');
		this.load.spritesheet('player', 'assets/spaceman.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('creatures', 'assets/creatures.png', { frameWidth: 32, frameHeight: 32 });
	}

	create() {
		// When loading a CSV map, make sure to specify the tileWidth and tileHeight
		this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
		const tileset = this.map.addTilesetImage('tiles');
		const layer = this.map.createLayer(0, tileset, 0, 0);
		this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 }, fillStyle: { color: 0xff0000 } });

		this.feedbackText = this.add.text(400, 300, '', {
			fontSize: '24px',
			fill: '#ffffff',
			align: 'left'
		}).setOrigin(0.9, -10).setVisible(false);

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 1, end: 2 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('player', { start: 11, end: 13 }),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
			frameRate: 10,
			repeat: -1
		});

		this.player = this.physics.add.sprite(400, 300, 'player', 1);


		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.spaceKey.on('down', this.handleSpacePress, this);
	}

	update(time: number, delta: number) {
		this.updatePlayer();
		this.updateMap();
		this.lookUpCreatureOnPlayerPosition();
	}

	updateMap() {
		const origin = this.map.getTileAtWorldXY(this.player.x, this.player.y);

		this.map.forEachTile(tile => {
			const dist = Phaser.Math.Distance.Snake(
				origin.x,
				origin.y,
				tile.x,
				tile.y
			);

			tile.setAlpha(1 - 0.1 * dist);
		});
	}

	updatePlayer() {
		this.player.body.setVelocity(0);

		// Snake movement is 4 directions only

		if (this.cursors.left.isDown) {
			this.player.body.setVelocityX(-100);
		}
		else if (this.cursors.right.isDown) {
			this.player.body.setVelocityX(100);
		}
		else if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-100);
		}
		else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(100);
		}

		// Update the animation last and give left/right animations precedence over up/down animations
		if (this.cursors.left.isDown) {
			this.player.anims.play('left', true);
		}
		else if (this.cursors.right.isDown) {
			this.player.anims.play('right', true);
		}
		else if (this.cursors.up.isDown) {
			this.player.anims.play('up', true);
		}
		else if (this.cursors.down.isDown) {
			this.player.anims.play('down', true);
		}
		else {
			this.player.anims.stop();
		}
	}

	lookUpCreatureOnPlayerPosition() {
		const currentPlayerPosition = {
			x: this.player.x,
			y: this.player.y,
		};

		if (!this.prevPlayerPosition ||
			currentPlayerPosition.x !== this.prevPlayerPosition.x ||
			currentPlayerPosition.y !== this.prevPlayerPosition.y
		) {
			const foundStarkmon = lookup_creature_on_coordinates(currentPlayerPosition.x, currentPlayerPosition.y);
			if (foundStarkmon) {
				this.renderCreature(currentPlayerPosition.x, currentPlayerPosition.y);
				this.setFeedbackText('Found a creature!');
			}
		}

		this.prevPlayerPosition = currentPlayerPosition;
	}

	renderCreature(x: number, y: number): void {
        // Create a sprite at the specified coordinates using the specified frame from the creatures sprite sheet
        const creature = this.physics.add.sprite(x, y, 'creatures', Math.floor(Math.random() * 10));
        
        // Optionally set any other properties or behaviors for the creature sprite
        // ...
    }

	handleSpacePress() {
		const foundStarkmon = lookup_creature_on_coordinates(this.player.x, this.player.y);
		if (foundStarkmon) {
			claim_creature_on_coordinates(this.player.x, this.player.y);
			this.setFeedbackText('A creature is being claimed!');

		}
	}

	setFeedbackText(message: string) {
		this.feedbackText!.setText(message);
		this.feedbackText!.setVisible(true);
		// Hide the feedback text after 2 seconds
		this.time.delayedCall(2000, () => {
			if (this.feedbackText) {
				this.feedbackText.setVisible(false);
			}
		}, null, this);
	}
}