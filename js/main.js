/* Loop animasi utama. */
/* ---------- loop ---------- */
var last = 0;
var acc = 0;

function tick(t) {
  var dt = Math.min((t - last) / 1000, 0.05);
  last = t;
  acc += dt;
  anchorY = ANCH + sy * K;

  while (acc >= 1 / 60) {
    step();
    acc -= 1 / 60;
  }

  var cx = (P[SEG].x + P[SEG + 1].x) / 2;
  var cy = (P[SEG].y + P[SEG + 1].y) / 2;
  card.position.set(cx, cy, 0);
  card.rotation.z = -Math.atan2(
    P[SEG].x - P[SEG + 1].x,
    P[SEG].y - P[SEG + 1].y
  );

  var vel = cx - lastx;
  lastx = cx;
  twist += (Math.max(-0.7, Math.min(0.7, -vel * 9)) - twist) * 0.1;
  flipCur += (flip - flipCur) * 0.1;
  card.rotation.y = flipCur + twist
    + (reduce ? 0 : Math.sin(t * 0.0008) * 0.07)
    + mx * 0.1;
  ribbon();

  var s = t * 0.001;

  if (!reduce) {
    rA.rotation.x = 1.1 + s * 0.25;
    rA.rotation.y = s * 0.18;
    rB.rotation.x = -0.8;
    rB.rotation.y = s * 0.3;
    rB.rotation.z = s * 0.15;

    for (var q = 0; q < fl.length; q++) {
      var o = fl[q];
      var u = o.userData;
      o.position.y = u.by + Math.sin(s * u.sp + u.ph) * 0.35;
      o.position.x = u.bx + Math.cos(s * u.sp * 0.8 + u.ph) * 0.15;
      o.rotation.x += u.rx;
      o.rotation.y += u.ry;
    }

    var pa = pgm.attributes.position.array;

    for (q = 0; q < pcount; q++) {
      pa[q * 3 + 1] += 0.006 + (q % 5) * 0.002;

      if (pa[q * 3 + 1] > 5.2) {
        pa[q * 3 + 1] = -5.2;
      }
    }

    pgm.attributes.position.needsUpdate = true;
  }

  fx.rotation.y += (mx * 0.25 - fx.rotation.y) * 0.05;
  fx.position.y = fxY + sy * K * sc * 0.6;
  r.render(scene, cam);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
