import { lookup_creature_on_coordinates } from "../utils/lookup_creature";

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

	preload() {
		this.load.image('tiles', 'assets/catastrophi_tiles_32.png');
		this.load.tilemapCSV('map', 'assets/catastrophi_level2.csv');
		this.load.spritesheet('player', 'assets/spaceman.png', { frameWidth: 32, frameHeight: 32 });
	}

	create() {
		// When loading a CSV map, make sure to specify the tileWidth and tileHeight
		this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
		const tileset = this.map.addTilesetImage('tiles');
		const layer = this.map.createLayer(0, tileset, 0, 0);
		this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 }, fillStyle: { color: 0xff0000 } });

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
				this.renderSquare(currentPlayerPosition.x, currentPlayerPosition.y, 16);
			}
		}
	
		this.prevPlayerPosition = currentPlayerPosition;
	}

	renderSquare(x: number, y: number, size: number): void {
		if (!this.graphics) return;

		this.graphics.fillStyle(0xff0000, 1);  // Red color
		this.graphics.fillRect(x, y, size, size);
	}
}