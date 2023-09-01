<img width=350 src="https://github.com/shramee/dojo-p5/assets/11048263/c506e56e-e4aa-4ac3-9ebe-e207df15ecba" align=right>

# Dojo P5.js starter

Simple P5.js starter that includes a basic interface to interact with your Dojo world.

Included helper methods in Dojo class - https://github.com/shramee/dojo-js

## Directory structure

```
|-- client 
  | - public     Additional public files
  | - src        Your client source
  | - index.html Your index.html
  | - ...        Other build/package related stuff
|-- contracts
  | - src        Your cairo contracts
  | - scarb.toml Your cairo package config
```

## Getting started

### Step 0

Install Dojo as described here,
https://book.dojoengine.org/getting-started/quick-start.html

### Step 1: Sequencer

You can use Katana, a centralised high performance sequencer, to run your world.

In terminal start katana with this command:

```
katana
```

### Step 2: Build/Test/Deploy

Terminal 2 can be used for building and deploy and later testing as you work on your contracts.
In another terminal, build your contracts with `sozo build` and deploy with `sozo migrate`.

```
cd contracts
sozo build
sozo migrate
```

### Step 3

In terminal 3 for client,

```
cd client
yarn dev
```
