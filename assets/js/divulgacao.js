/* divulgacao.js | ROCA LOG */
(function () {
  "use strict";

  const PRODUCT_BG_MAP = {
    SOJA: "../assets/img/SOJATESTE.png",
    MILHO: "../assets/img/MILHOTESTE.png",
    ACUCAR: "../assets/img/ACUCARTESTE.png",
    CALCARIO: "../assets/img/CALCARIOTESTE.png",
    FARELODESOJA: "../assets/img/FARELODESOJA.png",
    SORGO: "../assets/img/SORGOTESTE.png",
    FERTILIZANTE: "../assets/img/FERTILIZANTE.png"
    FUBA: "../assets/img/FUBA.png"
    BLOCO DE CONCRETO: "../assets/img/CONCREOT.png"
    EMBALAGENS: "../assets/img/EMBALAGEM.png"
    DERIVADO DE MILHO : "../assets/img/DERIVADOMILHO.png"
    GERMEN DE MILHO: "../assets/img/GERME.png"
    ALIMENTICIO: "../assets/img/ALIMENTICIO.png"
    PIPOCA: "../assets/img/PIPOCA.png"
    POSTE DE CONCRETO: "../assets/img/POSTE.png"
  };

  const FILIAIS_CONTATOS = {
    RIOVERDE: [
      
      "ARIEL (64) 99227-7537",
      "MARCOS (64) 99928-0210"

      {
    ANAPOLIS: [
      
      "ARIEL (64) 99227-7537",
      "MARCOS (64) 99928-0210"
    ],
  };

  const DEFAULT_BG = PRODUCT_BG_MAP.SOJA;

  const PRODUCT_ALIAS = {
    SOJA: "SOJA",
    SOJAEMGRAOS: "SOJA",
    SOJAEMGRAO: "SOJA",
    SOJAGRAOS: "SOJA",
    SOJAGRANEL: "SOJA",

    MILHO: "MILHO",
    MILHOEMGRAOS: "MILHO",
    MILHOEMGRAO: "MILHO",
    MILHOGRAOS: "MILHO",
    MILHOGRANEL: "MILHO",

    ACUCAR: "ACUCAR",
    ACUCARGRANEL: "ACUCAR",
    ACUCARVHP: "ACUCAR",
    ACUCARCRISTAL: "ACUCAR",

    CALCARIO: "CALCARIO",
    CALCARIOGRANEL: "CALCARIO",

    FARELODESOJA: "FARELODESOJA",
    FARELOSOJA: "FARELODESOJA",

    SORGO: "SORGO",
    SORGOEMGRAOS: "SORGO",
    SORGOGRANEL: "SORGO",

    ADUBO: "FERTILIZANTE",
    FERTILIZANTE: "FERTILIZANTE",
    FERTILIZANTES: "FERTILIZANTE",
    FERT: "FERTILIZANTE"

    FUBA: "FUBA",
    BLOCO DE CONCRETO: "CONCRETO",
    EMBALAGENS: "EMBALAGENS",
    DERIVADO DE MILHO : "DERIVADO DE MILHO"
    GERMEN DE MILHO: "FERTILIZANTE",
    ALIMENTICIO: "FERTILIZANTE",
    PIPOCA: "MILHO DE PIPOCA",
    POSTE DE CONCRETO: "POSTE DE CONCRETO"
  };

  function getPreview(templateId) {
    return document.querySelector(`[data-template-preview="${templateId}"]`);
  }

  function getBgImgEl(preview) {
    return preview ? preview.querySelector(".previewBg") : null;
  }

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z0-9]/g, "");
  }

  function updatePreview(templateId, field, value) {
    const preview = getPreview(templateId);
    if (!preview) return;

    const target = preview.querySelector(`[data-bind="${field}"]`);
    if (target) target.textContent = value || "";
  }

  function hasLetters(value) {
    return /[A-ZÀ-Ü]/i.test(String(value || ""));
  }

  function limparDigitacaoNumerica(valor) {
    if (valor == null) return "";

    let v = String(valor);
    v = v.replace(/R\$\s?/gi, "");
    v = v.replace(/[^\d,.]/g, "");

    const parts = v.split(/[,.]/);
    if (parts.length <= 1) return v;

    const dec = parts.pop() || "";
    const intPart = parts.join("");

    return intPart + "," + dec;
  }

  function formatarMoedaBR(valor) {
    if (valor == null) return "";

    let v = String(valor).trim();
    if (!v) return "";

    if (hasLetters(v)) return v.toUpperCase();

    v = v.replace(/R\$\s?/gi, "");
    v = v.replace(/\./g, "");
    v = v.replace(/[^\d,]/g, "");

    const partes = v.split(",");
    let reais = partes[0] || "0";
    let centavos = partes[1] || "";

    centavos = centavos.substring(0, 2);
    while (centavos.length < 2) centavos += "0";

    reais = reais.replace(/^0+(?=\d)/, "");
    reais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `R$ ${reais || "0"},${centavos}`;
  }

  function inferProductFamily(normalized) {
    if (normalized.includes("FARELO") && normalized.includes("SOJA")) return "FARELODESOJA";
    if (normalized.includes("SOJA")) return "SOJA";
    if (normalized.includes("MILHO")) return "MILHO";
    if (normalized.includes("ACUCAR")) return "ACUCAR";
    if (normalized.includes("CALCARIO")) return "CALCARIO";
    if (normalized.includes("SORGO")) return "SORGO";
    if (normalized.includes("FERT") || normalized.includes("ADUBO")) return "FERTILIZANTE";
    return "";
  }

  function productToImage(productValue) {
    const normalized = normalizeKey(productValue);
    const aliased = PRODUCT_ALIAS[normalized];

    if (aliased && PRODUCT_BG_MAP[aliased]) return PRODUCT_BG_MAP[aliased];

    const family = inferProductFamily(normalized);
    if (family && PRODUCT_BG_MAP[family]) return PRODUCT_BG_MAP[family];

    return DEFAULT_BG;
  }

  function setPreviewBackgroundByProduct(templateId, productValue) {
    const preview = getPreview(templateId);
    if (!preview) return;

    const img = productToImage(productValue);
    const bgImg = getBgImgEl(preview);

    if (bgImg) {
      bgImg.src = img;
    } else {
      preview.style.backgroundImage = `url("${img}")`;
    }
  }

  function preencherContatosFilial(templateId, filialValue) {
    const key = normalizeKey(filialValue);
    const lista = FILIAIS_CONTATOS[key] || ["", "", "", ""];

    ["contato1", "contato2", "contato3", "contato4"].forEach((campo, index) => {
      const input = document.querySelector(
        `[data-template="${templateId}"][data-field="${campo}"]`
      );

      const valor = lista[index] || "";

      if (input) input.value = valor;
      updatePreview(templateId, campo, valor);
    });
  }

  function handleInput(event) {
    const el = event.target;
    const templateId = el.dataset.template;
    const field = el.dataset.field;

    if (!templateId || !field) return;

    let value = el.value ?? "";

    if (field === "valor") {
      let v = String(value).toUpperCase();

      if (!hasLetters(v)) {
        v = limparDigitacaoNumerica(v);
      }

      el.value = v;
      updatePreview(templateId, "valor", v);
      return;
    }

    value = String(value).trim();
    updatePreview(templateId, field, value);

    if (field === "produto") {
      setPreviewBackgroundByProduct(templateId, value);
    }

    if (templateId === "1" && field === "filial") {
      preencherContatosFilial(templateId, value);
    }
  }

  function handleBlur(event) {
    const el = event.target;
    const templateId = el.dataset.template;
    const field = el.dataset.field;

    if (!templateId || field !== "valor") return;

    const raw = String(el.value || "").toUpperCase().trim();
    const finalValue = formatarMoedaBR(raw);

    el.value = finalValue;
    updatePreview(templateId, "valor", finalValue);
  }

  function resetTemplate(templateId) {
    const card = document.querySelector(`.templateCard[data-template="${templateId}"]`);
    if (!card) return;

    card.querySelectorAll("input, select").forEach((el) => {
      if (el.tagName === "SELECT") {
        el.selectedIndex = 0;
      } else {
        el.value = "";
      }

      if (el.dataset.field) updatePreview(templateId, el.dataset.field, "");
    });

    setPreviewBackgroundByProduct(templateId, "SOJA");
  }

  async function saveTemplate(templateId) {
    const preview = getPreview(templateId);
    if (!preview) return;

    const bgImg = getBgImgEl(preview);

    if (bgImg && (!bgImg.complete || bgImg.naturalWidth === 0)) {
      await new Promise((resolve) => {
        bgImg.addEventListener("load", resolve, { once: true });
        bgImg.addEventListener("error", resolve, { once: true });
      });
    }

    const canvas = await html2canvas(preview, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });

    const link = document.createElement("a");
    link.download = `divulgacao-modelo-${templateId}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  }

  function initDefaults() {
    document.querySelectorAll("[data-template-preview]").forEach((preview) => {
      const templateId = preview.dataset.templatePreview;

      const produtoEl = document.querySelector(
        `[data-template="${templateId}"][data-field="produto"]`
      );

      const produtoVal = produtoEl ? (produtoEl.value || "").trim() : "";
      setPreviewBackgroundByProduct(templateId, produtoVal || "SOJA");

      if (templateId === "1") {
        const filialEl = document.querySelector(`[data-template="1"][data-field="filial"]`);
        if (filialEl && filialEl.value) preencherContatosFilial("1", filialEl.value);
      }

      const valorEl = document.querySelector(
        `[data-template="${templateId}"][data-field="valor"]`
      );

      if (valorEl && valorEl.value) {
        const raw = String(valorEl.value || "").toUpperCase().trim();
        const value = formatarMoedaBR(raw);

        valorEl.value = value;
        updatePreview(templateId, "valor", value);
      }
    });
  }

  function bindActions() {
    document.querySelectorAll("[data-template][data-field]").forEach((el) => {
      const eventName = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(eventName, handleInput);

      if (el.dataset.field === "valor") {
        el.addEventListener("blur", handleBlur);
      }
    });

    document.querySelectorAll("[data-action='reset']").forEach((btn) => {
      btn.addEventListener("click", () => resetTemplate(btn.dataset.template));
    });

    document.querySelectorAll("[data-action='save']").forEach((btn) => {
      btn.addEventListener("click", () => saveTemplate(btn.dataset.template));
    });

    initDefaults();

    document.querySelectorAll("[data-template][data-field]").forEach((el) => {
      handleInput({ target: el });

      if (el.dataset.field === "valor") {
        handleBlur({ target: el });
      }
    });
  }

  window.addEventListener("DOMContentLoaded", bindActions);
})();
