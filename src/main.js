import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap'; // Make sure you've imported gsap

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // Initial camera position

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true // For smoother edges
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Controls (for initial development and later camera panning)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add damping for smoother panning
controls.dampingFactor = 0.05;

// Lighting (essential for a good 3D scene)
const ambientLight = new THREE.AmbientLight(0x404040); // Soft overall lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(ambientLight, pointLight);

// Add some initial background geometry (e.g., a grid, some abstract shapes)
const gridHelper = new THREE.GridHelper(20, 20);
scene.add(gridHelper);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Important for OrbitControls to work

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Example: Creating a few "portfolio element" geometries
const geometry1 = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const portfolioElement1 = new THREE.Mesh(geometry1, material1);
portfolioElement1.position.set(-3, 0, 0);
portfolioElement1.name = 'portfolioElement1'; // Give it a name for identification
scene.add(portfolioElement1);

const geometry2 = new THREE.SphereGeometry(0.75, 32, 32);
const material2 = new THREE.MeshStandardMaterial({ color: 0x00ffff });
const portfolioElement2 = new THREE.Mesh(geometry2, material2);
portfolioElement2.position.set(0, 1.5, -2);
portfolioElement2.name = 'portfolioElement2';
scene.add(portfolioElement2);

const geometry3 = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const material3 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const portfolioElement3 = new THREE.Mesh(geometry3, material3);
portfolioElement3.position.set(3, -1, 1);
portfolioElement3.name = 'portfolioElement3';
scene.add(portfolioElement3);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    // Calculate normalized mouse coordinates (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onPointerClick() {
    // Update the ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // Calculate objects intersecting the ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked object:', clickedObject.name);

        // Handle the click based on the object's name or some other identifier
        if (clickedObject.name === 'portfolioElement1') {
            panCameraTo(new THREE.Vector3(-5, 0, 3)); // Define your target position
        } else if (clickedObject.name === 'portfolioElement2') {
            panCameraTo(new THREE.Vector3(0, 3, 0));
        } else if (clickedObject.name === 'portfolioElement3') {
            panCameraTo(new THREE.Vector3(5, -2, -1));
        }
    }
}



function panCameraTo(targetPosition) {
    gsap.to(camera.position, {
        duration: 1.5,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: 'power2.easeInOut'
    });

    gsap.to(controls.target, {
        duration: 1.5,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: 'power2.easeInOut',
        onUpdate: () => {
            controls.update();
        }
    });
}

window.addEventListener('mousemove', onPointerMove);
window.addEventListener('click', onPointerClick);