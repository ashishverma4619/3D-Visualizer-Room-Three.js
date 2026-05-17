import * as THREE from 'three';
import { PlacedFurniture } from '../types';

/**
 * Creates a Three.js Group representing the stylized furniture item.
 */
export function buildFurnitureObject(item: PlacedFurniture): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${item.id}`;
  // Store reference to trigger selection upon raycast intersection
  group.userData = { id: item.id, isFurniture: true, type: item.type };

  const primaryMat = new THREE.MeshStandardMaterial({ 
    color: item.color,
    roughness: 0.6,
    metalness: 0.1
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: item.secondaryColor || '#334155',
    roughness: 0.5,
    metalness: 0.3
  });

  const whiteMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.8
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    roughness: 0.2,
    metalness: 0.8
  });

  // Ensure child meshes cast and receive shadows
  const applyShadows = (mesh: THREE.Mesh) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    // Relay userData so raycaster easily identifies the parent furniture ID
    mesh.userData = { id: item.id, isFurniture: true };
  };

  const w = item.width;
  const h = item.height;
  const d = item.depth;

  switch (item.type) {
    case 'sofa': {
      // Base cushion: lower half
      const seatHeight = h * 0.5;
      const seatGeom = new THREE.BoxGeometry(w * 0.8, seatHeight, d);
      const seat = new THREE.Mesh(seatGeom, primaryMat);
      seat.position.set(0, seatHeight / 2, 0);
      applyShadows(seat);
      group.add(seat);

      // Armrests: left and right
      const armWidth = w * 0.1;
      const armHeight = h * 0.75;
      const armGeom = new THREE.BoxGeometry(armWidth, armHeight, d * 0.95);
      
      const leftArm = new THREE.Mesh(armGeom, secondaryMat);
      leftArm.position.set(-w / 2 + armWidth / 2, armHeight / 2, 0);
      applyShadows(leftArm);
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeom, secondaryMat);
      rightArm.position.set(w / 2 - armWidth / 2, armHeight / 2, 0);
      applyShadows(rightArm);
      group.add(rightArm);

      // Backrest
      const backThickness = d * 0.2;
      const backGeom = new THREE.BoxGeometry(w * 0.8, h, backThickness);
      const back = new THREE.Mesh(backGeom, primaryMat);
      back.position.set(0, h / 2, -d / 2 + backThickness / 2);
      applyShadows(back);
      group.add(back);
      break;
    }

    case 'bed': {
      // Mattress Base
      const frameHeight = h * 0.35;
      const frameGeom = new THREE.BoxGeometry(w, frameHeight, d);
      const frame = new THREE.Mesh(frameGeom, secondaryMat);
      frame.position.set(0, frameHeight / 2, 0);
      applyShadows(frame);
      group.add(frame);

      // Mattress top
      const matHeight = h * 0.3;
      const matGeom = new THREE.BoxGeometry(w * 0.95, matHeight, d * 0.95);
      const mattress = new THREE.Mesh(matGeom, primaryMat);
      mattress.position.set(0, frameHeight + matHeight / 2, 0);
      applyShadows(mattress);
      group.add(mattress);

      // Headboard
      const headHeight = h;
      const headThickness = d * 0.08;
      const headGeom = new THREE.BoxGeometry(w, headHeight, headThickness);
      const headboard = new THREE.Mesh(headGeom, secondaryMat);
      headboard.position.set(0, headHeight / 2, -d / 2 + headThickness / 2);
      applyShadows(headboard);
      group.add(headboard);

      // Pillows
      const pillowW = w * 0.35;
      const pillowH = h * 0.15;
      const pillowD = d * 0.15;
      const pillowGeom = new THREE.BoxGeometry(pillowW, pillowH, pillowD);
      
      const p1 = new THREE.Mesh(pillowGeom, whiteMat);
      p1.position.set(-w * 0.22, frameHeight + matHeight + pillowH / 2, -d / 2 + headThickness + pillowD);
      applyShadows(p1);
      group.add(p1);

      const p2 = new THREE.Mesh(pillowGeom, whiteMat);
      p2.position.set(w * 0.22, frameHeight + matHeight + pillowH / 2, -d / 2 + headThickness + pillowD);
      applyShadows(p2);
      group.add(p2);
      break;
    }

    case 'table': {
      // Table top
      const topThickness = Math.min(0.08, h * 0.15);
      const topGeom = new THREE.BoxGeometry(w, topThickness, d);
      const top = new THREE.Mesh(topGeom, primaryMat);
      top.position.set(0, h - topThickness / 2, 0);
      applyShadows(top);
      group.add(top);

      // 4 Legs
      const legW = Math.min(0.06, w * 0.1);
      const legH = h - topThickness;
      const legGeom = new THREE.BoxGeometry(legW, legH, legW);
      
      const offsets = [
        [-w/2 + legW, -d/2 + legW],
        [w/2 - legW, -d/2 + legW],
        [-w/2 + legW, d/2 - legW],
        [w/2 - legW, d/2 - legW]
      ];

      offsets.forEach(([ox, oz]) => {
        const leg = new THREE.Mesh(legGeom, secondaryMat);
        leg.position.set(ox, legH / 2, oz);
        applyShadows(leg);
        group.add(leg);
      });
      break;
    }

    case 'chair': {
      // Seat
      const seatThickness = 0.05;
      const seatH = h * 0.55;
      const seatGeom = new THREE.BoxGeometry(w, seatThickness, d);
      const seat = new THREE.Mesh(seatGeom, primaryMat);
      seat.position.set(0, seatH, 0);
      applyShadows(seat);
      group.add(seat);

      // Backrest
      const backThickness = 0.04;
      const backH = h - seatH;
      const backGeom = new THREE.BoxGeometry(w, backH, backThickness);
      const back = new THREE.Mesh(backGeom, primaryMat);
      back.position.set(0, seatH + backH / 2, -d / 2 + backThickness / 2);
      applyShadows(back);
      group.add(back);

      // Legs
      const legW = 0.03;
      const legGeom = new THREE.BoxGeometry(legW, seatH, legW);
      const offsets = [
        [-w/2 + legW, -d/2 + legW],
        [w/2 - legW, -d/2 + legW],
        [-w/2 + legW, d/2 - legW],
        [w/2 - legW, d/2 - legW]
      ];
      offsets.forEach(([ox, oz]) => {
        const leg = new THREE.Mesh(legGeom, secondaryMat);
        leg.position.set(ox, seatH / 2, oz);
        applyShadows(leg);
        group.add(leg);
      });
      break;
    }

    case 'tv_stand': {
      // Cabinet base
      const cabH = h * 0.45;
      const cabGeom = new THREE.BoxGeometry(w, cabH, d);
      const cabinet = new THREE.Mesh(cabGeom, primaryMat);
      cabinet.position.set(0, cabH / 2, 0);
      applyShadows(cabinet);
      group.add(cabinet);

      // TV support pole/stand
      const standGeom = new THREE.BoxGeometry(w * 0.2, 0.05, d * 0.4);
      const standBase = new THREE.Mesh(standGeom, blackMat);
      standBase.position.set(0, cabH + 0.025, 0);
      applyShadows(standBase);
      group.add(standBase);

      const poleGeom = new THREE.BoxGeometry(0.08, h * 0.15, 0.05);
      const pole = new THREE.Mesh(poleGeom, blackMat);
      pole.position.set(0, cabH + h * 0.075, 0);
      applyShadows(pole);
      group.add(pole);

      // Screen Panel
      const screenW = w * 0.85;
      const screenH = h * 0.5;
      const screenThickness = 0.06;
      const screenGeom = new THREE.BoxGeometry(screenW, screenH, screenThickness);
      const screen = new THREE.Mesh(screenGeom, secondaryMat); // frame color
      screen.position.set(0, cabH + h * 0.1 + screenH / 2, 0);
      applyShadows(screen);
      group.add(screen);

      // Glowing/Dark display panel face
      const faceGeom = new THREE.PlaneGeometry(screenW * 0.95, screenH * 0.9);
      const face = new THREE.Mesh(faceGeom, blackMat);
      face.position.set(0, cabH + h * 0.1 + screenH / 2, screenThickness / 2 + 0.002);
      face.userData = { id: item.id, isFurniture: true };
      group.add(face);
      break;
    }

    case 'bookshelf': {
      // Outer side frames
      const frameThickness = 0.04;
      const sideGeom = new THREE.BoxGeometry(frameThickness, h, d);
      
      const leftSide = new THREE.Mesh(sideGeom, primaryMat);
      leftSide.position.set(-w / 2 + frameThickness / 2, h / 2, 0);
      applyShadows(leftSide);
      group.add(leftSide);

      const rightSide = new THREE.Mesh(sideGeom, primaryMat);
      rightSide.position.set(w / 2 - frameThickness / 2, h / 2, 0);
      applyShadows(rightSide);
      group.add(rightSide);

      // Top and bottom + inner shelves
      const shelfW = w - frameThickness * 2;
      const shelfGeom = new THREE.BoxGeometry(shelfW, frameThickness, d * 0.95);
      
      const numShelves = 5;
      for (let i = 0; i < numShelves; i++) {
        const shelfY = (h / (numShelves - 1)) * i;
        // slightly adjusted inside bounds
        const yPos = Math.max(frameThickness/2, Math.min(h - frameThickness/2, shelfY));
        const shelf = new THREE.Mesh(shelfGeom, primaryMat);
        shelf.position.set(0, yPos, 0);
        applyShadows(shelf);
        group.add(shelf);

        // Add some dummy mock books on intermediate shelves
        if (i > 0 && i < numShelves - 1) {
          const bookGroup = new THREE.Group();
          const count = 3 + Math.floor(Math.random() * 4);
          for (let b = 0; b < count; b++) {
            const bw = 0.04 + Math.random() * 0.03;
            const bh = 0.18 + Math.random() * 0.08;
            const bd = 0.15 + Math.random() * 0.05;
            const bGeom = new THREE.BoxGeometry(bw, bh, bd);
            // colorful book spines
            const bMat = new THREE.MeshStandardMaterial({ 
              color: new THREE.Color().setHSL(Math.random(), 0.6, 0.5) 
            });
            const bookMesh = new THREE.Mesh(bGeom, bMat);
            bookMesh.position.set(-shelfW/3 + b * 0.07, bh/2 + frameThickness/2, 0);
            applyShadows(bookMesh);
            bookGroup.add(bookMesh);
          }
          bookGroup.position.set(0, yPos, 0);
          group.add(bookGroup);
        }
      }

      // Backboard
      const backGeom = new THREE.BoxGeometry(shelfW, h, 0.02);
      const back = new THREE.Mesh(backGeom, secondaryMat);
      back.position.set(0, h / 2, -d / 2 + 0.01);
      applyShadows(back);
      group.add(back);
      break;
    }

    case 'plant': {
      // Pot Base
      const potH = h * 0.35;
      const potRadius = w * 0.4;
      const potGeom = new THREE.CylinderGeometry(potRadius * 1.2, potRadius * 0.8, potH, 16);
      const pot = new THREE.Mesh(potGeom, secondaryMat);
      pot.position.set(0, potH / 2, 0);
      applyShadows(pot);
      group.add(pot);

      // Central stem
      const stemGeom = new THREE.CylinderGeometry(0.02, 0.03, h * 0.5, 8);
      const stemMat = new THREE.MeshStandardMaterial({ color: '#4d2e11' });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.set(0, potH + h * 0.25, 0);
      applyShadows(stem);
      group.add(stem);

      // Leaves clusters (dodecahedron or grouped spheres)
      const foliageGeom = new THREE.DodecahedronGeometry(w * 0.55, 1);
      const foliage = new THREE.Mesh(foliageGeom, primaryMat);
      foliage.position.set(0, h * 0.75, 0);
      // squash slightly
      foliage.scale.set(1.0, 1.3, 1.0);
      applyShadows(foliage);
      group.add(foliage);
      break;
    }

    case 'lamp': {
      // Base plate
      const baseRadius = w * 0.45;
      const baseThickness = 0.04;
      const baseGeom = new THREE.CylinderGeometry(baseRadius, baseRadius * 1.1, baseThickness, 20);
      const base = new THREE.Mesh(baseGeom, secondaryMat);
      base.position.set(0, baseThickness / 2, 0);
      applyShadows(base);
      group.add(base);

      // Long slender pole
      const poleH = h * 0.85;
      const poleGeom = new THREE.CylinderGeometry(0.02, 0.025, poleH, 12);
      const pole = new THREE.Mesh(poleGeom, secondaryMat);
      pole.position.set(0, baseThickness + poleH / 2, 0);
      applyShadows(pole);
      group.add(pole);

      // Lamp Shade (flared open cone or cylinder)
      const shadeH = h * 0.2;
      const shadeRadiusTop = w * 0.2;
      const shadeRadiusBot = w * 0.5;
      const shadeGeom = new THREE.CylinderGeometry(shadeRadiusTop, shadeRadiusBot, shadeH, 20, 1, true);
      // Double sided so the interior displays beautifully
      const shadeMat = new THREE.MeshStandardMaterial({ 
        color: item.color, 
        side: THREE.DoubleSide,
        roughness: 0.3
      });
      const shade = new THREE.Mesh(shadeGeom, shadeMat);
      shade.position.set(0, h - shadeH / 2, 0);
      applyShadows(shade);
      group.add(shade);

      // Emissive bulb inside
      const bulbGeom = new THREE.SphereGeometry(0.06, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#fef08a',
        emissiveIntensity: 1.5
      });
      const bulb = new THREE.Mesh(bulbGeom, bulbMat);
      bulb.position.set(0, h - shadeH * 0.4, 0);
      bulb.userData = { id: item.id, isFurniture: true };
      group.add(bulb);
      break;
    }

    case 'rug': {
      // Extremely simple slim box laying flat
      const rugThickness = Math.max(0.01, h);
      const rugGeom = new THREE.BoxGeometry(w, rugThickness, d);
      const rug = new THREE.Mesh(rugGeom, primaryMat);
      // slightly lifted above absolute 0 to prevent z-fighting with the floor
      rug.position.set(0, rugThickness / 2, 0);
      // rug receives shadows beautifully
      rug.receiveShadow = true;
      rug.userData = { id: item.id, isFurniture: true };
      group.add(rug);

      // decorative borders
      const borderThickness = 0.005;
      const borderGeom = new THREE.BoxGeometry(w * 0.8, borderThickness, d * 0.8);
      const borderMat = new THREE.MeshStandardMaterial({ color: item.secondaryColor || '#ffffff' });
      const border = new THREE.Mesh(borderGeom, borderMat);
      border.position.set(0, rugThickness + borderThickness / 2, 0);
      border.receiveShadow = true;
      border.userData = { id: item.id, isFurniture: true };
      group.add(border);
      break;
    }

    default: {
      // Fallback standard cuboid
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, primaryMat);
      mesh.position.set(0, h / 2, 0);
      applyShadows(mesh);
      group.add(mesh);
      break;
    }
  }

  // Position and rotate the master group
  group.position.set(item.x, item.y, item.z);
  group.rotation.y = item.rotation;

  return group;
}

/**
 * Procedurally generates grid textures or pattern materials for the floor.
 */
export function getFloorMaterial(style: 'wood' | 'carpet' | 'tile' | 'concrete', colorHex: string): THREE.Material {
  const baseColor = new THREE.Color(colorHex);
  
  // Custom materials with varying roughness to reflect light dynamically
  switch (style) {
    case 'wood':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.35,
        metalness: 0.1,
      });
    case 'tile':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.15, // shiny tile
        metalness: 0.05,
      });
    case 'carpet':
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.9,  // ultra matte
        metalness: 0.0,
      });
    case 'concrete':
    default:
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.7,
        metalness: 0.2,
      });
  }
}
