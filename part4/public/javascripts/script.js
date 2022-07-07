var mymap = L.map("worldmap", {
    center: [48.866667, 2.333333],
    zoom: 13,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(mymap);

L.marker([48.85837, 2.294481]).addTo(mymap);
