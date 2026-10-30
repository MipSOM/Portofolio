/* Ukuran layar, scroll, dan input (seret / ketuk kartu). */
/* ---------- ukuran & input ---------- */
var mx = 0;
var sy = 0;
var flip = 0;
var flipCur = 0;
var twist = 0;
var lastx = 0;
var d0 = null;
var sc = 1;
var fxY = 0;

function size() {
  var w = innerWidth;
  var h = innerHeight;

  r.setSize(w, h, false);
  cam.aspect = w / h;
  cam.updateProjectionMatrix();

  var wide = w > 860;
  sc = wide ? 1 : 0.62;
  root.scale.setScalar(sc);
  root.position.set(wide ? 2.3 : 0, wide ? -0.4 : -1.35, 0);
  fx.scale.setScalar(sc);
  fx.position.set(root.position.x, 0, 0);
  fxY = root.position.y + 0.45 * sc;
  K = 7.46 / h / sc;
}

addEventListener("resize", size);
size();

addEventListener("scroll", function () {
  sy = scrollY;
}, { passive: true });

var ray = new THREE.Raycaster();
var v = new THREE.Vector2();
var pl = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var pt = new THREE.Vector3();

function cast(e) {
  v.set(
    e.clientX / innerWidth * 2 - 1,
    -(e.clientY / innerHeight) * 2 + 1
  );
  ray.setFromCamera(v, cam);
}

function local(e) {
  cast(e);
  ray.ray.intersectPlane(pl, pt);

  return {
    x: (pt.x - root.position.x) / sc,
    y: (pt.y - root.position.y) / sc
  };
}

function skip(e) {
  return e.target.closest && e.target.closest("a,button,input,label,nav");
}

addEventListener("pointerdown", function (e) {
  if (skip(e)) {
    return;
  }

  cast(e);
  root.updateMatrixWorld(true);

  if (!ray.intersectObject(body).length) {
    return;
  }

  var l = local(e);
  held = l.y > (P[SEG].y + P[SEG + 1].y) / 2 ? SEG : SEG + 1;
  tgt = l;
  d0 = {
    x: e.clientX,
    y: e.clientY,
    t: performance.now()
  };
  document.body.style.cursor = "grabbing";
  e.preventDefault();
});

addEventListener("pointermove", function (e) {
  mx = e.clientX / innerWidth * 2 - 1;

  if (held >= 0) {
    tgt = local(e);
    return;
  }

  if (e.pointerType === "touch" || skip(e)) {
    return;
  }

  cast(e);
  document.body.style.cursor = ray.intersectObject(body).length ? "grab" : "";
});

function up(e) {
  if (held < 0) {
    return;
  }

  if (
    d0
    && Math.hypot(e.clientX - d0.x, e.clientY - d0.y) < 8
    && performance.now() - d0.t < 300
  ) {
    flip += Math.PI;
  }

  held = -1;
  tgt = null;
  document.body.style.cursor = "";
}

addEventListener("pointerup", up);
addEventListener("pointercancel", up);

function blockTouch(e) {
  if (held >= 0) {
    e.preventDefault();
  }
}

document.addEventListener("touchstart", blockTouch, { passive: false });
document.addEventListener("touchmove", blockTouch, { passive: false });
