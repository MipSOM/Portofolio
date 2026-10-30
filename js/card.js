/* Kartu ID: tekstur depan/belakang (canvas) dan model 3D. */
/* ---------- tekstur kartu ---------- */
var CW = 1.5;
var CH = 2.3;
var TW = 512;
var TH = 785;

function mk() {
  var c = document.createElement("canvas");
  c.width = TW;
  c.height = TH;
  return c;
}

var fc = mk();
var bc = mk();
var ft = new THREE.CanvasTexture(fc);
var bt = new THREE.CanvasTexture(bc);

ft.encoding = bt.encoding = THREE.sRGBEncoding;
ft.anisotropy = bt.anisotropy = 4;

function rr(x, a, b, w, h, q) {
  x.beginPath();
  x.moveTo(a + q, b);
  x.arcTo(a + w, b, a + w, b + h, q);
  x.arcTo(a + w, b + h, a, b + h, q);
  x.arcTo(a, b + h, a, b, q);
  x.arcTo(a, b, a + w, b, q);
  x.closePath();
}

function bars(x, X, Y, W, H, col) {
  var s = 7;
  x.fillStyle = col;

  for (var i = 0, p = 0; p < W; i++) {
    var w = 1 + (s = (s * 37 + 11) % 7) % 3 * 2;

    if (i % 2 === 0) {
      x.fillRect(X + p, Y, w, H);
    }

    p += w + 2;
  }
}

var FONT = '"Bricolage Grotesque",system-ui,sans-serif';

function drawFront() {
  var x = fc.getContext("2d");
  x.clearRect(0, 0, TW, TH);
  x.save();
  rr(x, 0, 0, TW, TH, 41);
  x.clip();

  var g = x.createLinearGradient(0, 0, TW, TH);
  g.addColorStop(0, "#141a3a");
  g.addColorStop(1, "#0c3a42");
  x.fillStyle = g;
  x.fillRect(0, 0, TW, TH);

  x.fillStyle = "rgba(0,0,0,.5)";
  rr(x, TW / 2 - 48, 28, 96, 20, 10);
  x.fill();

  x.save();
  rr(x, 56, 86, 400, 420, 28);
  x.clip();

  if (st.photo) {
    x.drawImage(st.photo, 56, 86);
  } else {
    x.fillStyle = "#27305c";
    x.fillRect(56, 86, 400, 420);
    x.fillStyle = "#4a5590";
    x.beginPath();
    x.arc(256, 264, 80, 0, 7);
    x.fill();
    x.beginPath();
    x.ellipse(256, 470, 150, 120, 0, 0, 7);
    x.fill();
  }

  x.restore();
  x.fillStyle = "#5ee1d0";
  x.fillRect(56, 540, 72, 6);
  x.fillStyle = "#fff";
  x.font = "800 46px " + FONT;
  x.fillText(st.name, 56, 606, 400);
  x.fillStyle = "#aeb8e4";
  x.font = "500 26px " + FONT;
  x.fillText(st.role, 56, 646, 400);
  x.fillStyle = "#ff6fb5";
  x.font = "500 20px " + FONT;
  x.fillText(st.id, 56, 694);
  bars(x, 56, 712, 400, 40, "#e9edfb");
  x.restore();
  ft.needsUpdate = true;
}

function drawBack() {
  var x = bc.getContext("2d");
  x.clearRect(0, 0, TW, TH);
  x.save();
  rr(x, 0, 0, TW, TH, 41);
  x.clip();
  x.fillStyle = "#f1f4fb";
  x.fillRect(0, 0, TW, TH);
  x.fillStyle = "#171a33";
  x.fillRect(0, 0, TW, 18);
  x.font = "800 44px " + FONT;
  x.fillText("Hubungi saya", 56, 150);
  x.fillStyle = "#555b7a";
  x.font = "500 26px " + FONT;
  x.fillText(st.email, 56, 210, 400);
  x.fillText("Indonesia", 56, 250);
  x.fillStyle = "#d6336c";
  x.fillRect(56, 290, 72, 6);
  x.fillStyle = "#555b7a";
  x.font = "500 22px " + FONT;
  x.fillText("Kartu ini milik pemegang portofolio.", 56, 350, 400);
  bars(x, 56, 640, 400, 80, "#171a33");
  x.restore();
  bt.needsUpdate = true;
}

function redraw() {
  drawFront();
  drawBack();
}

redraw();

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(redraw);
}

function setPhoto(img) {
  var c = document.createElement("canvas");
  c.width = 400;
  c.height = 420;

  var x = c.getContext("2d");
  var s = Math.max(400 / img.width, 420 / img.height);
  var w = img.width * s;
  var h = img.height * s;

  x.drawImage(img, (400 - w) / 2, (420 - h) * 0.35, w, h);

  try {
    c.getContext("2d").getImageData(0, 0, 1, 1);
  } catch (e) {
    console.warn("Foto tidak bisa dipakai lewat file://. Jalankan lewat server lokal (lihat README).");
    return;
  }

  st.photo = c;
  redraw();
}

if (st.photoURL) {
  var im = new Image();
  im.onload = function () {
    setPhoto(im);
  };
  im.src = st.photoURL;
}

/* ---------- model 3D ---------- */
var root = new THREE.Group();
var card = new THREE.Group();
card.rotation.order = "ZYX";
root.add(card);
scene.add(root);

function shape(w, h, q) {
  var s = new THREE.Shape();
  var x = -w / 2;
  var y = -h / 2;

  s.moveTo(x + q, y);
  s.lineTo(x + w - q, y);
  s.quadraticCurveTo(x + w, y, x + w, y + q);
  s.lineTo(x + w, y + h - q);
  s.quadraticCurveTo(x + w, y + h, x + w - q, y + h);
  s.lineTo(x + q, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - q);
  s.lineTo(x, y + q);
  s.quadraticCurveTo(x, y, x + q, y);

  return s;
}

var bg = new THREE.ExtrudeGeometry(shape(CW, CH, 0.12), {
  depth: 0.05,
  bevelEnabled: false
});
bg.translate(0, 0, -0.025);

var body = new THREE.Mesh(
  bg,
  new THREE.MeshStandardMaterial({
    color: 0x0e1330,
    roughness: 0.4,
    metalness: 0.2
  })
);
card.add(body);

var pg = new THREE.PlaneGeometry(CW, CH);
var fm = new THREE.Mesh(
  pg,
  new THREE.MeshStandardMaterial({
    map: ft,
    transparent: true,
    roughness: 0.45
  })
);
fm.position.z = 0.026;

var bm = new THREE.Mesh(
  pg,
  new THREE.MeshStandardMaterial({
    map: bt,
    transparent: true,
    roughness: 0.45
  })
);
bm.position.z = -0.026;
bm.rotation.y = Math.PI;
card.add(fm, bm);

var metal = new THREE.MeshStandardMaterial({
  color: 0xc9d0e6,
  metalness: 0.9,
  roughness: 0.3
});
var clip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.08), metal);
clip.position.set(0, CH / 2 + 0.02, 0);

var ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 10, 24), metal);
ring.position.set(0, CH / 2 + 0.17, 0);
card.add(clip, ring);
