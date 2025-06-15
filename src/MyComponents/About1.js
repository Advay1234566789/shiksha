// about1.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class Chemistry3DLab {
  constructor(parentElement) {
    // Create a main container for the lab simulator and style it nicely
    this.container = document.createElement('div');
    this.container.id = "labContainer";
    this.container.style.position = "relative";
    this.container.style.margin = "20px auto";
    this.container.style.width = "90%";
    this.container.style.border = "2px solid #444";
    this.container.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    this.container.style.backgroundColor = "#1a1a1a";
    this.container.style.overflow = "hidden";
    // Instead of appending to document.body, append to the provided parent element
    parentElement.appendChild(this.container);

    // Basic utilities
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Drag and drop state management
    this.draggedObject = null;
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.dragOffset = new THREE.Vector3();
    this.isDragging = false;

    // For double/triple click detection
    this.selectedTestTube = null; // Stores the reagent selected via double-click
    this.clickCount = 0;
    this.clickTimer = null;

    // Initialize scene, camera, renderer, etc.
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    this.initLights();
    this.initLaboratoryEnvironment();

    // Attach pointer events to the renderer's DOM element
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this), false);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this), false);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp.bind(this), false);
    // Attach mouse events for double-click and click detection
    this.renderer.domElement.addEventListener('dblclick', this.onDoubleClick.bind(this), false);
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this), false);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // Create an info panel for instructions and feedback (appended inside the lab container)
    this.createInfoPanel();

    // Start rendering loop
    this.animate();
  }

  // --- Initialization Methods ---
  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 5, 30);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.set(0, 1.6, 3);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    // Append the renderer's canvas into the lab container
    this.container.appendChild(this.renderer.domElement);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Focus on the table center
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 6, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    const labLight1 = new THREE.PointLight(0xffffee, 0.8, 10);
    labLight1.position.set(0, 2.5, 0);
    this.scene.add(labLight1);
    const labLight2 = new THREE.PointLight(0xeeffff, 0.5, 8);
    labLight2.position.set(-2, 2, -1);
    this.scene.add(labLight2);
  }

  initLaboratoryEnvironment() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x6699aa, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    backWall.position.set(0, 2, -5);
    this.scene.add(backWall);
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    leftWall.position.set(-5, 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    this.scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMaterial);
    rightWall.position.set(5, 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    this.scene.add(rightWall);
    // Lab Table
    this.createLabTable(0, 0.8, -1);
    // Equipment: containers, test tubes, etc.
    this.createLabEquipment();
  }

  createLabTable(x, y, z) {
    const tableGeometry = new THREE.BoxGeometry(2.5, 0.1, 1.2);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x885533, roughness: 0.5 });
    const tableTop = new THREE.Mesh(tableGeometry, tableMaterial);
    tableTop.position.set(x, y, z);
    tableTop.receiveShadow = true;
    tableTop.castShadow = true;
    this.scene.add(tableTop);
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, y * 2, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8 });
    const positions = [
      [x - 1.1, y - 0.4, z - 0.5],
      [x - 1.1, y - 0.4, z + 0.5],
      [x + 1.1, y - 0.4, z - 0.5],
      [x + 1.1, y - 0.4, z + 0.5]
    ];
    positions.forEach(pos => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(...pos);
      leg.receiveShadow = true;
      leg.castShadow = true;
      this.scene.add(leg);
    });
  }

  createLabEquipment() {
    // Create containers: beaker, flask, test tube rack, and molecular model stand.
    this.beaker = this.createBeaker(0.5, 0.95, -0.8);
    this.flask = this.createFlask(-0.5, 0.95, -0.8);
    this.createTestTubeRack(0, 0.95, -0.4);
    this.createMolecularModelStand(-0.8, 0.95, -1);
    // Optionally, add a reagent shelf if desired:
    this.createReagentShelf(0, 1.2, -1.2);
  }

  createBeaker(x, y, z) {
    const beakerGroup = new THREE.Group();
    beakerGroup.position.set(x, y, z);
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16, 1, true),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 })
    );
    body.position.y = 0.1;
    beakerGroup.add(body);
    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(0.1, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 })
    );
    bottom.rotation.x = -Math.PI / 2;
    beakerGroup.add(bottom);
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.15, 16),
      new THREE.MeshStandardMaterial({ color: 0x1155ff, transparent: true, opacity: 0.7 })
    );
    liquid.position.y = 0.075;
    beakerGroup.add(liquid);
    // Changing the container name to simulate an HCl container.
    beakerGroup.userData = {
      type: 'beaker',
      canInteract: true,
      canDrag: true,
      isContainer: true,
      reactants: [],
      reactantsColors: [],
      liquid: liquid,
      name: 'HCl Container'
    };
    this.scene.add(beakerGroup);
    return beakerGroup;
  }

  createFlask(x, y, z) {
    const flaskGroup = new THREE.Group();
    flaskGroup.position.set(x, y, z);
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 })
    );
    body.position.y = 0.05;
    flaskGroup.add(body);
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.06, 0.15, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 })
    );
    neck.position.y = 0.18;
    flaskGroup.add(neck);
    const liquid = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.4),
      new THREE.MeshStandardMaterial({ color: 0xff5511, transparent: true, opacity: 0.7 })
    );
    liquid.position.y = 0.02;
    flaskGroup.add(liquid);
    flaskGroup.userData = {
      type: 'flask',
      canInteract: true,
      canDrag: true,
      isContainer: true,
      reactants: [],
      reactantsColors: [],
      liquid: liquid,
      name: 'Flask with Orange Solution'
    };
    this.scene.add(flaskGroup);
    return flaskGroup;
  }

  createTestTubeRack(x, y, z) {
    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, y, z);
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.05, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x885533, roughness: 0.8 })
    );
    rackGroup.add(base);
    const top = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.02, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x885533, roughness: 0.8 })
    );
    top.position.y = 0.2;
    rackGroup.add(top);
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
    const reagentNames = ['Acid', 'Base', 'Catalyst', 'Indicator'];
    for (let i = 0; i < 4; i++) {
      const tubeGroup = new THREE.Group();
      tubeGroup.position.set(-0.23 + i * 0.15, 0.15, 0);
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.18, 12, 1, true),
        new THREE.MeshStandardMaterial({ color: 0x885533, roughness: 0.8 })
      );
      tube.position.y = 0.05;
      tubeGroup.add(tube);
      const bottom = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5),
        new THREE.MeshStandardMaterial({ color: 0x885533, roughness: 0.8 })
      );
      bottom.position.y = -0.04;
      tubeGroup.add(bottom);
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.1 + Math.random() * 0.08, 12),
        new THREE.MeshStandardMaterial({ color: colors[i], transparent: true, opacity: 0.7 })
      );
      liquid.position.y = -0.04 + (0.1 + Math.random() * 0.08) / 2;
      tubeGroup.add(liquid);
      // Add reagentName so the interaction handler displays a proper name.
      tubeGroup.userData = {
        type: 'testTube',
        canInteract: true,
        canDrag: true,
        index: i,
        color: colors[i],
        reagentType: reagentNames[i],
        reagentName: `Test Tube (${reagentNames[i]})`,
        name: `Test Tube (${reagentNames[i]})`
      };
      rackGroup.add(tubeGroup);
    }
    // Mark the rack itself as non-interactive to avoid interfering with test tube selection.
    rackGroup.userData = {
      type: 'testTubeRack',
      canInteract: false,
      canDrag: true,
      name: 'Test Tube Rack'
    };
    this.scene.add(rackGroup);
    return rackGroup;
  }

  createMolecularModelStand(x, y, z) {
    const standGroup = new THREE.Group();
    standGroup.position.set(x, y, z);
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.03, 16),
      new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
    );
    base.position.y = -0.015;
    standGroup.add(base);
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5 })
    );
    rod.position.y = 0.15;
    standGroup.add(rod);
    const moleculeGroup = new THREE.Group();
    moleculeGroup.position.y = 0.3;
    const oxygen = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.3 })
    );
    moleculeGroup.add(oxygen);
    const hydrogen1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    hydrogen1.position.set(-0.075, 0, 0);
    moleculeGroup.add(hydrogen1);
    const hydrogen2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
    );
    hydrogen2.position.set(0.03, 0.07, 0);
    moleculeGroup.add(hydrogen2);
    const bond1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 })
    );
    bond1.position.set(-0.0375, 0, 0);
    bond1.rotation.z = Math.PI / 2;
    moleculeGroup.add(bond1);
    const bond2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.007, 0.007, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.5 })
    );
    bond2.position.set(0.015, 0.035, 0);
    bond2.rotation.z = Math.PI / 4;
    moleculeGroup.add(bond2);
    moleculeGroup.userData = {
      type: 'moleculeModel',
      canInteract: true,
      name: 'Water Molecule Model'
    };
    standGroup.add(moleculeGroup);
    standGroup.userData = {
      type: 'moleculeStand',
      canInteract: true,
      canDrag: true,
      name: 'Molecular Model Stand'
    };
    this.scene.add(standGroup);
    return standGroup;
  }

  createReagentShelf(x, y, z) {
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(x, y, z);
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.05, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x775533, roughness: 0.7 })
    );
    shelfGroup.add(shelf);
    const reagents = [
      { name: 'Sodium Hydroxide', color: 0xeeeeee },
      { name: 'Hydrochloric Acid', color: 0xffffaa },
      { name: 'Copper Sulfate', color: 0x5588ff },
      { name: 'Potassium Permanganate', color: 0xaa22aa }
    ];
    for (let i = 0; i < reagents.length; i++) {
      const bottleGroup = this.createReagentBottle(
        -0.45 + i * 0.3,
        0.15,
        0,
        reagents[i].color,
        reagents[i].name
      );
      shelfGroup.add(bottleGroup);
    }
    shelfGroup.userData = { type: 'shelf', canInteract: false, name: 'Reagent Shelf' };
    this.scene.add(shelfGroup);
    return shelfGroup;
  }

  createReagentBottle(x, y, z, color, name) {
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(x, y, z);
    const bottleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.18, 12),
      new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.5, roughness: 0.2, transmission: 0.6 })
    );
    bottleBody.position.y = 0;
    bottleGroup.add(bottleBody);
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.06, 12),
      new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.5, roughness: 0.2, transmission: 0.6 })
    );
    neck.position.y = 0.12;
    bottleGroup.add(neck);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12),
      new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 })
    );
    cap.position.y = 0.165;
    bottleGroup.add(cap);
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.12, 12),
      new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.8 })
    );
    liquid.position.y = -0.03;
    bottleGroup.add(liquid);
    bottleGroup.userData = {
      type: 'reagentBottle',
      canInteract: true,
      canDrag: true,
      reagentColor: color,
      reagentName: name,
      name: name,
      reagent: true
    };
    return bottleGroup;
  }

  // --- Pour Button and Pour Animation ---
  createPourButton(reagent) {
    // Create a canvas for the button texture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'rgba(50,50,50,0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText('Pour', canvas.width / 2, canvas.height / 2 + 8);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.25, 1);
    // Position the button above the reagent
    sprite.position.copy(reagent.position).add(new THREE.Vector3(0, 0.5, 0));
    // Set interactive property so that the pour button is detected as interactive
    sprite.userData = { type: 'pourButton', reagent: reagent, canInteract: true };
    this.scene.add(sprite);
    reagent.userData.pourButton = sprite;
  }

  // --- Pour Animation ---
  animatePour(reagent) {
    // Target position: beaker's liquid center in world coordinates
    const targetPos = new THREE.Vector3();
    this.beaker.userData.liquid.getWorldPosition(targetPos);
    targetPos.y += 0.05;
    reagent.userData.isPouring = true;
    reagent.userData.pourStartPos = reagent.position.clone();
    reagent.userData.pourTargetPos = targetPos;
    reagent.userData.pourDuration = 2000; // 2 seconds
    reagent.userData.pourStartTime = performance.now();
    // Remove the pour button if it exists
    if (reagent.userData.pourButton) {
      this.scene.remove(reagent.userData.pourButton);
      delete reagent.userData.pourButton;
    }
    this.updateStatusDisplay(`Pouring ${reagent.userData.reagentName} into ${this.beaker.userData.name}...`);
  }

  updatePourAnimations() {
    this.scene.traverse(object => {
      if (object.userData && object.userData.isPouring) {
        const now = performance.now();
        const elapsed = now - object.userData.pourStartTime;
        const t = Math.min(elapsed / object.userData.pourDuration, 1);
        object.position.lerpVectors(object.userData.pourStartPos, object.userData.pourTargetPos, t);
        if (t >= 1) {
          // Once pouring is done, mix the reagent into the container
          this.handleInteraction(object, this.beaker);
          object.userData.isPouring = false;
        }
      }
    });
  }

  // --- New Feature: Double-click to select reagent and show Pour button ---
  onDoubleClick(event) {
    // Reset any pending click counts to avoid interference with triple-click logic
    this.clickCount = 0;
    if (this.clickTimer) clearTimeout(this.clickTimer);

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    let selected = null;
    for (const inter of intersects) {
      // Use recursive lookup to find the interactive ancestor
      selected = this.findInteractiveAncestor(inter.object);
      if (selected && (selected.userData.type === 'testTube' || selected.userData.type === 'reagentBottle')) {
        break;
      }
    }
    if (selected) {
      this.selectedTestTube = selected;
      if (selected.userData.reagentType === 'Acid') {
        this.updateStatusDisplay(`Acid selected`);
      } else {
        this.updateStatusDisplay(`Reagent Selected: ${selected.userData.name}`);
      }
      console.log("Double-click selected reagent:", selected);
      // Create a pour button near the selected reagent
      this.createPourButton(selected);
    }
  }

  // --- New Feature: Triple-click detection to transfer selected reagent ---
  onClick(event) {
    // If a reagent is selected, try to pour it into a container on a single click.
    if (this.selectedTestTube) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      let container = null;
      for (const inter of intersects) {
        container = this.findInteractiveAncestor(inter.object);
        if (container && container.userData.isContainer) {
          break;
        }
      }
      if (container) {
        if (this.selectedTestTube.userData.reagentType === 'Acid' && container.userData.name === 'HCl Container') {
          this.updateStatusDisplay(`Acid added to HCl`);
          this.updateReactionDisplay(`Reaction: A vigorous fizzing reaction occurs producing white precipitate!`);
        } else {
          this.updateStatusDisplay(`Transferred ${this.selectedTestTube.userData.name} to ${container.userData.name}`);
        }
        this.animatePour(this.selectedTestTube);
        this.selectedTestTube = null;
      }
    }
  }

  // --- Info Panel ---
  createInfoPanel() {
    const infoPanel = document.createElement('div');
    infoPanel.style.position = 'absolute';
    infoPanel.style.top = '10px';
    infoPanel.style.left = '10px';
    infoPanel.style.background = 'linear-gradient(135deg, #333, #111)';
    infoPanel.style.color = 'white';
    infoPanel.style.padding = '15px';
    infoPanel.style.borderRadius = '8px';
    infoPanel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.6)';
    infoPanel.style.maxWidth = '300px';
    infoPanel.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    
    const header = document.createElement('h2');
    header.style.margin = '0 0 10px 0';
    header.style.fontSize = '18px';
    header.textContent = 'Chemistry Lab Simulator';
    infoPanel.appendChild(header);
    
    const instructions = document.createElement('p');
    instructions.style.margin = '0 0 10px 0';
    instructions.style.fontSize = '14px';
    instructions.innerHTML =
      'Drag and drop chemicals into containers to perform experiments.<br><br>' +
      'Double-click a reagent (test tube or bottle) to select it and show a "Pour" button.<br>' +
      'Triple-click a container to transfer the reagent automatically.';
    infoPanel.appendChild(instructions);
    
    const statusArea = document.createElement('div');
    statusArea.style.marginTop = '10px';
    statusArea.style.padding = '8px';
    statusArea.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    statusArea.style.borderRadius = '3px';
    statusArea.style.fontSize = '14px';
    statusArea.innerHTML = 'Selected: None<br>Status: Ready for experiments';
    infoPanel.appendChild(statusArea);
    this.statusArea = statusArea;
    
    // Reaction Panel for displaying reaction messages
    const reactionPanel = document.createElement('div');
    reactionPanel.style.marginTop = '10px';
    reactionPanel.style.padding = '8px';
    reactionPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    reactionPanel.style.borderRadius = '3px';
    reactionPanel.style.fontSize = '14px';
    reactionPanel.innerHTML = 'Reaction: None';
    infoPanel.appendChild(reactionPanel);
    this.reactionPanel = reactionPanel;
    
    // Append the info panel into the lab container
    this.container.appendChild(infoPanel);
  }

  updateStatusDisplay(message) {
    if (this.statusArea) {
      this.statusArea.innerHTML = message;
    }
  }
  
  // Update the reaction display panel
  updateReactionDisplay(message) {
    if (this.reactionPanel) {
      this.reactionPanel.innerHTML = message;
    }
  }

  // --- Utility: Find first interactive ancestor ---
  findInteractiveAncestor(object) {
    let current = object;
    while (current !== null) {
      if (current.userData && current.userData.canInteract) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }

  // --- Pointer Event Handlers for Dragging ---
  onPointerDown(event) {
    if (event.button !== 0) return;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      const selectedObject = this.findInteractiveAncestor(intersects[0].object);
      // If a pour button is clicked, handle pouring immediately
      if (selectedObject && selectedObject.userData.type === 'pourButton') {
        const reagent = selectedObject.userData.reagent;
        if (reagent) {
          this.animatePour(reagent);
        }
        return;
      }
      if (selectedObject && selectedObject.userData.canDrag) {
        this.controls.enabled = false;
        this.draggedObject = selectedObject;
        this.isDragging = true;
        this.dragPlane.set(new THREE.Vector3(0, 1, 0), -selectedObject.position.y);
        this.dragOffset.copy(intersects[0].point).sub(selectedObject.position);
        this.updateStatusDisplay(`Selected: ${selectedObject.userData.name}<br>Status: Dragging object`);
      } else if (selectedObject) {
        this.updateStatusDisplay(`Selected: ${selectedObject.userData.name || 'Unknown Object'}<br>Status: Object cannot be moved`);
      }
    }
  }

  onPointerMove(event) {
    if (!this.isDragging || !this.draggedObject) return;
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectionPoint = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.dragPlane, intersectionPoint)) {
      this.draggedObject.position.copy(intersectionPoint.sub(this.dragOffset));
      const tableHeight = 0.85;
      if (this.draggedObject.position.y < tableHeight) {
        this.draggedObject.position.y = tableHeight;
      }
      const bounds = 4;
      this.draggedObject.position.x = Math.max(-bounds, Math.min(bounds, this.draggedObject.position.x));
      this.draggedObject.position.z = Math.max(-bounds, Math.min(bounds, this.draggedObject.position.z));
    }
  }

  onPointerUp(event) {
    if (!this.isDragging || !this.draggedObject) {
      this.controls.enabled = true;
      return;
    }
    this.controls.enabled = true;
    this.checkForInteractions();
    this.isDragging = false;
    this.draggedObject = null;
    this.updateStatusDisplay('Selected: None<br>Status: Ready for experiments');
  }

  // --- Check for drag-drop interactions using bounding boxes ---
  checkForInteractions() {
    if (!this.draggedObject) return;
    const potentialContainers = this.scene.children.filter(obj =>
      obj.userData && obj.userData.isContainer
    );
    for (const container of potentialContainers) {
      const box = new THREE.Box3().setFromObject(container);
      if (box.containsPoint(this.draggedObject.position)) {
        this.handleInteraction(this.draggedObject, container);
        return;
      }
    }
  }

  // --- Interaction Handler: Mix reagent into container ---
  handleInteraction(sourceObj, targetObj) {
    if ((sourceObj.userData.reagent || sourceObj.userData.type === 'testTube') && targetObj.userData.isContainer) {
      const reagentName = sourceObj.userData.reagentName || 'Unknown Reagent';
      const reagentColor = sourceObj.userData.reagentColor || sourceObj.userData.color || 0xffffff;
      if (!targetObj.userData.reactants) {
        targetObj.userData.reactants = [];
      }
      targetObj.userData.reactants.push(reagentName);
      if (!targetObj.userData.reactantsColors) {
        targetObj.userData.reactantsColors = [];
      }
      targetObj.userData.reactantsColors.push(reagentColor);
      this.mixChemicals(targetObj);
      if (sourceObj.userData.reagentType === 'Acid' && targetObj.userData.name === 'HCl Container') {
        this.updateStatusDisplay(`Acid added to HCl`);
        this.updateReactionDisplay(`Reaction: A vigorous fizzing reaction occurs producing white precipitate!`);
      } else {
        this.updateStatusDisplay(`Mixed ${reagentName} into ${targetObj.userData.name}`);
      }
      this.scene.remove(sourceObj);
    }
  }

  // --- Mix reagent colors by averaging RGB channels ---
  mixChemicals(container) {
    const colors = container.userData.reactantsColors;
    if (!colors || colors.length === 0) return;
    let totalR = 0, totalG = 0, totalB = 0;
    colors.forEach(hex => {
      const r = (hex >> 16) & 0xff;
      const g = (hex >> 8) & 0xff;
      const b = hex & 0xff;
      totalR += r;
      totalG += g;
      totalB += b;
    });
    const n = colors.length;
    const avgR = Math.floor(totalR / n);
    const avgG = Math.floor(totalG / n);
    const avgB = Math.floor(totalB / n);
    const mixedHex = (avgR << 16) | (avgG << 8) | avgB;
    container.userData.liquid.material.color.setHex(mixedHex);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.updatePourAnimations();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// React component that instantiates the Chemistry3DLab only when rendered.
const About1 = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let labInstance;
    if (containerRef.current) {
      // Instantiate the lab simulator and attach it to the container div.
      labInstance = new Chemistry3DLab(containerRef.current);
    }
    // Cleanup: remove the lab simulator container on unmount.
    return () => {
      if (labInstance && labInstance.container && containerRef.current) {
        containerRef.current.removeChild(labInstance.container);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default About1;
