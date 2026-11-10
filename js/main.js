// ---------- Coordonnées (à modifier ici, elles se mettent à jour partout) ----------
const CONTACT = {
  instagram: "celiadrc_",
  tiktok: "celiadrc_",
  email: "celiadecraene.pro@gmail.com",
  telephone: "06 29 61 41 40",
};

// ---------- Formulaire de contact : clé Web3Forms ----------
// Clé gratuite à créer sur https://web3forms.com avec l'adresse qui doit recevoir les messages.
const WEB3FORMS_KEY = "COLLE-TA-CLE-WEB3FORMS-ICI";

const PAGES = [
  { href: "index.html", label: "Accueil" },
  { href: "programmation.html", label: "Programmation & Coaching" },
  { href: "cours-collectifs.html", label: "Cours collectifs" },
  { href: "boutique.html", label: "Boutique" },
  { href: "contact.html", label: "Contact & Partenaires" },
];

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = currentPage();
  el.className = "header";
  el.innerHTML = `
    <div class="container">
      <a class="logo" href="index.html"><img src="images/logo.png" alt="Céliadrc Fitness"></a>
      <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
      <ul class="nav">
        ${PAGES.map(
          (p) => `<li><a href="${p.href}" class="${p.href === page ? "active" : ""}">${p.label}</a></li>`
        ).join("")}
      </ul>
    </div>`;
  const burger = el.querySelector(".burger");
  const nav = el.querySelector(".nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.textContent = open ? "✕" : "☰";
  });
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const tel = CONTACT.telephone.replace(/\s/g, "");
  el.className = "footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="index.html"><img src="images/logo.png" alt="Céliadrc Fitness"></a>
          <p style="margin-top:12px;max-width:340px">Coach sportive & préparatrice physique — programmation, coaching personnalisé et cours collectifs.</p>
        </div>
        <div>
          <h4>Pages</h4>
          <ul>${PAGES.map((p) => `<li><a href="${p.href}">${p.label}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Me suivre</h4>
          <ul>
            <li><a href="https://www.instagram.com/${CONTACT.instagram}/" target="_blank" rel="noopener">Instagram · @${CONTACT.instagram}</a></li>
            <li><a href="https://www.tiktok.com/@${CONTACT.tiktok}" target="_blank" rel="noopener">TikTok · @${CONTACT.tiktok}</a></li>
            <li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li>
            <li><a href="tel:${tel}">${CONTACT.telephone}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Céliadrc Fitness · Célia De Craene — Coach sportive diplômée BPJEPS AF & DEJEPS HMFA<br>
        <a href="mentions-legales.html">Mentions légales</a> · <a href="confidentialite.html">Politique de confidentialité</a>
      </div>
    </div>`;
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  items.forEach((i) => io.observe(i));
}

// ---------- Formulaire de contact ----------
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  // Pré-remplissage depuis la boutique : contact.html?offre=...
  const offre = new URLSearchParams(location.search).get("offre");
  if (offre) {
    form.sujet.value = "Boutique";
    form.message.value = `Bonjour Célia,\n\nJe suis intéressé(e) par l'offre « ${offre} ».\n\n`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.className = "form-status";
    // Champ piège rempli = robot : on fait semblant que tout va bien
    if (data.site_web) {
      status.textContent = "Merci ! Ton message a bien été envoyé, je te réponds très vite 😊";
      status.className = "form-status ok";
      form.reset();
      btn.disabled = false;
      return;
    }
    let res = null;
    if (!WEB3FORMS_KEY.startsWith("COLLE")) {
      try {
        // Envoi via Web3Forms : le message arrive directement par e-mail
        res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `[Site] ${data.sujet} — ${data.nom}`,
            from_name: "Site celiadrcfitness.fr",
            replyto: data.email,
            "Nom et prénom": data.nom,
            "E-mail": data.email,
            "Téléphone": data.telephone || "—",
            "Demande": data.sujet,
            "Message": data.message,
          }),
        });
      } catch {
        res = null;
      }
    }
    if (res) {
      // Web3Forms a répondu : on affiche son verdict
      const out = await res.json().catch(() => ({ success: false }));
      if (res.ok && out.success) {
        status.textContent = "Merci ! Ton message a bien été envoyé, je te réponds très vite 😊";
        status.className = "form-status ok";
        form.reset();
      } else {
        status.textContent = "Une erreur est survenue, réessaie ou écris-moi directement par e-mail.";
        status.className = "form-status err";
      }
      btn.disabled = false;
      return;
    }
    // Si le serveur n'est pas joignable, on passe par la messagerie du visiteur
    const body = `Nom : ${data.nom}\nE-mail : ${data.email}\nTéléphone : ${data.telephone}\n\n${data.message}`;
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("[Site] " + data.sujet)}&body=${encodeURIComponent(body)}`;
    status.textContent = "Ta messagerie va s'ouvrir pour envoyer le message.";
    status.className = "form-status err";
    btn.disabled = false;
  });
}

// Remplit les liens de contact marqués data-contact="email|telephone|instagram|tiktok"
function fillContactLinks() {
  document.querySelectorAll("[data-contact]").forEach((a) => {
    const key = a.dataset.contact;
    const val = CONTACT[key];
    if (key === "email") a.href = `mailto:${val}`;
    if (key === "telephone") a.href = `tel:${val.replace(/\s/g, "")}`;
    if (key === "instagram") a.href = `https://www.instagram.com/${val}/`;
    if (key === "tiktok") a.href = `https://www.tiktok.com/@${val}`;
    const label = a.querySelector(".val");
    if (label) label.textContent = key === "instagram" || key === "tiktok" ? "@" + val : val;
  });
}

function setupCopy() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = "Copié ✓";
        setTimeout(() => (btn.textContent = old), 1800);
      } catch {}
    });
  });
}

// Retire les photos/logos manquants pour laisser apparaître l'emplacement
function setupImageFallbacks() {
  document.querySelectorAll(".photo img, .partner-logo img").forEach((img) => {
    const remove = () => img.remove();
    if (img.complete && img.naturalWidth === 0) remove();
    else img.addEventListener("error", remove);
  });
}

setupImageFallbacks();
renderHeader();
renderFooter();
fillContactLinks();
setupReveal();
setupContactForm();
setupCopy();
