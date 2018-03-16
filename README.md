# team-7-checkers

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Release 1.0

## Drexel University, Winter 2018, Team 7

## Team
- Aman Argawal
- Yongchang Cai
- Ryan Hassing
- Zara Zahimi

## The Project
This is a simple multiplayer checkers app created using Electron. It runs on Windows, Mac, and Linux.

## How to Use
### Installation
#### Precompiled
Precompiled versions are available:
- [Mac](https://drive.google.com/open?id=1VbGJKdSlR2j45Qwm4VktygPV31G1Dlla)
- [Linux](https://drive.google.com/open?id=1NhTInxul6CTY1cdsF5DBcXBQdq4YubWP)
- [Windows](https://drive.google.com/open?id=1Nlfy2CyNp1lbkJIeqW0_JO-pbxHPsDPE)

Unzip and double-click on the executable to start the program.
- Mac: `team-7-checkers-darwin-x64/team-7-checkers.app/Contents/MacOS/team-7-checkers`
- Windows: `team-7-checkers-win32-ia32/team-7-checkers.exe`
- Linux: `team-7-checkers-linux-x64/team-7-checkers`

#### From Source
Building the app from source will require the use of a shell.
- `cd` to the `app/` directory.
- Mac: `npm run package-mac`
- Linux: `npm run package-linux`
- Windows: `npm run package-win`
- The executable will appear in the `release/` directory.
- Double-click on the executable to start the program.
  - Mac: `release/team-7-checkers-darwin-x64/team-7-checkers.app/Contents/MacOS/team-7-checkers`
  - Windows: `release/team-7-checkers-win32-ia32/team-7-checkers.exe`
  - Linux: `release/team-7-checkers-linux-x64/team-7-checkers`

### Use
Open the application and press the 'Play' button to search for a game. If there is another user online, you will be matched with them.

The colored bar on the game will indicate whose turn it is. If it is your turn, click a piece and its destination to make a move.

At any point during the game, you can leave or forfeit.

The game ends when one player loses all their pieces or forfeits. Then the endgame screen appears, indicating the victor. From there, you can exit to the main menu or offer a restart. If both players elect to restart, you will start a new game.
