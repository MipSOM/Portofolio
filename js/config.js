/* Data profil. Ubah di sini agar tampil konsisten di semua halaman. */
var st = {
  name: "Miftahul Huda",
  role: "UI/UX Design",
  id: "Portofolio 2026",
  email: "heromiftah2004@gmail.com",
  photo: null,
  photoURL: "assets/images/foto.png" /* taruh fotomu di folder assets/images */
};

var heading = document.getElementById("h1");

if (heading) {
  heading.textContent = "Halo, saya " + st.name + ".";
}

document.querySelectorAll("[data-profile-name]").forEach(function (element) {
  element.textContent = st.name;
});

var mail = document.querySelector(".mail");

if (mail) {
  mail.href = "mailto:" + st.email;
  mail.textContent = st.email;
}

if (document.querySelector("[data-profile-title]")) {
  document.title = "Portofolio – " + st.name;
}
