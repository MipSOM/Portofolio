/* Lanyard: tali fisika (verlet), motif tali, dan pengait. */
/* lanyard: tali verlet + kartu sebagai batang kaku */
var SEG = 6;
var L = 0.45;
var ANCH = 4.3;
var G = 0.007;
var M = SEG + 2;
var P = [];
var C = [];
var held = -1;
var tgt = null;

for (var i = 0; i < M; i++) {
  var y = i <= SEG ? ANCH - i * L : ANCH - SEG * L - CH;
  P.push({ x: 0, y: y, px: 0, py: y });
}

if (!reduce) {
  P[7].x = P[7].px = 0.5;
}

for (i = 0; i < SEG; i++) {
  C.push([i, i + 1, L, 0]);
}

C.push([SEG, SEG + 1, CH, 0], [SEG - 1, SEG + 1, (L + CH) * 0.92, 1]);

var anchorY = ANCH;

function step() {
  P[0].x = 0;
  P[0].y = anchorY;
  P[0].px = 0;
  P[0].py = anchorY;

  for (var i = 1; i < M; i++) {
    var p = P[i];

    if (i === held) {
      continue;
    }

    var vx = (p.x - p.px) * 0.992;
    var vy = (p.y - p.py) * 0.992;
    p.px = p.x;
    p.py = p.y;
    p.x += vx;
    p.y += vy - G;
  }

  for (var it = 0; it < 14; it++) {
    for (var j = 0; j < C.length; j++) {
      var c = C[j];
      var a = P[c[0]];
      var b = P[c[1]];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var d = Math.hypot(dx, dy) || 1e-6;

      if (c[3] && d >= c[2]) {
        continue;
      }

      var wa = c[0] === 0 || c[0] === held ? 0 : 1;
      var wb = c[1] === held ? 0 : 1;
      var t = wa + wb;

      if (!t) {
        continue;
      }

      var f = (d - c[2]) / d;
      a.x += dx * f * wa / t;
      a.y += dy * f * wa / t;
      b.x -= dx * f * wb / t;
      b.y -= dy * f * wb / t;
    }

    if (held >= 0 && tgt) {
      P[held].x = tgt.x;
      P[held].y = tgt.y;
      P[held].px = tgt.x;
      P[held].py = tgt.y;
    }
  }
}

var N = 7;
var rg = new THREE.BufferGeometry();
var ra = new Float32Array(N * 6);
var rn = new Float32Array(N * 6);
var ru = new Float32Array(N * 4);
var ri = [];

for (i = 0; i < N * 2; i++) {
  rn[i * 3 + 2] = 1;
}

for (i = 0; i < N; i++) {
  var vv = -i * L / 1.35;
  ru[i * 4] = 1;
  ru[i * 4 + 1] = vv;
  ru[i * 4 + 2] = 0;
  ru[i * 4 + 3] = vv;
}

for (i = 0; i < N - 1; i++) {
  var a0 = i * 2;
  ri.push(a0, a0 + 1, a0 + 2, a0 + 1, a0 + 3, a0 + 2);
}

rg.setAttribute("position", new THREE.BufferAttribute(ra, 3));
rg.setAttribute("normal", new THREE.BufferAttribute(rn, 3));
rg.setAttribute("uv", new THREE.BufferAttribute(ru, 2));
rg.setIndex(ri);

var sc2 = document.createElement("canvas");
sc2.width = 96;
sc2.height = 640;

var stt = new THREE.CanvasTexture(sc2);
stt.wrapT = THREE.RepeatWrapping;
stt.encoding = THREE.sRGBEncoding;
stt.anisotropy = 4;

function drawStrap() {
  var x = sc2.getContext("2d");
  x.fillStyle = "#1d2358";
  x.fillRect(0, 0, 96, 640);

  x.fillStyle = "#5ee1d0";
  x.fillRect(0, 0, 10, 640);
  x.fillRect(86, 0, 10, 640);

  x.fillStyle = "#ff6fb5";
  x.fillRect(10, 0, 3, 640);
  x.fillRect(83, 0, 3, 640);

  x.fillStyle = "rgba(255,255,255,.55)";

  for (var y = 6; y < 640; y += 16) {
    x.fillRect(19, y, 2, 9);
    x.fillRect(75, y, 2, 9);
  }

  x.save();
  x.translate(48, 320);
  x.rotate(Math.PI / 2);
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillStyle = "#fff";
  x.font = "800 34px " + FONT;
  x.fillText(st.name.toUpperCase(), -165, 0, 230);
  x.fillText("PORTOFOLIO", 165, 0, 230);

  x.fillStyle = "#ff6fb5";
  x.beginPath();
  x.moveTo(0, -11);
  x.lineTo(11, 0);
  x.lineTo(0, 11);
  x.lineTo(-11, 0);
  x.fill();
  x.restore();
  stt.needsUpdate = true;
}

drawStrap();

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(drawStrap);
}

var rib = new THREE.Mesh(
  rg,
  new THREE.MeshStandardMaterial({
    map: stt,
    side: THREE.DoubleSide,
    roughness: 0.55
  })
);
rib.frustumCulled = false;
root.add(rib);

var crimp = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.1, 0.05),
  metal
);
root.add(crimp);

function ribbon() {
  for (var i = 0; i < N; i++) {
    var p = P[i];
    var q = P[Math.min(i + 1, N - 1)];
    var o = P[Math.max(i - 1, 0)];
    var dx = q.x - o.x;
    var dy = q.y - o.y;
    var d = Math.hypot(dx, dy) || 1;
    var w = 0.1;
    var nx = -dy / d * w;
    var ny = dx / d * w;

    ra[i * 6] = p.x + nx;
    ra[i * 6 + 1] = p.y + ny;
    ra[i * 6 + 3] = p.x - nx;
    ra[i * 6 + 4] = p.y - ny;
  }

  rg.attributes.position.needsUpdate = true;

  var a5 = P[SEG - 1];
  var a6 = P[SEG];
  crimp.position.set(
    a5.x * 0.35 + a6.x * 0.65,
    a5.y * 0.35 + a6.y * 0.65,
    0.03
  );
  crimp.rotation.z = -Math.atan2(a6.x - a5.x, a6.y - a5.y);
}
