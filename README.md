# DdeHoog.github.io

Personal portfolio site for **Damian de Hoog**. A single-page 3D scene built with React, Vite and `@react-three/fiber`, where each planet around the central "space boi" statue is an interactive section (Experience, Portfolio, About).

## Requirements

- **Node.js 18+** (Vite 6 requires Node 18 or newer; Node 20 LTS recommended)
- **npm** (ships with Node)

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/DdeHoog/DdeHoog.github.io.git
cd DdeHoog.github.io
npm install
```

## Available scripts

| Command           | What it does                                                                  |
|-------------------|-------------------------------------------------------------------------------|
| `npm run dev`     | Start the Vite dev server with HMR (defaults to http://localhost:5173).       |
| `npm run build`   | Type-free production build into `dist/`.                                      |
| `npm run preview` | Serve the production build locally for a final smoke test.                    |
| `npm run lint`    | Run ESLint over the project.                                                  |

### Run it

```bash
npm run dev
```

Then open the URL Vite prints in the terminal (<http://localhost:5173>).

You should see the 3D scene load. Click on one of the colored planets, or use the **Portfolio / Experience / About** buttons in the top-right of the navbar, to fly the camera to a planet and pop out its content card. Click the **DDH** logo (top-left) at any time to fly back to the home view.

## Project layout (short version)

```
public/    spaceboi.gltf + .bin + .glb + Spaceboi.jsx (3D model assets)
src/
  App.jsx                # composes <NavBar/> and <Hero/>
  components/
    Hero.jsx             # <Canvas> wrapper + welcome overlay
    Scene.jsx            # camera lerping + section orchestration
    Planets.jsx          # the three clickable spheres + HTML cards
    NavBar.jsx           # logo + section buttons
    Experience.jsx       # resume content
    About.jsx            # contact card
    Portfolio.jsx        # (placeholder — to become a project carousel)
  index.css              # global styles incl. planet-card responsive sizing
```

## Credits

The 3D model **"space boi"** by [silvercrow101](https://skfb.ly/oyXLG) is licensed under
[Creative Commons Attribution-NonCommercial 4.0](http://creativecommons.org/licenses/by-nc/4.0/).
The attribution is shown in-app in the bottom-left corner — please leave it in place.
