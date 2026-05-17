import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlacedFurniture, RoomConfig, LightingState } from '../types';
import { buildFurnitureObject, getFloorMaterial } from '../utils/geometryBuilder';

interface RoomCanvasProps {
  roomConfig: RoomConfig;
  items: PlacedFurniture[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  lightingState: LightingState;
  cameraView: 'corner' | 'top' | 'front' | 'side';
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  roomConfig,
  items,
  selectedItemId,
  onSelectItem,
  lightingState,
  cameraView
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Keep track of added furniture groups for raycasting cleanup
  const furnitureGroupsRef = useRef<THREE.Group[]>([]);
  // Keep reference to selection indicator mesh
  const selectionRingRef = useRef<THREE.Mesh | null>(null);

  // 1. Initialize Scene, Camera, Renderer, and OrbitControls
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Width and Height from parent container
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Base background color changes dynamically but set default
    scene.background = new THREE.Color('#f8fafc');

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from going below ground level
    controls.minDistance = 2;
    controls.maxDistance = 25;
    controlsRef.current = controls;

    // Initial Camera Position
    camera.position.set(roomConfig.width * 0.9, roomConfig.wallHeight * 1.5, roomConfig.length * 1.2);
    controls.target.set(0, roomConfig.wallHeight * 0.3, 0);
    controls.update();

    // Create selection indicator ring
    const ringGeom = new THREE.RingGeometry(0.0, 0.0, 32); // will scale dynamically
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: '#3b82f6', 
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const selectionRing = new THREE.Mesh(ringGeom, ringMat);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.y = 0.01; // slightly above floor
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!currentMount || !renderer || !camera) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Raycaster/Click Selection Listener
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      // Only trigger on main canvas clicks
      if (event.target !== renderer.domElement) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Search through meshes inside furnitureGroups
      const intersects = raycaster.intersectObjects(scene.children, true);

