// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("webgl"),
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// IMPORTANT: register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// DEBUG: test if GSAP works
gsap.to(cube.rotation, {
  y: Math.PI * 2,
  duration: 2,
  repeat: -1
});

// SCROLL animation
gsap.to(cube.rotation, {
  x: Math.PI * 2,
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    markers: true // shows debug markers
  }
});
