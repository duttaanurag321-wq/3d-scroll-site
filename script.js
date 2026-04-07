const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('webgl')
});
renderer.setSize(window.innerWidth, window.innerHeight);

// cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// scroll animation
gsap.registerPlugin(ScrollTrigger);

gsap.to(cube.rotation, {
  x: Math.PI * 2,
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
