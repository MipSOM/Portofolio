/* Renderer, kamera, dan cahaya. */
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
var cv = document.getElementById("gl");
var r = new THREE.WebGLRenderer({
  canvas: cv,
  antialias: true,
  alpha: true
});

r.setPixelRatio(Math.min(devicePixelRatio, 2));
r.outputEncoding = THREE.sRGBEncoding;

var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
cam.position.z = 9;

scene.add(new THREE.AmbientLight(0xffffff, 0.75));

var dl = new THREE.DirectionalLight(0xffffff, 0.85);
dl.position.set(2, 3, 5);
scene.add(dl);
