/* ================================================================
   EDESIGN.AI — Main Application
   AI-Powered Electronic Circuit & PCB Design Platform
   ================================================================ */

import './style.css';
import { AGENTS, runPipeline } from './agents.js';
import { renderSchematic } from './schematic.js';

// ================================================================
// State
// ================================================================
let state = {
  isRunning: false,
  agentStates: {}, // { [agentId]: 'pending' | 'running' | 'done' | 'error' }
  results: null,
  activeTab: 'summary',
  userPrompt: '',
};

// ================================================================
// Example prompts
// ================================================================
const EXAMPLES = [
  'IoT weather station with WiFi',
  'Motor controller with Bluetooth',
  'GPS tracker with LoRa',
  'Home automation relay board',
  'Smart garden with soil moisture sensor',
  'Battery-powered temperature logger',
];

// ================================================================
// Initialize App
// ================================================================
function init() {
  const app = document.getElementById('app');
  app.innerHTML = renderApp();
  bindEvents();
}

// ================================================================
// Render Functions
// ================================================================
function renderApp() {
  return `
    <!-- Background effects -->
    <div class="bg-grid"></div>
    <div class="bg-glow-orb bg-glow-orb--1"></div>
    <div class="bg-glow-orb bg-glow-orb--2"></div>
    <div class="bg-glow-orb bg-glow-orb--3"></div>

    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="container navbar__inner">
        <a href="#" class="navbar__logo" id="logo-link">
          <div class="navbar__logo-icon">E</div>
          <span class="navbar__logo-text">Edesign.ai</span>
          <span class="navbar__logo-badge">Beta</span>
        </a>
        <div class="navbar__actions">
          <div class="navbar__status">
            <span class="navbar__status-dot"></span>
            <span>AI Engine Ready</span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero" id="hero-section">
      <div class="container">
        <div class="hero__chip">
          <span class="hero__chip-icon">⚡</span>
          <span>7-Agent AI Pipeline for Hardware Design</span>
        </div>
        <h1 class="hero__title">
          Design Electronics with<br>
          <span class="hero__title-gradient">Natural Language</span>
        </h1>
        <p class="hero__subtitle">
          Describe your circuit in plain English. Our AI agents analyze requirements, 
          design architecture, select components, plan PCB layout, and verify everything — automatically.
        </p>
      </div>
    </section>

    <!-- Input Section -->
    <section class="container">
      <div class="input-section" id="input-section">
        <div class="input-card">
          <textarea 
            class="input-card__textarea" 
            id="prompt-input"
            placeholder="Describe your electronic circuit project...&#10;&#10;Example: Design an IoT weather station that measures temperature, humidity, and pressure, displays data on an OLED screen, and sends readings via WiFi using MQTT protocol. Should be battery-powered with solar charging."
            rows="5"
          >${state.userPrompt}</textarea>
          <div class="input-card__footer">
            <div class="input-card__examples">
              ${EXAMPLES.map(ex => `
                <button class="example-chip" data-example="${ex}">${ex}</button>
              `).join('')}
            </div>
            <button class="btn btn--primary" id="run-btn" ${state.isRunning ? 'disabled' : ''}>
              ${state.isRunning ? '<div class="spinner"></div><span>Processing...</span>' : '<span class="btn__icon">🚀</span><span>Generate Design</span>'}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Pipeline Status -->
    ${state.isRunning || state.results ? renderPipeline() : ''}

    <!-- Results -->
    ${state.results ? renderResults() : ''}

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer__inner">
        <span>© 2026 Edesign.ai — AI-Powered Electronic Design</span>
        <div class="footer__links">
          <a href="#" class="footer__link">Documentation</a>
          <a href="#" class="footer__link">GitHub</a>
          <a href="#" class="footer__link">About</a>
        </div>
      </div>
    </footer>
  `;
}

