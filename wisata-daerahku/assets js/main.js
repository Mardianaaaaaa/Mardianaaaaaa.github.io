
const destinations = {
    kuta: {
      name: "Pantai Kuta Lombok",
      location: "Kuta, Lombok Tengah, Nusa Tenggara Barat",
      desc: "Pantai Kuta Lombok memiliki pasir putih halus seperti merica dan air laut yang jernih. Cocok untuk bersantai dan menikmati pemandangan perbukitan hijau di sekitarnya.",
      image: "img/kuta.jpg",
      lat: -8.8947,
      lon: 116.2738
    },
    rinjani: {
      name: "Gunung Rinjani",
      location: "Kabupaten Lombok Timur, Nusa Tenggara Barat",
      desc: "Gunung Rinjani merupakan gunung tertinggi kedua di Indonesia yang menawarkan pemandangan menakjubkan dengan Danau Segara Anak di puncaknya. Pendakian Rinjani memberikan pengalaman tak terlupakan bagi para pecinta alam.",
      image: "img/rinjani.avif",
      lat: -8.4114,
      lon: 116.4575
    },
    gili: {
      name: "Gili Trawangan",
      location: "Kepulauan Gili, Lombok Utara, Nusa Tenggara Barat",
      desc: "Gili Trawangan terkenal dengan pantainya yang jernih, kehidupan malam yang meriah, serta aktivitas snorkeling dan diving yang menakjubkan. Tidak ada kendaraan bermotor di pulau ini, menjadikannya tempat yang tenang dan asri.",
      image: "img/gili.jpg",
      lat: -8.3515,
      lon: 116.0405
    }
  };

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const dest = destinations[id] || destinations.kuta;

  document.getElementById("destName").textContent = dest.name;
  document.getElementById("destLocation").textContent = "📍 " + dest.location;
  document.getElementById("destDesc").textContent = dest.desc;
  document.getElementById("destImage").src = dest.image;

  document.getElementById("map").innerHTML =
    `<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${dest.lon - 0.05}%2C${dest.lat - 0.05}%2C${dest.lon + 0.05}%2C${dest.lat + 0.05}&layer=mapnik&marker=${dest.lat}%2C${dest.lon}" class="w-full h-full rounded-lg border-0"></iframe>`;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${dest.lat}&longitude=${dest.lon}&current_weather=true`)
    .then(res => res.json())
    .then(data => {
      if (!data.current_weather) {
        document.getElementById("weatherStatus").textContent = "Gagal memuat cuaca.";
        return;
      }
      const temp = data.current_weather.temperature;
      const code = data.current_weather.weathercode;
      const weatherMap = { 0: "Cerah ☀️", 1: "Hampir Cerah 🌤️", 2: "Sebagian Berawan ⛅", 3: "Mendung ☁️", 61: "Hujan Ringan 🌧️", 63: "Hujan Sedang 🌧️", 65: "Hujan Lebat 🌧️" };
      const weather = weatherMap[code] || "Kondisi tidak diketahui";
      document.getElementById("weatherStatus").textContent = `${weather} | Suhu: ${temp}°C`;
    })
    .catch(() => document.getElementById("weatherStatus").textContent = "Gagal memuat cuaca.");

  const form = document.getElementById('costForm');
  const result = document.getElementById('costResult');
  const rates = { motor: 15000, mobil: 30000, bus: 25000 };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const distance = parseFloat(form.distance.value);
    const transport = form.transport.value;
    if (!distance || distance <= 0 || !transport) {
      result.textContent = "⚠️ Lengkapi semua data dengan benar!";
      result.classList.add('text-red-600');
      return;
    }
    const total = distance * rates[transport];
    result.textContent = `💰 Estimasi biaya perjalanan: Rp ${total.toLocaleString('id-ID')}`;
    result.classList.remove('text-red-600');
  });

  const contactReviewBtn = document.getElementById('contactReviewBtn');
  contactReviewBtn.href = `kontak-ulasan.html?id=${id}`;

  const reviewList = document.getElementById('reviewList');
  const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`) || "[]");
  storedReviews.forEach(r => {
    const div = document.createElement('div');
    div.className = 'bg-white p-3 rounded-lg shadow';
    div.innerHTML = `
      <p class="font-semibold text-indigo-800">${r.name} <span class="text-sm text-gray-500">(${r.email})</span></p>
      <p>${r.message}</p>
      <p class="text-yellow-500 mt-1">${'⭐'.repeat(r.rating)}</p>
    `;
    reviewList.appendChild(div);
  });