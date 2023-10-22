import { claim_creature_on_coordinates, creature_details_on_coordinates, creature_on_coordinates } from "../utils/game_actions";

type Coords = { x: number, y: number }

export default class GameScene extends Phaser.Scene {
	showDebug = false;
	player = null;
	wallet = null;
	helpText = null;
	debugGraphics = null;
	cursors = null;
	map: Phaser.Tilemaps.Tilemap | null = null;
	graphics: Phaser.GameObjects.Graphics | null = null;
	square: Coords | null = null;
	prevPlayerPosition: { x: number, y: number } | null = null;
	spaceKey: Phaser.Input.Keyboard.Key | null = null;
	creatureLookupTimer: number = 0;
	spawnCoords: Coords = { x: 0, y: 0 };
	creaturesAtCoords: Coords[] = [];
	lookupsDone: { [key: string]: { [key: string]: number } } = {};


	feedbackText: Phaser.GameObjects.Text | null = null;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(wallet: any) {
		super('GameScene');
		this.wallet = wallet;
	}

	preload() {
		this.load.image('tiles', 'assets/catastrophi_tiles_32.png');
		this.load.tilemapCSV('map', 'assets/catastrophi_level2.csv');
		this.load.spritesheet('player', 'assets/spaceman.png', { frameWidth: 32, frameHeight: 32 });
		this.load.spritesheet('creatures', 'assets/question-mark.png', { frameWidth: 32, frameHeight: 32 });
	}

	createAnimations() {
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
	}

	create() {

		this.spawnCoords = {
			x: 0x100 + Math.random() * 0x10000,
			y: 0x100 + Math.random() * 0x10000
		};

		this.spawnCoords = { x: 0x13bb - 32, y: 10 - 32, };

		0x13bb
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


		this.player = this.physics.add.sprite(400, 300, 'player', 1);

		this.createAnimations();

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
		this.renderLookedUpCreatures();
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

	// Happens every half a second
	lookUpCreatureOnPlayerPosition() {
		const time = Date.now();
		if (time - this.creatureLookupTimer < 500) {
			return;
		}

		this.creatureLookupTimer = time;

		let { x, y } = this.map.getTileAtWorldXY(this.player.x, this.player.y);

		x += this.spawnCoords.x;
		y += this.spawnCoords.y;

		const fov = 10; // field of view, range of lookup

		for (let ix = x - fov; ix <= x + fov; ix++) {
			for (let iy = y - fov; iy <= y + fov; iy++) {
				this.lookupsDone[ix] = this.lookupsDone[ix] || {};
				if (!this.lookupsDone[ix][iy]) {
					const foundStarkmon = creature_on_coordinates(ix, iy);
					if (foundStarkmon) {
						this.creaturesAtCoords.push({ x: ix - this.spawnCoords.x, y: iy - this.spawnCoords.y });
					}
					this.lookupsDone[ix][iy] = 1;
				}

			}
		}

		window.creaturesAtCoords = this.creaturesAtCoords;
		window.lookupsDone = this.lookupsDone;

	}

	renderLookedUpCreatures() {
		let { x, y, pixelX, pixelY, width, height } = this.map.getTileAtWorldXY(this.player.x, this.player.y);

		this.creaturesAtCoords.forEach(({ x: cx, y: cy }) => {
			const normalisedX = pixelX + (cx - x) * width;
			const normalisedY = pixelY + (cy - y) * height;

			this.physics.add.sprite(normalisedX + width / 2, normalisedY + height / 2, 'creatures');

		});
	}

	handleSpacePress() {
		const foundStarkmon = creature_on_coordinates(this.player.x, this.player.y);
		if (foundStarkmon) {
			claim_creature_on_coordinates(this.player.x, this.player.y);
			this.setFeedbackText('A creature is being claimed!');

		}
	}

	renderSquare(x: number, y: number, size: number): void {
		if (!this.graphics) return;

		this.graphics.fillStyle(0xff0000, 1);  // Red color
		this.graphics.fillRect(x, y, size, size);
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