function renderPipeline() {
  const doneCount = Object.values(state.agentStates).filter(s => s === 'done').length;
  const progress = (doneCount / AGENTS.length) * 100;

  return `
    <section class="container pipeline" id="pipeline-section">
      <div class="pipeline__header">
        <h2 class="pipeline__title">🤖 AI Agent Pipeline</h2>
        <span class="pipeline__progress-text">${doneCount}/${AGENTS.length} complete</span>
      </div>
      <div class="pipeline__bar">
        <div class="pipeline__bar-fill" style="width: ${progress}%"></div>
      </div>
      <div class="pipeline__agents">
        ${AGENTS.map(agent => {
          const agentState = state.agentStates[agent.id] || 'pending';
          return `
            <div class="agent-step agent-step--${agentState}" data-agent-id="${agent.id}">
              <div class="agent-step__header">
                <div class="agent-step__number">
                  ${agentState === 'done' ? '✓' : agentState === 'error' ? '✗' : agent.id}
                </div>
                <span class="agent-step__name">${agent.name}</span>
                <span class="agent-step__status-icon">
                  ${agentState === 'running' ? '<div class="spinner"></div>' : agentState === 'done' ? '✅' : agentState === 'error' ? '❌' : '⏳'}
                </span>
              </div>
              <p class="agent-step__desc">${agent.desc}</p>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

function renderResults() {
  const r = state.results;
  if (!r) return '';

  const tabs = [
    { id: 'summary', label: '📊 Summary', icon: '' },
    { id: 'code', label: '⌨️ Code', icon: '' },
    { id: 'schematic', label: '🔧 Schematic', icon: '' },
    { id: 'bom', label: '📋 BOM', icon: '' },
    { id: 'connections', label: '🔗 Connections', icon: '' },
    { id: 'pcb', label: '📐 PCB Rules', icon: '' },
    { id: 'verification', label: '✅ Verification', icon: '' },
    { id: 'firmware', label: '💻 Firmware', icon: '' },
    { id: 'json', label: '{ } Raw JSON', icon: '' },
  ];

  return `
    <section class="container results" id="results-section">
      <div class="results__tabs" id="results-tabs">
        ${tabs.map(tab => `
          <button class="results__tab ${state.activeTab === tab.id ? 'results__tab--active' : ''}" 
                  data-tab="${tab.id}">${tab.label}</button>
        `).join('')}
      </div>
      
      <div class="results__panel" id="results-panel">
        ${renderTabContent()}
      </div>
    </section>
  `;
}

function renderTabContent() {
  const r = state.results;
  if (!r) return '';

  switch (state.activeTab) {
    case 'summary': return renderSummaryTab(r);
    case 'code': return renderCodeTab(r);
    case 'schematic': return renderSchematicTab(r);
    case 'bom': return renderBOMTab(r);
    case 'connections': return renderConnectionsTab(r);
    case 'pcb': return renderPCBTab(r);
    case 'verification': return renderVerificationTab(r);
    case 'firmware': return renderFirmwareTab(r);
    case 'json': return renderJSONTab(r);
    default: return '';
  }
}

function renderSummaryTab(r) {
  const s = r.output.summary;
  const cards = [
    { icon: '⬡', color: 'indigo', title: 'Microcontroller', value: s.mcu },
    { icon: '⚡', color: 'emerald', title: 'Power Supply', value: s.power_supply },
    { icon: '📡', color: 'cyan', title: 'Communication', value: s.communication },
    { icon: '📐', color: 'amber', title: 'PCB', value: `${s.pcb_layers} — ${s.pcb_size}` },
    { icon: '🧩', color: 'violet', title: 'Components', value: `${s.total_components} total (${s.total_unique_components} unique)` },
    { icon: s.verification_status === 'PASS' ? '✅' : '❌', color: s.verification_status === 'PASS' ? 'emerald' : 'rose', title: 'Verification', value: `${s.verification_status} — ${s.error_count} errors, ${s.warning_count} warnings` },
  ];

  return `
    <div class="section-header">
      <span class="section-header__icon">📊</span>
      <h3 class="section-header__title">Design Summary</h3>
    </div>
    <div class="summary-grid">
      ${cards.map(card => `
        <div class="summary-card">
          <div class="summary-card__icon summary-card__icon--${card.color}">${card.icon}</div>
          <div class="summary-card__title">${card.title}</div>
          <div class="summary-card__value">${card.value}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">📝 Design Notes</div>
      <div class="notes-block__content">${r.output.designNotes}</div>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🎯 Project Purpose</div>
      <div class="notes-block__content">${r.requirements.purpose}</div>
    </div>

    <div class="export-bar" style="margin-top: 20px;">
      <button class="btn btn--secondary" id="export-json-btn">
        <span class="btn__icon">📥</span> Export JSON
      </button>
      <button class="btn btn--secondary" id="export-bom-btn">
        <span class="btn__icon">📋</span> Export BOM (CSV)
      </button>
    </div>
  `;
}

function renderCodeTab(r) {
  if (!r.firmware || !r.firmware.code) {
    return `<div class="empty-state"><div class="empty-state__icon">⌨️</div><div class="empty-state__title">No firmware generated</div></div>`;
  }
  const fw = r.firmware;

  return `
    <div class="section-header">
      <span class="section-header__icon">⌨️</span>
      <h3 class="section-header__title">Auto-Generated Arduino Firmware</h3>
      <span class="section-header__badge" style="background: var(--accent-emerald-glow); color: var(--accent-emerald);">
        ${fw.framework}
      </span>
    </div>
    <div class="export-bar">
      <button class="btn btn--secondary" id="copy-code-btn">
        <span class="btn__icon">📋</span> Copy Code
      </button>
      <button class="btn btn--secondary" id="download-ino-btn">
        <span class="btn__icon">📥</span> Download .ino
      </button>
    </div>
    <div class="firmware-code-wrapper">
      <div class="firmware-code-header">
        <span class="firmware-code-dot firmware-code-dot--red"></span>
        <span class="firmware-code-dot firmware-code-dot--yellow"></span>
        <span class="firmware-code-dot firmware-code-dot--green"></span>
        <span class="firmware-code-filename">edesign_firmware.ino</span>
      </div>
      <pre class="firmware-code" id="firmware-code-block"><code>${highlightArduino(fw.code)}</code></pre>
    </div>
    <div class="notes-block" style="margin-top: 16px;">
      <div class="notes-block__title">📝 Upload Instructions</div>
      <div class="notes-block__content">
        1. Open <strong>Arduino IDE</strong> or <strong>PlatformIO</strong><br>
        2. Select board: <code>${fw.mcu.includes('ESP32') ? 'ESP32 Dev Module' : fw.mcu.includes('ATmega') ? 'Arduino Uno' : 'STM32 Nucleo'}</code><br>
        3. Install required libraries via Library Manager<br>
        4. Update <code>WIFI_SSID</code> / <code>WIFI_PASSWORD</code> if applicable<br>
        5. Compile and upload to your board
      </div>
    </div>
  `;
}

function highlightArduino(raw) {
  // Escape HTML entities first
  let code = raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Apply syntax highlighting with spans
  code = code
    // Multi-line comments
    .replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="hl-comment">$1</span>')
    // Single-line comments
    .replace(/(\/\/.*$)/gm, '<span class="hl-comment">$1</span>')
    // Preprocessor (#include, #define)
    .replace(/^(#\w+.*)$/gm, '<span class="hl-preproc">$1</span>')
    // Strings
    .replace(/(&quot;[^&]*?&quot;|"[^"]*?")/g, '<span class="hl-string">$1</span>')
    // Keywords
    .replace(/\b(void|int|float|char|bool|byte|long|unsigned|const|if|else|while|for|return|true|false|HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|NULL)\b/g, '<span class="hl-keyword">$1</span>')
    // Known functions
    .replace(/\b(setup|loop|pinMode|digitalWrite|digitalRead|analogRead|analogWrite|Serial|Wire|delay|millis|map|constrain|tone|printf|println|print|begin|end)\b/g, '<span class="hl-func">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*[fFuUlL]?)\b/g, '<span class="hl-number">$1</span>');
  
  return code;
}

function renderSchematicTab(r) {
  return `
    <div class="section-header">
      <span class="section-header__icon">🔧</span>
      <h3 class="section-header__title">Block Diagram Schematic</h3>
    </div>
    <div class="schematic-canvas-wrapper">
      <div id="schematic-container"></div>
    </div>
    <p style="margin-top: 12px; font-size: 12px; color: var(--text-muted);">
      💡 This is a high-level block diagram. Export the JSON data and import into KiCad or EasyEDA for detailed schematic capture.
    </p>
  `;
}

function renderBOMTab(r) {
  const bom = r.componentSelection.bom;
  
  // Group by category
  const categories = {};
  bom.forEach(item => {
    const cat = item.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  return `
    <div class="section-header">
      <span class="section-header__icon">📋</span>
      <h3 class="section-header__title">Bill of Materials</h3>
      <span class="section-header__badge" style="background: var(--accent-indigo-glow); color: var(--accent-indigo);">
        ${bom.length} items
      </span>
    </div>
    <div class="bom-table-wrapper">
      <table class="bom-table" id="bom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Component</th>
            <th>Value / Description</th>
            <th>Package</th>
            <th>Qty</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          ${bom.map((item, idx) => `
            <tr>
              <td style="color: var(--text-muted); font-family: var(--font-mono); font-size: 11px;">${idx + 1}</td>
              <td style="font-weight: 600;">${item.name}</td>
              <td>${item.value}</td>
              <td style="font-family: var(--font-mono); font-size: 12px;">${item.package}</td>
              <td style="font-weight: 600; text-align: center;">${item.quantity}</td>
              <td><span class="bom-tag">${item.category || 'Other'}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderConnectionsTab(r) {
  const conns = r.circuitDesign.connections;
  return `
    <div class="section-header">
      <span class="section-header__icon">🔗</span>
      <h3 class="section-header__title">Circuit Connections</h3>
      <span class="section-header__badge" style="background: var(--accent-cyan-glow); color: var(--accent-cyan);">
        ${conns.length} connections
      </span>
    </div>
    <div id="connections-list">
      ${conns.map((conn, idx) => `
        <div class="connection-row">
          <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 11px; width: 24px;">${idx + 1}</span>
          <span class="connection-node connection-node--from">${conn.from}</span>
          <span class="connection-arrow">→</span>
          <span class="connection-node connection-node--to">${conn.to}</span>
          <span class="connection-desc">${conn.description}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPCBTab(r) {
  const pcb = r.pcbLayout;
  
  const sections = [
    { label: 'Board Specification', value: `${pcb.layers}, ${pcb.board_size}`, desc: 'FR4 substrate, 1.6mm thickness, 1oz copper' },
  ];

  return `
    <div class="section-header">
      <span class="section-header__icon">📐</span>
      <h3 class="section-header__title">PCB Design Rules</h3>
    </div>
    <div class="pcb-grid">
      ${sections.map(s => `
        <div class="pcb-rule-card">
          <div class="pcb-rule-card__label">${s.label}</div>
          <div class="pcb-rule-card__value">${s.value}</div>
          <div class="pcb-rule-card__desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>
    
    <div class="notes-block" style="margin-top: 20px;">
      <div class="notes-block__title">📍 Component Placement Rules</div>
      <div class="notes-block__content">${pcb.placement_rules.split('\n').map(r => `• ${r}`).join('<br>')}</div>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🔀 Routing Rules</div>
      <div class="notes-block__content">${pcb.routing_rules.split('\n').map(r => `• ${r}`).join('<br>')}</div>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🏭 Fabrication Notes</div>
      <div class="notes-block__content">${pcb.notes.split('\n').map(r => `• ${r}`).join('<br>')}</div>
    </div>
  `;
}

function renderVerificationTab(r) {
  const v = r.verification;
  
  return `
    <div class="section-header">
      <span class="section-header__icon">✅</span>
      <h3 class="section-header__title">Design Verification Report</h3>
    </div>
    
    <div class="verification-status verification-status--${v.status.toLowerCase()}">
      <span style="font-size: 28px;">${v.status === 'PASS' ? '✅' : '❌'}</span>
      <span>Verification ${v.status === 'PASS' ? 'PASSED' : 'FAILED'} — ${v.errors.length} errors, ${v.warnings.length} warnings</span>
    </div>
    
    ${v.errors.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; color: var(--accent-rose); margin-bottom: 12px;">❌ Errors</h4>
        <ul class="verification-list">
          ${v.errors.map(e => `
            <li class="verification-item verification-item--error">
              <span class="verification-item__icon">🔴</span>
              <span>${e}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${v.warnings.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; color: var(--accent-amber); margin-bottom: 12px;">⚠️ Warnings</h4>
        <ul class="verification-list">
          ${v.warnings.map(w => `
            <li class="verification-item verification-item--warning">
              <span class="verification-item__icon">🟡</span>
              <span>${w}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${v.suggestions && v.suggestions.length > 0 ? `
      <div>
        <h4 style="font-size: 14px; font-weight: 700; color: var(--accent-indigo); margin-bottom: 12px;">💡 Suggestions</h4>
        <ul class="verification-list">
          ${v.suggestions.map(s => `
            <li class="verification-item verification-item--info">
              <span class="verification-item__icon">💡</span>
              <span>${s}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `;
}

function renderFirmwareTab(r) {
  const fw = r.output.firmwareHints;
  const sim = r.output.simulationSuggestions;
  const mcu = r.output.summary.mcu;

  return `
    <div class="section-header">
      <span class="section-header__icon">💻</span>
      <h3 class="section-header__title">Firmware & Simulation</h3>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🔧 Firmware Hints for <code>${mcu}</code></div>
      <div class="notes-block__content">
        ${fw.map(h => `• ${h}`).join('<br>')}
      </div>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🔬 Simulation Suggestions</div>
      <div class="notes-block__content">
        ${sim.map(s => `• ${s}`).join('<br>')}
      </div>
    </div>
    
    <div class="notes-block">
      <div class="notes-block__title">🛠 Recommended Tools</div>
      <div class="notes-block__content">
        • <strong>Schematic & PCB:</strong> KiCad 8+ (free, open-source) or EasyEDA<br>
        • <strong>SPICE Simulation:</strong> LTspice (free) or TINA-TI<br>
        • <strong>Firmware IDE:</strong> ${mcu.includes('ESP32') ? 'Arduino IDE / PlatformIO / ESP-IDF' : mcu.includes('STM32') ? 'STM32CubeIDE / PlatformIO' : 'Arduino IDE / PlatformIO'}<br>
        • <strong>Online Simulator:</strong> Wokwi.com, Falstad Circuit Simulator<br>
        • <strong>PCB Fabrication:</strong> JLCPCB, PCBWay, OSH Park
      </div>
    </div>
  `;
}

function renderJSONTab(r) {
  return `
    <div class="section-header">
      <span class="section-header__icon">{ }</span>
      <h3 class="section-header__title">Raw JSON Output</h3>
    </div>
    <div class="export-bar">
      <button class="btn btn--secondary" id="copy-json-btn">
        <span class="btn__icon">📋</span> Copy to Clipboard
      </button>
      <button class="btn btn--secondary" id="download-json-btn">
        <span class="btn__icon">📥</span> Download JSON
      </button>
    </div>
    <pre class="json-view" id="json-output">${syntaxHighlightJSON(JSON.stringify(r, null, 2))}</pre>
  `;
}

function syntaxHighlightJSON(json) {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="json-string">"$1"</span>')
    .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');
}

// ================================================================
// Event Binding
// ================================================================
function bindEvents() {
  // Run button
  const runBtn = document.getElementById('run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', handleRun);
  }

  // Example chips
  document.querySelectorAll('.example-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const example = e.target.dataset.example;
      const textarea = document.getElementById('prompt-input');
      if (textarea) {
        textarea.value = example;
        state.userPrompt = example;
        textarea.focus();
      }
    });
  });

  // Tab buttons
  document.querySelectorAll('.results__tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      state.activeTab = e.target.dataset.tab;
      updateResults();
    });
  });

  // Export buttons
  bindExportButtons();

  // Render schematic if needed
  if (state.activeTab === 'schematic' && state.results) {
    const container = document.getElementById('schematic-container');
    if (container) {
      renderSchematic(state.results.circuitDesign, container);
    }
  }

  // Textarea auto-save
  const textarea = document.getElementById('prompt-input');
  if (textarea) {
    textarea.addEventListener('input', (e) => {
      state.userPrompt = e.target.value;
    });
    // Enable Ctrl+Enter to submit
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    });
  }
}

function bindExportButtons() {
  const copyBtn = document.getElementById('copy-json-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(state.results, null, 2))
        .then(() => { copyBtn.innerHTML = '<span class="btn__icon">✅</span> Copied!'; setTimeout(() => { copyBtn.innerHTML = '<span class="btn__icon">📋</span> Copy to Clipboard'; }, 2000); });
    });
  }

  const downloadBtn = document.getElementById('download-json-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadFile('edesign_output.json', JSON.stringify(state.results, null, 2), 'application/json');
    });
  }

  const exportJsonBtn = document.getElementById('export-json-btn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      downloadFile('edesign_output.json', JSON.stringify(state.results, null, 2), 'application/json');
    });
  }

  const exportBomBtn = document.getElementById('export-bom-btn');
  if (exportBomBtn) {
    exportBomBtn.addEventListener('click', () => {
      const bom = state.results.componentSelection.bom;
      let csv = 'No.,Component,Value,Package,Quantity,Category\n';
      bom.forEach((item, idx) => {
        csv += `${idx + 1},"${item.name}","${item.value}","${item.package}",${item.quantity},"${item.category || 'Other'}"\n`;
      });
      downloadFile('edesign_bom.csv', csv, 'text/csv');
    });
  }

  // Code tab buttons
  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn && state.results && state.results.firmware) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(state.results.firmware.code)
        .then(() => { copyCodeBtn.innerHTML = '<span class="btn__icon">✅</span> Copied!'; setTimeout(() => { copyCodeBtn.innerHTML = '<span class="btn__icon">📋</span> Copy Code'; }, 2000); });
    });
  }

  const downloadInoBtn = document.getElementById('download-ino-btn');
  if (downloadInoBtn && state.results && state.results.firmware) {
    downloadInoBtn.addEventListener('click', () => {
      downloadFile('edesign_firmware.ino', state.results.firmware.code, 'text/plain');
    });
  }
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ================================================================
// Pipeline Execution
// ================================================================
async function handleRun() {
  const textarea = document.getElementById('prompt-input');
  const userPrompt = textarea ? textarea.value.trim() : '';

  if (!userPrompt) {
    textarea.focus();
    textarea.style.borderColor = 'var(--accent-rose)';
    setTimeout(() => { textarea.style.borderColor = ''; }, 2000);
    return;
  }

  state.userPrompt = userPrompt;
  state.isRunning = true;
  state.results = null;
  state.activeTab = 'summary';
  state.agentStates = {};
  AGENTS.forEach(a => { state.agentStates[a.id] = 'pending'; });

  // Re-render to show pipeline
  updateApp();

  try {
    const results = await runPipeline(userPrompt, (agentId, status) => {
      state.agentStates[agentId] = status;
      updatePipeline();
    });

    state.results = results;
    state.isRunning = false;
    updateApp();

    // Smooth scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  } catch (err) {
    console.error('Pipeline error:', err);
    state.isRunning = false;
    updateApp();
  }
}

// ================================================================
// Partial Updates (avoid full re-render during pipeline)
// ================================================================
function updatePipeline() {
  const section = document.getElementById('pipeline-section');
  if (section) {
    section.outerHTML = renderPipeline();
  }
}

function updateResults() {
  // Update tab active states
  document.querySelectorAll('.results__tab').forEach(tab => {
    tab.classList.toggle('results__tab--active', tab.dataset.tab === state.activeTab);
  });

  // Update panel content
  const panel = document.getElementById('results-panel');
  if (panel) {
    panel.innerHTML = renderTabContent();
    bindExportButtons();

    // Render schematic if needed
    if (state.activeTab === 'schematic' && state.results) {
      const container = document.getElementById('schematic-container');
      if (container) {
        renderSchematic(state.results.circuitDesign, container);
      }
    }
  }
}

function updateApp() {
  const app = document.getElementById('app');
  app.innerHTML = renderApp();
  bindEvents();
}

// ================================================================
// Boot
// ================================================================
document.addEventListener('DOMContentLoaded', init);
init();
