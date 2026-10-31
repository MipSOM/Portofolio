/* Halaman proyek: filter kategori, pencarian, kartu miring 3D, dan jendela detail. */
(function () {
  var $ = function (s) {
    return document.querySelector(s);
  };
  var grid = $("#grid");
  var chips = $("#chips");
  var q = $("#q");
  var count = $("#count");
  var empty = $("#empty");
  var dlg = $("#dlg");
  var mm = window.matchMedia || function () {
    return { matches: false };
  };
  var tilt = mm("(hover: hover) and (pointer: fine)").matches
    && !mm("(prefers-reduced-motion: reduce)").matches;
  var cur = "Semua";
  var term = "";
  var cats = ["Semua"].concat(
    PROJECTS
      .map(function (p) {
        return p.category;
      })
      .filter(function (c, i, a) {
        return a.indexOf(c) === i;
      })
  );

  function h(tag, cls, text) {
    var e = document.createElement(tag);

    if (cls) {
      e.className = cls;
    }

    if (text !== undefined) {
      e.textContent = text;
    }

    return e;
  }

  function tagList(p) {
    var w = h("div", "tags");

    p.tags.forEach(function (t) {
      w.appendChild(h("span", "tag", t));
    });

    return w;
  }

  function card(p) {
    var a = h("article", "card");
    a.tabIndex = 0;
    a.setAttribute("role", "button");
    a.setAttribute("aria-label", "Buka detail " + p.title);
    a.style.setProperty("--c", p.color);

    var im = h("img", "thumb");
    im.src = p.thumb;
    im.alt = "";
    im.loading = "lazy";

    var b = h("div", "cbody");
    var m = h("div", "meta");
    m.appendChild(h("span", "cat", p.category));
    m.appendChild(h("span", "yr", String(p.year)));
    b.appendChild(m);
    b.appendChild(h("h3", "", p.title));
    b.appendChild(h("p", "", p.desc));
    b.appendChild(tagList(p));
    a.appendChild(im);
    a.appendChild(b);

    a.addEventListener("click", function () {
      openDetail(p);
    });
    a.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail(p);
      }
    });

    if (tilt) {
      a.addEventListener("pointermove", function (e) {
        var r = a.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;

        a.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
        a.style.setProperty("--ry", ((x - 0.5) * 12).toFixed(2) + "deg");
        a.style.setProperty("--mx", (x * 100).toFixed(0) + "%");
        a.style.setProperty("--my", (y * 100).toFixed(0) + "%");
      });
      a.addEventListener("pointerleave", function () {
        a.style.setProperty("--rx", "0deg");
        a.style.setProperty("--ry", "0deg");
      });
    }

    return a;
  }

  function render() {
    var t = term.toLowerCase();
    var list = PROJECTS.filter(function (p) {
      if (cur !== "Semua" && p.category !== cur) {
        return false;
      }

      return !t
        || (p.title + " " + p.desc + " " + p.category + " " + p.tags.join(" "))
          .toLowerCase()
          .indexOf(t) > -1;
    }).sort(function (a, b) {
      return b.year - a.year;
    });

    grid.textContent = "";
    list.forEach(function (p) {
      grid.appendChild(card(p));
    });
    empty.hidden = list.length > 0;
    count.textContent = list.length
      + " dari "
      + PROJECTS.length
      + " proyek"
      + (cur !== "Semua" ? " di kategori " + cur : "");
  }

  cats.forEach(function (c) {
    var b = h("button", "chip", c);
    b.type = "button";
    b.setAttribute("aria-pressed", c === cur);
    b.addEventListener("click", function () {
      cur = c;
      chips.querySelectorAll(".chip").forEach(function (x) {
        x.setAttribute("aria-pressed", x === b);
      });
      render();
    });
    chips.appendChild(b);
  });

  q.addEventListener("input", function () {
    term = q.value.trim();
    render();
  });

  function openDetail(p) {
    var image = $("#dimg");
    var video = $("#dvideo");

    if (p.video) {
      image.hidden = true;
      video.hidden = false;
      video.src = p.video;
      video.poster = p.thumb;
      video.load();
    } else {
      stopVideo();
      image.hidden = false;
      image.src = p.thumb;
    }

    $("#dtitle").textContent = p.title;
    $("#dmeta").textContent = p.category + " · " + p.year + " · " + p.role;
    $("#ddesc").textContent = p.detail;

    var t = $("#dtags");
    t.textContent = "";
    p.tags.forEach(function (x) {
      t.appendChild(h("span", "tag", x));
    });

    var l = $("#dlinks");
    l.textContent = "";

    [["Lihat demo", p.demo, "btn p"], ["Kode sumber", p.repo, "btn"]]
      .forEach(function (k) {
        if (!k[1]) {
          return;
        }

        var a = h("a", k[2], k[0]);
        a.href = k[1];
        a.target = "_blank";
        a.rel = "noopener";
        l.appendChild(a);
      });

    dlg.style.setProperty("--c", p.color);

    if (dlg.showModal) {
      dlg.showModal();
    } else {
      dlg.setAttribute("open", "");
    }
  }

  function stopVideo() {
    var video = $("#dvideo");
    video.pause();
    video.removeAttribute("src");
    video.removeAttribute("poster");
    video.load();
    video.hidden = true;
  }

  function closeDetail() {
    stopVideo();

    if (dlg.close) {
      dlg.close();
    } else {
      dlg.removeAttribute("open");
    }
  }

  $("#dclose").addEventListener("click", closeDetail);
  dlg.addEventListener("close", stopVideo);
  dlg.addEventListener("click", function (e) {
    if (e.target === dlg) {
      closeDetail();
    }
  });
  render();
})();
