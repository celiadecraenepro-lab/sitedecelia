// ---------- Catalogue de la boutique ----------
// Pour afficher un prix, remplace null par le montant, par exemple : prix: 49
const BOUTIQUE = [
  {
    id: "home",
    titre: "Home Programmation",
    icone: "🏠",
    description: "S'entraîner à la maison, sans matériel lourd.",
    produits: [
      { nom: "Home Programmation · 4 semaines", perso: false, prix: null },
      { nom: "Home Programmation · 6 semaines", perso: false, prix: null },
      { nom: "Home Programmation · 4 semaines", perso: true, prix: null },
      { nom: "Home Programmation · 6 semaines", perso: true, prix: null },
    ],
  },
  {
    id: "salle",
    titre: "Programmation en salle",
    icone: "🏋️‍♀️",
    description: "Des séances structurées pour progresser en salle de sport.",
    produits: [
      { nom: "Programmation en salle · 4 semaines", perso: false, prix: null },
      { nom: "Programmation en salle · 6 semaines", perso: false, prix: null },
      { nom: "Programmation en salle · 4 semaines", perso: true, prix: null },
      { nom: "Programmation en salle · 6 semaines", perso: true, prix: null },
    ],
  },
  {
    id: "pilates",
    titre: "Pilates Programmation",
    icone: "🧘‍♀️",
    description: "Gainage, posture et mobilité avec la méthode Pilates.",
    produits: [
      { nom: "Pilates Programmation · 4 semaines", perso: false, prix: null },
      { nom: "Pilates Programmation · 4 semaines", perso: true, prix: null },
    ],
  },
  {
    id: "coaching",
    titre: "Coaching personnalisé",
    icone: "⚡",
    description: "Réduction appliquée lors de l'achat d'une formule coaching + une formule programmation !",
    produits: [
      { nom: "1h de coaching personnalisé", perso: true, prix: null, info: "Séance individuelle" },
      { nom: "4 × 1h de coaching personnalisé", perso: true, prix: null, info: "Pack 4 séances" },
      { nom: "8 × 1h de coaching personnalisé", perso: true, prix: null, info: "Pack 8 séances" },
    ],
  },
  {
    id: "collectifs",
    titre: "Cours collectifs",
    icone: "🎵",
    description: "Prestation de cours collectifs en auto-entrepreneur, pour votre salle, structure ou à domicile.",
    produits: [
      { nom: "Prestation de cours collectifs", perso: null, prix: null, info: "Tarif sur devis — contactez-moi !", contact: true },
    ],
  },
];

function productCard(p) {
  const tag =
    p.perso === null ? `<span class="tag perso">Sur devis</span>`
    : p.perso ? `<span class="tag perso">Personnalisé</span>`
    : `<span class="tag">Non personnalisé</span>`;
  const label = p.perso === null ? p.nom : `${p.nom} (${p.perso ? "personnalisé" : "non personnalisé"})`;
  const meta = p.info || (p.perso
    ? "Programme construit sur-mesure selon ton profil, ton niveau et ton objectif."
    : "Programme clé en main, prêt à démarrer, adapté à tous les niveaux.");
  const prix = p.prix != null ? `${p.prix} €` : p.contact ? "Sur devis" : `<small>Prix sur demande</small>`;
  return `
    <article class="product">
      ${tag}
      <h3>${p.nom}</h3>
      <p class="meta">${meta}</p>
      <div class="price">${prix}</div>
      <a class="btn btn-primary btn-small" href="contact.html?offre=${encodeURIComponent(label)}">
        ${p.contact ? "Contactez-moi" : "Je suis intéressé(e)"}
      </a>
    </article>`;
}

function renderBoutique() {
  const root = document.getElementById("boutique");
  const filters = document.getElementById("filters");

  root.innerHTML = BOUTIQUE.map(
    (g) => `
    <div class="shop-group" data-group="${g.id}">
      <h2><span>${g.icone}</span> ${g.titre}</h2>
      <p>${g.description}</p>
      <div class="products">${g.produits.map(productCard).join("")}</div>
    </div>`
  ).join("");

  filters.innerHTML =
    `<button class="filter active" data-filter="all">Tout voir</button>` +
    BOUTIQUE.map((g) => `<button class="filter" data-filter="${g.id}">${g.titre}</button>`).join("");

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    filters.querySelectorAll(".filter").forEach((b) => b.classList.toggle("active", b === btn));
    root.querySelectorAll(".shop-group").forEach((g) => {
      g.style.display = btn.dataset.filter === "all" || g.dataset.group === btn.dataset.filter ? "" : "none";
    });
  });
}

renderBoutique();
