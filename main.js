import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== SCENE SETUP =====
// Create scene and set black background
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Configure camera with perspective projection
// Parameters: FOV (75°), aspect ratio, near plane (0.1), far plane (1000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15);  // Position camera to view all axes
camera.lookAt(0, 0, 0);           // Point camera at origin

// Initialize WebGL renderer and add to DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== CONTROLS SETUP =====
// Add orbital controls for interactive camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;     // Add smooth damping effect
controls.dampingFactor = 0.05;     // Control damping intensity

// ===== COORDINATE SYSTEM =====
// Helper function to create axis lines
const createAxis = (points, color) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });
    return new THREE.Line(geometry, material);
};

// Create and add X, Y, Z axes with distinct colors
// Red X-axis (-10 to 10)
const xAxis = createAxis([
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(10, 0, 0)
], 0xff0000);
scene.add(xAxis);

// Green Y-axis (-10 to 10)
const yAxis = createAxis([
    new THREE.Vector3(0, -10, 0),
    new THREE.Vector3(0, 10, 0)
], 0x00ff00);
scene.add(yAxis);

// Blue Z-axis (-10 to 10)
const zAxis = createAxis([
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(0, 0, 10)
], 0x0000ff);
scene.add(zAxis);

// ===== AXIS ARROWS =====
// Helper function to create arrow heads
const createArrow = (color) => {
    const geometry = new THREE.ConeGeometry(0.2, 0.5, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
};

// Add arrow heads to each end of X-axis
const xArrowPos = createArrow(0xff0000);
xArrowPos.position.x = 10;
xArrowPos.rotation.z = -Math.PI / 2;
scene.add(xArrowPos);

const xArrowNeg = createArrow(0xff0000);
xArrowNeg.position.x = -10;
xArrowNeg.rotation.z = Math.PI / 2;
scene.add(xArrowNeg);

// Add arrow heads to each end of Y-axis
const yArrowPos = createArrow(0x00ff00);
yArrowPos.position.y = 10;
scene.add(yArrowPos);

const yArrowNeg = createArrow(0x00ff00);
yArrowNeg.position.y = -10;
yArrowNeg.rotation.x = Math.PI;
scene.add(yArrowNeg);

// Add arrow heads to each end of Z-axis
const zArrowPos = createArrow(0x0000ff);
zArrowPos.position.z = 10;
zArrowPos.rotation.x = Math.PI / 2;
scene.add(zArrowPos);

const zArrowNeg = createArrow(0x0000ff);
zArrowNeg.position.z = -10;
zArrowNeg.rotation.x = -Math.PI / 2;
scene.add(zArrowNeg);

// ===== LORENZ ATTRACTOR SETUP =====
// Initialize starting point and array to store trajectory
const points = [];
let x = 0.1;  // Initial X position (non-zero to start motion)
let y = 0;    // Initial Y position
let z = 0;    // Initial Z position

// Lorenz system parameters
const sigma = 10;    // Prandtl number
const rho = 28;      // Rayleigh number
const beta = 8/3;    // Physical proportion
const dt = 0.005;    // Time step for integration

// Create line material and geometry for attractor
const attractorMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    linewidth: 2
});
let attractorGeometry = new THREE.BufferGeometry();
const attractorLine = new THREE.Line(attractorGeometry, attractorMaterial);
scene.add(attractorLine);

// ===== AXIS LABELS AND TICKS =====
// Load font and create tick marks with numbers
const fontLoader = new FontLoader();
fontLoader.load('./fonts/helvetiker_regular.typeface.json', function(font) {
    // Helper function to create ticks and labels for each axis
    const createTicks = (axis, color) => {
        // Create tick marks from -10 to 10 (excluding 0)
        for(let i = -10; i <= 10; i++) {
            if(i === 0) continue;
            
            let tickGeometry, number, position;
            const tickSize = 0.2;
            const tickMaterial = new THREE.LineBasicMaterial({ color });
            
            // Position ticks based on axis
            switch(axis) {
                case 'x':
                    tickGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(i, -tickSize, 0),
                        new THREE.Vector3(i, tickSize, 0)
                    ]);
                    position = new THREE.Vector3(i - 0.1, -0.5, 0);
                    break;
                case 'y':
                    tickGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(-tickSize, i, 0),
                        new THREE.Vector3(tickSize, i, 0)
                    ]);
                    position = new THREE.Vector3(-0.5, i - 0.1, 0);
                    break;
                case 'z':
                    tickGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(0, -tickSize, i),
                        new THREE.Vector3(0, tickSize, i)
                    ]);
                    position = new THREE.Vector3(0, -0.5, i - 0.1);
                    break;
            }
            
            // Add tick mark
            const tick = new THREE.Line(tickGeometry, tickMaterial);
            scene.add(tick);
            
            // Add number label
            const textGeometry = new TextGeometry(Math.abs(i).toString(), {
                font: font,
                size: 0.3,
                height: 0.01
            });
            const textMaterial = new THREE.MeshBasicMaterial({ color });
            number = new THREE.Mesh(textGeometry, textMaterial);
            number.position.copy(position);
            scene.add(number);
        }
        
        // Add axis label (X, Y, or Z)
        const labelGeometry = new TextGeometry(axis, {
            font: font,
            size: 0.4,
            height: 0.01
        });
        const labelMaterial = new THREE.MeshBasicMaterial({ color });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        
        // Position axis label
        switch(axis) {
            case 'x': label.position.set(10.5, 0, 0); break;
            case 'y': label.position.set(0, 10.5, 0); break;
            case 'z': label.position.set(0, 0, 10.5); break;
        }
        scene.add(label);
    };
    
    // Create ticks and labels for all axes
    createTicks('x', 0xff0000);
    createTicks('y', 0x00ff00);
    createTicks('z', 0x0000ff);
});

// Add rotation speed variable
const rotationSpeed = 0.002;

// ===== ANIMATION LOOP =====
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate next point using Lorenz equations
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    
    x += dx;
    y += dy;
    z += dz;
    
    // Rotate the entire scene
    scene.rotation.y += rotationSpeed;
    
    // Log debug info periodically
    if (points.length % 100 === 0) {
        console.log('Current position:', { x, y, z });
        console.log('Number of points:', points.length);
    }
    
    // Add new point to trajectory (scaled down for visibility)
    points.push(new THREE.Vector3(x, y, z).multiplyScalar(0.3));
    
    // Limit number of points to prevent performance issues
    if (points.length > 5000) {
        points.shift();
    }
    
    // Update geometry with new points
    attractorGeometry.dispose();
    attractorGeometry = new THREE.BufferGeometry().setFromPoints(points);
    attractorLine.geometry = attractorGeometry;
    
    // Update controls and render
    controls.update();
    renderer.render(scene, camera);
}
animate();

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
 