<div align="center">

<img src="https://raw.githubusercontent.com/niccolofanton/tanks-game/master/white_tank.png" alt="Player 1 tank" height="60" />
&nbsp;&nbsp;&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/niccolofanton/tanks-game/master/red_tank.png" alt="Player 2 tank" height="60" />

# tanks-game

**A two-player, top-down tank battle built from scratch in vanilla JavaScript and the HTML5 Canvas — no engine, no dependencies, just maths.**

[![License](https://img.shields.io/github/license/niccolofanton/tanks-game)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/niccolofanton/tanks-game?style=social)](https://github.com/niccolofanton/tanks-game/stargazers)

### [▶ Play the live demo](https://niccolofanton.github.io/tanks-game/)

</div>

## What it does

Two tanks face off in a randomly generated arena rendered on a full-window canvas. Each tank drives with momentum-based physics, fires bullets that ricochet off walls and obstacles, and the first player to land a hit wins. Everything — the movement, the collisions, the bullet bounces and the field-of-view rendering — is computed by hand with plain trigonometry and vector maths, making this a compact reference for 2D game mechanics without any framework.

## Controls

| Action | Player 1 (white tank) | Player 2 (red tank) |
| --- | --- | --- |
| Forward / Backward | `W` / `S` | `↑` / `↓` |
| Turn left / right | `A` / `D` | `←` / `→` |
| Fire | `Space` | `Enter` |

## Quick start

No build step and no dependencies — it's three scripts and an HTML file. Clone the repo and open `index.html` in your browser:

```bash
git clone https://github.com/niccolofanton/tanks-game.git
cd tanks-game
# then open index.html in your browser
```

The sprites are loaded with relative paths, so opening the file directly works. If you prefer, serve the folder with any static server (e.g. `npx serve .` or `python3 -m http.server`) and open the printed URL. Or just try the [hosted version](https://niccolofanton.github.io/tanks-game/).

## Features

- **Two-player local multiplayer** on a single keyboard.
- **Momentum-based driving** — acceleration, deceleration, angular speed and idle damping per tank.
- **Bouncing bullets** that ricochet off arena walls and obstacles up to three times.
- **Hand-rolled collision detection** for tank-vs-wall, bullet-vs-wall and bullet-vs-tank, using rotated-rectangle perimeter sampling and matrix inversion.
- **Procedural arenas** — ten non-overlapping obstacles generated at random on every run.
- **2D ray-cast line of sight** with soft shadows around Player 1, a port of Nicky Case's *Sight & Light*.
- **~60 FPS** game loop, win detection and on-screen victory message.

## Tech stack

- Vanilla **JavaScript** (ES6 classes: `World`, `Tank`, `Bullet`)
- **HTML5 Canvas** 2D rendering context
- No libraries, no bundler, no build

## Credits

The visibility / shadow system is based on [ncase/sight-and-light](https://github.com/ncase/sight-and-light) by Nicky Case.

## License

Released under the [MIT License](LICENSE).
