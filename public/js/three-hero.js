/**
 * Procedural 3D "NEXUS" humanoid in Three.js — float + mouse parallax (lerp)
 */
export function mountThreeHero(container) {
  const THREE = window.THREE;
  if (!THREE || !container) return () => {};

  const width = container.clientWidth || 400;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050018, 0.035);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 1.2, 5.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x050018, 0);
  container.appendChild(renderer.domElement);

  const amb = new THREE.AmbientLight(0x406080, 0.6);
  scene.add(amb);
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 6, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0x3dffb5, 1.2, 20);
  rim.position.set(-2, 2, 3);
  scene.add(rim);
  const purp = new THREE.PointLight(0xff4bd8, 0.8, 18);
  purp.position.set(2, 0, -2);
  scene.add(purp);

  const group = new THREE.Group();
  scene.add(group);

  const matBody = new THREE.MeshStandardMaterial({
    color: 0x0a1525,
    metalness: 0.85,
    roughness: 0.25,
    emissive: 0x001a22,
    emissiveIntensity: 0.35,
  });
  const matAccent = new THREE.MeshStandardMaterial({
    color: 0x3dffb5,
    metalness: 0.6,
    roughness: 0.35,
    emissive: 0x3dffb5,
    emissiveIntensity: 0.4,
  });
  const matJoint = new THREE.MeshStandardMaterial({
    color: 0x111820,
    metalness: 0.9,
    roughness: 0.2,
  });

  function box(w, h, d, mat, x, y, z) {
    const g = new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  }

  // Torso
  box(0.95, 1.15, 0.45, matBody, 0, 0.85, 0);
  // Chest core
  box(0.35, 0.35, 0.05, matAccent, 0, 1.05, 0.24);
  // Head
  box(0.55, 0.5, 0.48, matBody, 0, 1.75, 0);
  // Visor
  box(0.42, 0.12, 0.06, matAccent, 0, 1.78, 0.26);
  // Shoulders
  box(1.35, 0.22, 0.35, matJoint, 0, 1.35, 0);
  // Arms
  box(0.22, 0.85, 0.22, matBody, -0.85, 0.75, 0);
  box(0.22, 0.85, 0.22, matBody, 0.85, 0.75, 0);
  // Hands
  box(0.2, 0.22, 0.18, matAccent, -0.85, 0.18, 0.05);
  box(0.2, 0.22, 0.18, matAccent, 0.85, 0.18, 0.05);
  // Hips / legs
  box(0.75, 0.25, 0.38, matJoint, 0, 0.35, 0);
  box(0.28, 0.75, 0.28, matBody, -0.22, -0.35, 0);
  box(0.28, 0.75, 0.28, matBody, 0.22, -0.35, 0);
  box(0.32, 0.2, 0.38, matBody, -0.22, -0.95, 0.05);
  box(0.32, 0.2, 0.38, matBody, 0.22, -0.95, 0.05);

  // Floor ring
  const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3dffb5,
    transparent: true,
    opacity: 0.35,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.15;
  group.add(ring);

  group.position.y = 0;

  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;
  const maxTilt = 0.18;

  function onMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = nx * maxTilt;
    targetRotX = -ny * maxTilt * 0.6;
  }
  window.addEventListener("mousemove", onMove);

  let t = 0;
  let raf = 0;
  function animate() {
    t += 0.016;
    const float = Math.sin(t * 1.1) * 0.08;
    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;
    group.rotation.x = curRotX;
    group.rotation.y = curRotY;
    group.position.y = float;
    ring.rotation.z = t * 0.35;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w && h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  ro.observe(container);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", onMove);
    ro.disconnect();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}
