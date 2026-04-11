const RESPONSES = [
  {
    q: /program|code|sdk/i,
    a: "NEXUS robots ship with the NEXUS Studio SDK, simulation assets, and safety-certified motion APIs. You can train behaviors in simulation, then deploy with signed bundles to your fleet.",
  },
  {
    q: /warranty|repair/i,
    a: "Hardware carries a 24-month limited warranty with advance replacement options for enterprise plans. Extended coverage and on-site service tiers are available at checkout.",
  },
  {
    q: /custom|after|post/i,
    a: "Yes. You can upgrade perception packs, end-effectors, and software modules post-purchase. The Builder captures your baseline so our team can quote deltas without rework.",
  },
  {
    q: /warehouse|best/i,
    a: "For dense palletizing and heavy payloads, TITAN-X7 is the default recommendation. For mixed-SKU lines with tight aisles, we often pair AURA-3 for buffering and TITAN-X7 for lift cells.",
  },
  {
    q: /payment|finance|lease/i,
    a: "We accept wire, ACH, and major cards for deposits. Enterprise customers can structure milestone billing, leasing through partner banks, or usage-based add-ons for cloud analytics.",
  },
];

function matchResponse(text) {
  const t = text.trim();
  for (const r of RESPONSES) {
    if (r.q.test(t)) return r.a;
  }
  return "Thanks for your question. A NEXUS specialist can provide a precise answer for your deployment region and compliance tier. Meanwhile, browse the FAQ categories below or contact enterprise sales from the Shop page.";
}

export function renderFaq(root) {
  root.innerHTML = `
    <section class="section faq-page">
      <div class="faq-hero reveal">
        <h1>Ask NEXUS <span class="typing-cursor">AI</span></h1>
        <p style="color:var(--text-muted);max-width:520px;margin:0 auto;">Search policy, programming, and product answers. Responses are curated knowledge — not live inference.</p>
      </div>
      <div class="chat-bar-wrap reveal">
        <form class="chat-bar" id="faq-form" autocomplete="off">
          <span class="mic" aria-hidden="true">🎙</span>
          <input type="text" id="faq-input" placeholder="Ask anything about NEXUS robots…" />
          <button type="submit" class="send-btn" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </form>
      </div>
      <div class="suggested-pills reveal" id="faq-pills"></div>
      <div class="chat-log" id="faq-chat"></div>
      <div class="faq-accordion" id="faq-acc"></div>
    </section>
  `;

  const pills = root.querySelector("#faq-pills");
  const suggestions = [
    "How do I program NEXUS robots?",
    "What's the warranty policy?",
    "Can robots be customized post-purchase?",
    "Which robot is best for warehouses?",
    "What payment options are available?",
  ];
  pills.innerHTML = suggestions.map((s) => `<button type="button" data-q="${s.replace(/"/g, "&quot;")}">${s}</button>`).join("");

  const chat = root.querySelector("#faq-chat");
  const form = root.querySelector("#faq-form");
  const input = root.querySelector("#faq-input");

  function addUser(msg) {
    chat.insertAdjacentHTML(
      "beforeend",
      `<div class="chat-msg chat-msg--user"><div class="chat-bubble">${escapeHtml(msg)}</div></div>`
    );
  }

  function addLoading() {
    const id = "load-" + Date.now();
    chat.insertAdjacentHTML(
      "beforeend",
      `<div class="chat-msg chat-msg--ai" id="${id}"><div class="chat-avatar" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" stroke="url(#nexus-grad1)" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 20 L20 36 M20 20 L34 12 M20 20 L6 12" stroke="url(#nexus-grad2)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="chat-bubble"><div class="loading-dots"><span></span><span></span><span></span></div></div></div>`
    );
    return id;
  }

  function replaceLoading(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `<div class="chat-avatar" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z" stroke="url(#nexus-grad1)" stroke-width="3.5" stroke-linejoin="round"/><path d="M20 20 L20 36 M20 20 L34 12 M20 20 L6 12" stroke="url(#nexus-grad2)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="chat-bubble"><div class="chat-meta">NEXUS AI</div>${escapeHtml(text)}</div>`;
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function submitQuery(text) {
    if (!text.trim()) return;
    addUser(text);
    input.value = "";
    const lid = addLoading();
    setTimeout(() => {
      replaceLoading(lid, matchResponse(text));
      chat.scrollTop = chat.scrollHeight;
    }, 900);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitQuery(input.value);
  });

  pills.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.dataset.q;
      submitQuery(btn.dataset.q);
    });
  });

  const faqData = [
    {
      cat: "Product",
      items: [
        { q: "What safety certifications do NEXUS robots carry?", a: "Configurations are offered with ISO 10218-aligned risk assessments, CE machinery directive packages, and region-specific documentation. Medical SKUs include IEC 60601 pathways." },
        { q: "How often do software updates ship?", a: "Quarterly feature releases roll out through NEXUS Fleet Manager. Critical patches deploy within 72 hours for subscribed fleets." },
        { q: "Can I integrate with existing MES or WMS?", a: "Yes. OPC-UA, MQTT, and REST connectors are supported. Enterprise plans include reference architectures for major WMS vendors." },
      ],
    },
    {
      cat: "Pricing",
      items: [
        { q: "Do prices include deployment and training?", a: "List prices cover hardware and baseline software. On-site commissioning, training, and simulation tuning are quoted separately based on site complexity." },
        { q: "Is financing available for mid-market buyers?", a: "Qualified buyers can access 24- and 36-month structures through our financing partners. Enterprise customers may structure milestone billing." },
      ],
    },
    {
      cat: "Support",
      items: [
        { q: "What are standard response times?", a: "Standard support targets next-business-day response. Mission-critical plans include 24/7 phone escalation and 4-hour on-site SLAs in covered metros." },
        { q: "How do I open a hardware ticket?", a: "Use the NEXUS Service Portal with your serial number. Advance replacement ships after triage for eligible SKUs." },
        { q: "Where can I download CAD and SDKs?", a: "Developer packs and STEP files are available in the NEXUS Partner Hub after you register your organization." },
      ],
    },
  ];

  const acc = root.querySelector("#faq-acc");
  acc.innerHTML = faqData
    .map(
      (block) => `
    <div class="faq-category reveal">
      <h3>${block.cat}</h3>
      ${block.items
        .map(
          (it, idx) => `
        <div class="faq-item" data-faq>
          <button type="button" class="faq-q" aria-expanded="false">
            ${it.q}
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
          <div class="faq-a">
            <div class="faq-a-inner">${it.a}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>`
    )
    .join("");

  acc.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("is-open");
      acc.querySelectorAll(".faq-item").forEach((i) => {
        i.classList.remove("is-open");
        const pane = i.querySelector(".faq-a");
        if (pane) pane.style.maxHeight = "0px";
        i.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        const pane = item.querySelector(".faq-a");
        const inner = item.querySelector(".faq-a-inner");
        if (pane && inner) pane.style.maxHeight = inner.scrollHeight + 28 + "px";
      }
    });
  });
}
