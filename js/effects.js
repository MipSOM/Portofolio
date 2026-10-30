/* Efek latar: partikel, cincin berputar, bentuk melayang. */
var K = 400;
var pcount = 360;
var pp = new Float32Array(pcount * 3);
var pc = new Float32Array(pcount * 3);
var pal = [
  new THREE.Color(0x2bb8a8),
  new THREE.Color(0xe8559a),
  new THREE.Color(0xe0a82e),
  new THREE.Color(0x8fa0d8)
];

for (i = 0; i < pcount; i++) {
  pp[i * 3] = (Math.random() - 0.5) * 18;
  pp[i * 3 + 1] = (Math.random() - 0.5) * 10;
  pp[i * 3 + 2] = -Math.random() * 6 - 1;

  var cc = pal[i % 4];
  pc[i * 3] = cc.r;
  pc[i * 3 + 1] = cc.g;
  pc[i * 3 + 2] = cc.b;
}

var pgm = new THREE.BufferGeometry();
pgm.setAttribute("position", new THREE.BufferAttribute(pp, 3));
pgm.setAttribute("color", new THREE.BufferAttribute(pc, 3));

var pm = new THREE.PointsMaterial({
  size: 0.06,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});
scene.add(new THREE.Points(pgm, pm));

/* Efek latar: cincin berputar dan bentuk melayang. */
var fx = new THREE.Group();
scene.add(fx);

var rA = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 0.014, 8, 140),
  new THREE.MeshBasicMaterial({
    color: 0x2bb8a8,
    transparent: true,
    opacity: 0.7
  })
);
var rB = new THREE.Mesh(
  new THREE.TorusGeometry(2.1, 0.014, 8, 140),
  new THREE.MeshBasicMaterial({
    color: 0xe8559a,
    transparent: true,
    opacity: 0.6
  })
);

rA.position.z = -1;
rB.position.z = -1;
fx.add(rA, rB);

var fgeo = [
  new THREE.IcosahedronGeometry(0.2, 0),
  new THREE.OctahedronGeometry(0.22, 0),
  new THREE.TorusGeometry(0.17, 0.06, 8, 18),
  new THREE.BoxGeometry(0.28, 0.28, 0.28)
];
var fl = [];

for (i = 0; i < 16; i++) {
  var fm2 = new THREE.Mesh(
    fgeo[i % 4],
    new THREE.MeshStandardMaterial({
      color: pal[i % 3],
      flatShading: true,
      roughness: 0.4,
      metalness: 0.2
    })
  );
  var an = i / 16 * 6.283;
  var rad = 2.4 + Math.random() * 1.8;

  fm2.position.set(
    Math.cos(an) * rad,
    Math.sin(an) * rad * 0.8,
    -0.5 - Math.random() * 2.5
  );
  fm2.userData = {
    bx: fm2.position.x,
    by: fm2.position.y,
    ph: Math.random() * 6.28,
    sp: 0.3 + Math.random() * 0.7,
    rx: Math.random() * 0.02 + 0.005,
    ry: Math.random() * 0.02 + 0.005
  };

  fx.add(fm2);
  fl.push(fm2);
}
