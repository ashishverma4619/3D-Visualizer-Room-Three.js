# 3D Visualizer Room — Three.js

An interactive 3D room designer built with React, Three.js, and TypeScript. Place, customize, and arrange furniture in a real-time 3D environment with dynamic lighting and multiple camera views.

## Features

- **3D Room Canvas** — Real-time WebGL rendering powered by Three.js
- **Furniture Catalog** — Add sofas, beds, tables, chairs, bookshelves, plants, rugs, TV stands, and lamps
- **Item Customization** — Adjust position, rotation, size, and color of each item
- **Room Configuration** — Control room dimensions, wall/floor colors, and floor styles (wood, carpet, tile, concrete)
- **Dynamic Lighting** — Time-of-day slider, day/sunset/night presets, and toggleable indoor lights
- **Camera Views** — Corner, top, front, and side perspectives
- **Room Presets** — Load pre-built room layouts instantly
- **Duplicate & Delete** — Manage placed items with ease

## Tech Stack

- [React 19](https://react.dev/)
- [Three.js](https://threejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── RoomCanvas.tsx     # Three.js WebGL scene
│   ├── Sidebar.tsx        # Furniture catalog & room config
│   ├── Toolbar.tsx        # Camera controls & scene actions
│   ├── ItemDetails.tsx    # Selected item property editor
│   └── Icon.tsx           # Icon utility component
├── data/
│   └── furnitureTemplates.ts  # Furniture definitions & room presets
├── utils/
│   ├── geometryBuilder.ts # Three.js geometry helpers
│   └── cn.ts              # Tailwind class utility
├── types.ts               # Shared TypeScript types
├── App.tsx                # Root component & state management
└── main.tsx               # Entry point
```

## License

[MIT](./LICENSE)
