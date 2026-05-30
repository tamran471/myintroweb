const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
requestAnimationFrame(() => {
  document.querySelectorAll(".reveal").forEach((item) => {
    const box = item.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) item.classList.add("visible");
  });
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const box = button.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    button.style.transform = `translate(${x * .08}px, ${y * .12}px)`;
  });
  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project-detail");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projects.forEach((project) => {
      const categories = project.dataset.category || "";
      project.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

const form = document.querySelector("#contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const data = new FormData(form);
    const subject = data.get("subject") || "Website Inquiry";
    const email = data.get("email") || "Not provided";
    const rawMessage = `Website Inquiry\n\nName: ${data.get("name")}\nEmail: ${email}\nSubject: ${subject}\nProject Type: ${data.get("type")}\n\nMessage:\n${data.get("message")}`;
    const message = encodeURIComponent(rawMessage);
    const note = form.querySelector(".form-note");
    if (submitter?.value === "email") {
      if (note) note.textContent = "Opening your email app with the prepared message.";
      window.location.href = `mailto:tamranshahid18@gmail.com?subject=${encodeURIComponent(subject)}&body=${message}`;
    } else {
      if (note) note.textContent = "Opening WhatsApp with the prepared message.";
      window.location.href = `https://wa.me/923026710923?text=${message}`;
    }
  });
}

const canvas = document.querySelector("#network-bg");
const ctx = canvas?.getContext("2d");
let nodes = [];
let width = 0;
let height = 0;
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.max(55, Math.min(115, Math.floor(width * height / 15000)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - .5) * .45,
    vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.8 + .7
  }));
}

function drawNetwork() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  const maxDistance = width < 700 ? 95 : 135;

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    if (pointer.active) {
      const dx = node.x - pointer.x;
      const dy = node.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < 145) {
        node.x += dx / distance * .38;
        node.y += dy / distance * .38;
      }
    }
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < maxDistance) {
        ctx.strokeStyle = `rgba(57, 214, 255, ${1 - distance / maxDistance})`;
        ctx.lineWidth = .55;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((node, index) => {
    ctx.fillStyle = index % 5 === 0 ? "rgba(80, 240, 160, .88)" : "rgba(238, 247, 255, .72)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawNetwork);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
drawNetwork();