      let foundId: string | null = null;
      for (const hit of intersects) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj && obj !== scene) {
          if (obj.userData && obj.userData.isFurniture) {
            foundId = obj.userData.id;
            break;
          }
          obj = obj.parent;
        }
        if (foundId) break;
      }

      onSelectItem(foundId);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      }
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Run once on mount

  // 2. Adjust Camera Preset Views when triggered
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const w = roomConfig.width;
    const l = roomConfig.length;
    const h = roomConfig.wallHeight;

    switch (cameraView) {
      case 'top':
        camera.position.set(0, Math.max(w, l) * 1.8, 0.001); // slight Z offset to prevent gimbal lock
        controls.target.set(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, h * 0.6, l * 1.6);
        controls.target.set(0, h * 0.4, 0);
        break;
      case 'side':
        camera.position.set(w * 1.6, h * 0.6, 0);
        controls.target.set(0, h * 0.4, 0);
        break;
      case 'corner':
      default:
        camera.position.set(w * 0.9, h * 1.4, l * 1.2);
        controls.target.set(0, h * 0.3, 0);
        break;
    }
    controls.update();
  }, [cameraView]);

  // 3. Rebuild Room Geometry (Walls & Floor) when roomConfig changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old room parts
    const toRemove: THREE.Object3D[] = [];
    scene.children.forEach(child => {
      if (child.name.startsWith('room_')) {
        toRemove.push(child);
      }
    });
    toRemove.forEach(child => scene.remove(child));

    const w = roomConfig.width;
    const l = roomConfig.length;
    const h = roomConfig.wallHeight;
    const wallThick = 0.1;

    const wallMat = new THREE.MeshStandardMaterial({ 
      color: roomConfig.wallColor,
      roughness: 0.85 
    });

    // Floor Box
    const floorGeom = new THREE.BoxGeometry(w, wallThick, l);
    const floorMat = getFloorMaterial(roomConfig.floorStyle, roomConfig.floorColor);
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.name = 'room_floor';
    floor.position.set(0, -wallThick / 2, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    // Baseboard trim around walls
    const trimMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 });
    const trimH = 0.1;
    const trimThick = 0.02;

    // Back Wall (Z = -l/2)
    const backWallGeom = new THREE.BoxGeometry(w, h, wallThick);
    const backWall = new THREE.Mesh(backWallGeom, wallMat);
    backWall.name = 'room_wall_back';
    backWall.position.set(0, h / 2, -l / 2 - wallThick / 2);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);

    // Back trim
    const backTrimGeom = new THREE.BoxGeometry(w, trimH, trimThick);
    const backTrim = new THREE.Mesh(backTrimGeom, trimMat);
    backTrim.name = 'room_trim_back';
    backTrim.position.set(0, trimH / 2, -l / 2 + trimThick / 2);
    scene.add(backTrim);

    // Left Wall (X = -w/2)
    const leftWallGeom = new THREE.BoxGeometry(wallThick, h, l);
    const leftWall = new THREE.Mesh(leftWallGeom, wallMat);
    leftWall.name = 'room_wall_left';
    leftWall.position.set(-w / 2 - wallThick / 2, h / 2, 0);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);

    // Left trim
    const leftTrimGeom = new THREE.BoxGeometry(trimThick, trimH, l);
    const leftTrim = new THREE.Mesh(leftTrimGeom, trimMat);
    leftTrim.name = 'room_trim_left';
    leftTrim.position.set(-w / 2 + trimThick / 2, trimH / 2, 0);
    scene.add(leftTrim);

    // Optional Front Wall (Z = l/2)
    if (roomConfig.showFrontWall) {
      const frontWall = new THREE.Mesh(backWallGeom, wallMat);
      frontWall.name = 'room_wall_front';
      frontWall.position.set(0, h / 2, l / 2 + wallThick / 2);
      frontWall.receiveShadow = true;
      scene.add(frontWall);
    }

    // Optional Right Wall (X = w/2)
    if (roomConfig.showRightWall) {
      const rightWall = new THREE.Mesh(leftWallGeom, wallMat);
      rightWall.name = 'room_wall_right';
      rightWall.position.set(w / 2 + wallThick / 2, h / 2, 0);
      rightWall.receiveShadow = true;
      scene.add(rightWall);
    }

  }, [roomConfig]);

  // 4. Update Day/Night Lighting Simulation
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing lights
    const oldLights: THREE.Object3D[] = [];
    scene.children.forEach(child => {
      if (child.name.startsWith('light_')) {
        oldLights.push(child);
      }
    });
    oldLights.forEach(c => scene.remove(c));

    const t = lightingState.timeOfDay; // 0 to 24

    // Helper to blend colors or compute daytime logic
    // 6 to 18 is Daytime. Peak noon is 12.
    const isDay = t >= 5.5 && t <= 18.5;
    const isSunset = (t >= 5 && t < 7) || (t > 17 && t <= 19);

    // Background sky color adaptation
    let skyColor = '#f8fafc';
    let ambientColor = '#ffffff';
    let ambientIntensity = 0.65;

    let dirColor = '#fef08a'; // sunlight
    let dirIntensity = 1.2;

    if (isSunset) {
      skyColor = '#fee2e2'; // soft sunset tint
      ambientColor = '#ffedd5';
      ambientIntensity = 0.45;
      dirColor = '#fb923c'; // orange light
      dirIntensity = 0.8;
    } else if (!isDay) {
      skyColor = '#0f172a'; // dark night sky
      ambientColor = '#94a3b8';
      ambientIntensity = 0.2;
      dirColor = '#60a5fa'; // soft moon light
      dirIntensity = 0.3;
    }

    scene.background = new THREE.Color(skyColor);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    ambientLight.name = 'light_ambient';
    scene.add(ambientLight);

    // Main Directional Light (Sun or Moon path)
    // Angle ranges from 0 (East horizon) to Pi (West horizon)
    const sunAngle = ((t - 6) / 12) * Math.PI;
    const dist = Math.max(roomConfig.width, roomConfig.length) * 1.5;
    
    const dirLight = new THREE.DirectionalLight(dirColor, dirIntensity);
    dirLight.name = 'light_directional';

    if (isDay) {
      // Arching over the scene
      const lx = Math.cos(sunAngle) * dist;
      const ly = Math.max(2, Math.sin(sunAngle) * dist * 1.2);
      const lz = dist * 0.4;
      dirLight.position.set(lx, ly, lz);
    } else {
      // Moon path offset
      const moonAngle = ((t < 6 ? t + 18 : t - 6) / 12) * Math.PI;
      const lx = Math.cos(moonAngle) * dist;
      const ly = Math.max(3, Math.sin(moonAngle) * dist);
      const lz = -dist * 0.3;
      dirLight.position.set(lx, ly, lz);
    }

    dirLight.castShadow = lightingState.shadows;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = dist * 3;
    const dSize = Math.max(roomConfig.width, roomConfig.length) * 0.8;
    dirLight.shadow.camera.left = -dSize;
    dirLight.shadow.camera.right = dSize;
    dirLight.shadow.camera.top = dSize;
    dirLight.shadow.camera.bottom = -dSize;
    dirLight.shadow.bias = -0.0005;

    scene.add(dirLight);

    // Indoor Ceiling/Lamp lights
    if (lightingState.indoorLightsOn || !isDay) {
      // Main overhead warm fill light
      const ceilingLight = new THREE.PointLight('#fef08a', 1.2, 15);
      ceilingLight.name = 'light_indoor_ceiling';
      ceilingLight.position.set(0, roomConfig.wallHeight - 0.3, 0);
      ceilingLight.castShadow = lightingState.shadows;
      ceilingLight.shadow.bias = -0.001;
      scene.add(ceilingLight);

      // Add accent point lights for every 'lamp' furniture placed
      items.forEach(item => {
        if (item.type === 'lamp') {
          const lampLight = new THREE.PointLight(item.color || '#fde047', 1.0, 6);
          lampLight.name = `light_indoor_lamp_${item.id}`;
          lampLight.position.set(item.x, item.height - 0.2, item.z);
          scene.add(lampLight);
        }
      });
    }

  }, [lightingState, roomConfig, items]);

  // 5. Render/Update Placed Furniture Items
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous furniture groups
    furnitureGroupsRef.current.forEach(group => scene.remove(group));
    furnitureGroupsRef.current = [];

    // Rebuild and inject new items
    items.forEach(item => {
      const group = buildFurnitureObject(item);
      scene.add(group);
      furnitureGroupsRef.current.push(group);
    });

    // Update selection ring target position
    const ring = selectionRingRef.current;
    if (ring) {
      const selectedItem = items.find(i => i.id === selectedItemId);
      if (selectedItem) {
        // Size ring based on object bounds
        const radius = Math.max(selectedItem.width, selectedItem.depth) * 0.6 + 0.1;
        ring.geometry.dispose();
        ring.geometry = new THREE.RingGeometry(radius - 0.06, radius, 36);
        ring.position.set(selectedItem.x, 0.02, selectedItem.z);
        ring.visible = true;
      } else {
        ring.visible = false;
      }
    }

  }, [items, selectedItemId]);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
      {/* Container for ThreeJS Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Embedded axes / orientation hint inside canvas view */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-600 pointer-events-none shadow-xs flex items-center gap-3">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> X: Width
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span> Z: Length
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Y: Height
        </span>
      </div>

      {/* Orbit interaction guides */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 pointer-events-none shadow-sm max-w-xs text-right">
        <p className="font-semibold text-slate-700 mb-0.5">Orbit Controls Active</p>
        <p>Left-click + Drag to <span className="font-medium text-slate-700">Rotate</span></p>
        <p>Right-click + Drag to <span className="font-medium text-slate-700">Pan</span></p>
        <p>Scroll to <span className="font-medium text-slate-700">Zoom</span></p>
        <p className="mt-1 text-[11px] text-blue-600 font-medium">Click any item directly to select & edit</p>
      </div>
    </div>
  );
};
