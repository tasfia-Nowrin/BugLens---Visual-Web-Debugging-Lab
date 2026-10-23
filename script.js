const scenarios = {
    overflow: {
        title: "Horizontal overflow detected",
        description: "A child element is wider than its available space, causing the page to scroll sideways.",
        cause: "width: 1200px;",
        explanation: "A fixed width can exceed a smaller viewport. The element cannot shrink to fit the screen.",
        fix: "max-width: 100%;\\nbox-sizing: border-box;",
        severity: "HIGH",
        symbol: "↔",
        toast: "Fix applied: the sample content now fits its container."
    },
    alignment: {
        title: "Flex alignment issue detected",
        description: "Items in this row appear uneven because spacing has been added to individual cards instead of using the layout container.",
        cause: "margin-top: 22px;",
        explanation: "Manual offsets can make related items look misaligned and become harder to maintain at different widths.",
        fix: "align-items: stretch;\\ngap: 8px;",
        severity: "MEDIUM",
        symbol: "☷",
        toast: "Fix applied: the cards are aligned consistently."
    },
    boxmodel: {
        title: "Unexpected element sizing",
        description: "The cards look larger than intended because their padding and border add extra visual weight to each box.",
        cause: "padding: 28px 25px;\\nborder: 5px solid;",
        explanation: "Padding and borders affect an element's outer dimensions unless sizing is managed consistently.",
        fix: "box-sizing: border-box;\\npadding: 12px 10px;",
        severity: "MEDIUM",
        symbol: "▣",
        toast: "Fix applied: card padding and borders are back to the intended size."
    }
};

const scenarioButtons = [...document.querySelectorAll(".scenario-card")];
const viewportButtons = [...document.querySelectorAll(".viewport-btn")];
const samplePage = document.getElementById("samplePage");
const previewFrame = document.getElementById("previewFrame");
const severityBadge = document.getElementById("severityBadge");
const toast = document.getElementById("toast");
let currentScenario = "overflow";
let isFixed = false;
let toastTimer;

function renderDiagnosis(key) {
    const data = scenarios[key];
    document.getElementById("diagnosisTitle").textContent = isFixed ? "Layout fix applied" : data.title;
    document.getElementById("diagnosisDescription").textContent = isFixed
        ? "The selected demo fix has been applied to the sample page. Switch viewport sizes to inspect the layout."
        : data.description;
    document.getElementById("causeCode").textContent = data.cause;
    document.getElementById("causeExplanation").textContent = data.explanation;
    document.getElementById("fixCode").innerHTML = data.fix.replace(/\\n/g, "<br>");
    document.getElementById("diagnosisSymbol").textContent = isFixed ? "✓" : data.symbol;
    severityBadge.textContent = isFixed ? "RESOLVED" : data.severity;
    severityBadge.className = "severity " + (isFixed ? "low" : data.severity.toLowerCase());
    document.getElementById("applyFixBtn").innerHTML = isFixed
        ? '<span>✓</span> Reset demo bug <span class="button-arrow">↺</span>'
        : '<span>✦</span> Apply suggested fix <span class="button-arrow">→</span>';
}

function selectScenario(key) {
    currentScenario = key;
    isFixed = false;
    scenarioButtons.forEach(button => {
        const selected = button.dataset.scenario === key;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
    samplePage.className = "sample-page bug-" + key;
    renderDiagnosis(key);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

scenarioButtons.forEach(button => {
    button.addEventListener("click", () => selectScenario(button.dataset.scenario));
});

viewportButtons.forEach(button => {
    button.addEventListener("click", () => {
        const width = button.dataset.width;
        viewportButtons.forEach(item => {
            const selected = item === button;
            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });
        previewFrame.classList.remove("desktop", "tablet", "mobile");
        previewFrame.classList.add(width);
        document.getElementById("viewportLabel").textContent =
            width === "desktop" ? "Viewport: 100%" : width === "tablet" ? "Viewport: tablet" : "Viewport: mobile";
    });
});

document.getElementById("applyFixBtn").addEventListener("click", () => {
    isFixed = !isFixed;
    samplePage.classList.toggle("bug-fixed", isFixed);
    renderDiagnosis(currentScenario);
    showToast(isFixed ? scenarios[currentScenario].toast : "Demo bug reset. Inspect the issue and apply the fix again.");
});

selectScenario("overflow");
