import * as THREE from 'three';

// Initialize Three.js Scene
let scene, camera, renderer, particles, cube, torusKnot, stars, galaxy;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

// Main initialization function
function initThreeJS() {
    // Get the canvas element
    const canvas = document.getElementById('bg-canvas');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = null; // Transparent background
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create all 3D objects
    createParticleSystem();
    createRotatingCube();
    createTorusKnot();
    createStarField();
    createGalaxy();
    
    // Add lights
    addLights();
    
    // Mouse movement tracking
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
    });
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Create particle system (floating particles)
function createParticleSystem() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        // Random positions in a sphere
        const radius = 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Colors - red to orange gradient
        colors[i * 3] = 0.9 + Math.random() * 0.1;     // R
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.2; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create rotating cube with wireframe
function createRotatingCube() {
    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const material = new THREE.MeshBasicMaterial({
        color: 0xe50914,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(2, 1.5, -2);
    scene.add(cube);
    
    // Add inner cube
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const innerCube = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), innerMaterial);
    cube.add(innerCube);
}

// Create torus knot (complex 3D shape)
function createTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(0.8, 0.2, 200, 32, 3, 4);
    const material = new THREE.MeshStandardMaterial({
        color: 0xe50914,
        emissive: 0x440000,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.8
    });
    
    torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.set(-2, -1, -3);
    scene.add(torusKnot);
}

// Create star field background
function createStarField() {
    const starCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

// Create rotating galaxy effect
function createGalaxy() {
    const galaxyCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    
    for (let i = 0; i < galaxyCount; i++) {
        const radius = Math.random() * 12;
        const angle = Math.random() * Math.PI * 2;
        const spiralFactor = radius * 0.5;
        
        positions[i * 3] = Math.cos(angle + spiralFactor) * radius;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
        positions[i * 3 + 2] = Math.sin(angle + spiralFactor) * radius;
        
        // Color based on position
        const color = new THREE.Color().setHSL(0.05 + radius * 0.03, 1, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);
}

// Add lights for 3D objects
function addLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Point light 1
    const pointLight1 = new THREE.PointLight(0xff3366, 1);
    pointLight1.position.set(2, 3, 4);
    scene.add(pointLight1);
    
    // Point light 2
    const pointLight2 = new THREE.PointLight(0x33ff66, 0.5);
    pointLight2.position.set(-2, 1, 3);
    scene.add(pointLight2);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate cube
    if (cube) {
        cube.rotation.x += 0.008;
        cube.rotation.y += 0.012;
        cube.rotation.z += 0.005;
    }
    
    // Rotate torus knot
    if (torusKnot) {
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.015;
        torusKnot.rotation.z += 0.007;
    }
    
    // Rotate galaxy
    if (galaxy) {
        galaxy.rotation.y += 0.002;
        galaxy.rotation.x += 0.001;
    }
    
    // Rotate star field slowly
    if (stars) {
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0003;
    }
    
    // Animate particles
    if (particles) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
    }
    
    // Follow mouse with camera
    camera.position.x += (targetRotationY * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-targetRotationX * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create separate 3D cube for modal (interactive)
export function initCubeModal() {
    const canvas = document.getElementById('cube-canvas');
    if (!canvas) return;
    
    const modalScene = new THREE.Scene();
    const modalCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const modalRenderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    modalRenderer.setSize(500, 500);
    modalRenderer.setPixelRatio(window.devicePixelRatio);
    
    // Create a more detailed cube for modal
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff3366, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x33ff66, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x3366ff, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0xff33ff, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0xff9933, metalness: 0.8, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0x33ffff, metalness: 0.8, roughness: 0.2 })
    ];
    
    const modalCube = new THREE.Mesh(geometry, materials);
    modalScene.add(modalCube);
    
    // Add edges
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    modalCube.add(wireframe);
    
    // Add lights
    const ambient = new THREE.AmbientLight(0x404040);
    modalScene.add(ambient);
    
    const light1 = new THREE.PointLight(0xff3366, 1);
    light1.position.set(2, 3, 4);
    modalScene.add(light1);
    
    const light2 = new THREE.PointLight(0x33ff66, 0.5);
    light2.position.set(-2, 1, 3);
    modalScene.add(light2);
    
    modalCamera.position.z = 3;
    
    let modalMouseX = 0, modalMouseY = 0;
    
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        modalMouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        modalMouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    });
    
    function animateModal() {
        requestAnimationFrame(animateModal);
        
        modalCube.rotation.x += 0.01;
        modalCube.rotation.y += 0.015;
        
        modalCamera.position.x += (modalMouseX * 0.5 - modalCamera.position.x) * 0.05;
        modalCamera.position.y += (-modalMouseY * 0.3 - modalCamera.position.y) * 0.05;
        modalCamera.lookAt(modalScene.position);
        
        modalRenderer.render(modalScene, modalCamera);
    }
    
    animateModal();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}