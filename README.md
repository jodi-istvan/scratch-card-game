# Scratch Card Game

Simple Scratch Card Game created using Angular 19 and PixiJS 8.

## Installation Guide

1. Make sure that you are using one of the following Node versions: 	`^18.19.1 || ^20.11.1 || ^22.0.0`. 
2. Install the Angular CLI
```bash
npm install -g @angular/cli
```
3. From the root of the project, install the Node packages
```bash
npm install
```
## Run the app

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## How to play the game

1. First you need to select the bet you want to play with by clicking on the **Bet** button. The selected bet will essentially be the multiplier for the prize you win.
2. After selecting the bet, you need to click the **Wager** button. Once you wagered, you will no longer be able to change the bet.
3. In order to flip the cards, you can click on the cards one by one, or click on the **Reveal cards** button.
4. In order to win, you need to have 3 identical prizes(symbols) among the cards you've been dealt. In this case, a popup with the amount won will be displayed, and you balance will be incremented. Otherwise, you will be presented with the *You lost* popup.

## Menu items

- Click on the **Paytable** button to open a popup with the possible prizes you can win. The prizes will be calculated based on the selected bet.
- Click on the **Game History** button to open a popup with the details of the last 20 games you played.
