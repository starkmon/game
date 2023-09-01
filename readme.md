# Dojo Phaser starter

### Directory structure:

```
|-- client 
  | - src Your client source
  | - ... Other build related stuff
|-- contracts
  | - src        Your cairo contracts
  | - scarb.toml Your cairo package config
```

### Getting started

#### Step 0

Install Dojo as described here,
https://book.dojoengine.org/getting-started/quick-start.html

#### Step 1: Sequencer

You can use Katana, a centralised high performance sequencer, to run your world.

In terminal start katana with this command:

```
katana
```

#### Step 2: Build/Test/Deploy

Terminal 2 can be used for building and deploy and later testing as you work on your contracts.
In another terminal, build your contracts with sozo.

```
cd contracts
sozo build
```

#### Step 3

In terminal 3 for client,

```
cd client
yarn dev
```
