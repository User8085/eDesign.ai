/* ================================================================
   EDESIGN.AI — SVG Schematic Renderer
   Generates visual block-diagram schematic from circuit design data
   ================================================================ */

const COLORS = {
  MCU: { fill: '#1e1b4b', stroke: '#6366f1', text: '#a5b4fc' },
  Power: { fill: '#1a1f16', stroke: '#10b981', text: '#6ee7b7' },
  Sensor: { fill: '#1a1520', stroke: '#8b5cf6', text: '#c4b5fd' },
  Display: { fill: '#172025', stroke: '#06b6d4', text: '#67e8f9' },
  Driver: { fill: '#251a15', stroke: '#f59e0b', text: '#fcd34d' },
  Actuator: { fill: '#251515', stroke: '#f43f5e', text: '#fda4af' },
  Output: { fill: '#1a2520', stroke: '#10b981', text: '#6ee7b7' },
  Connector: { fill: '#1a1a24', stroke: '#6b7280', text: '#d1d5db' },
  Wireless: { fill: '#172025', stroke: '#06b6d4', text: '#67e8f9' },
  Module: { fill: '#1a1520', stroke: '#8b5cf6', text: '#c4b5fd' },
  Input: { fill: '#1a1a24', stroke: '#6b7280', text: '#d1d5db' },
  Support: { fill: '#1a1a24', stroke: '#6b7280', text: '#d1d5db' },
  Passive: { fill: '#1a1a24', stroke: '#6b7280', text: '#d1d5db' },
};

const TYPE_ICONS = {
  MCU: '⬡',
  Power: '⚡',
  Sensor: '◉',
  Display: '▣',
  Driver: '⚙',
  Actuator: '↺',
  Output: '◈',
  Connector: '⊡',
  Wireless: '◎',
  Module: '▧',
  Input: '▷',
  Support: '○',
  Passive: '▪',
};

/**
 * Renders block-diagram schematic as SVG
 */
export function renderSchematic(circuitDesign, containerElement) {
  const components = circuitDesign.components;
  const connections = circuitDesign.connections;

  if (!components || components.length === 0) {
    containerElement.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 40px;">No components to render</p>';
    return;
  }

  // Layout: arrange components in concentric layout around MCU
  const mcuIndex = components.findIndex(c => c.type === 'MCU');
  const mcu = mcuIndex >= 0 ? components[mcuIndex] : components[0];
  const nonMcu = components.filter((_, i) => i !== mcuIndex);

  const BLOCK_W = 160;
  const BLOCK_H = 60;
  const PADDING = 40;

  // Group components by type
  const groups = {
    power: nonMcu.filter(c => ['Power', 'Connector'].includes(c.type)),
    sensors: nonMcu.filter(c => ['Sensor', 'Input', 'Module'].includes(c.type)),
    outputs: nonMcu.filter(c => ['Display', 'Output', 'Actuator', 'Driver', 'Wireless'].includes(c.type)),
    support: nonMcu.filter(c => ['Support', 'Passive'].includes(c.type)),
  };

  // Calculate positions
  const positions = {};
  const mcuX = 400;
  const mcuY = 300;
  positions[mcu.name] = { x: mcuX, y: mcuY };

  // Power components on the left
  groups.power.forEach((comp, i) => {
    positions[comp.name] = {
      x: 80,
      y: 100 + i * (BLOCK_H + 30),
    };
  });

  // Sensors on top
  groups.sensors.forEach((comp, i) => {
    positions[comp.name] = {
      x: 200 + i * (BLOCK_W + 30),
      y: 60,
    };
  });

  // Outputs on the right
  groups.outputs.forEach((comp, i) => {
    positions[comp.name] = {
      x: 700,
      y: 100 + i * (BLOCK_H + 30),
    };
  });

  // Support on bottom
  groups.support.forEach((comp, i) => {
    positions[comp.name] = {
      x: 200 + i * (BLOCK_W + 30),
      y: 520,
    };
  });

  // Calculate SVG bounds
  let maxX = 0, maxY = 0;
  Object.values(positions).forEach(pos => {
    maxX = Math.max(maxX, pos.x + BLOCK_W + PADDING);
    maxY = Math.max(maxY, pos.y + BLOCK_H + PADDING);
  });
  maxX = Math.max(maxX, 900);
  maxY = Math.max(maxY, 620);

  // Build SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${maxX} ${maxY}" class="schematic-canvas">`;

  // Defs for markers and filters
  svg += `
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563"/>
      </marker>
      <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1"/>
      </marker>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="mcuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#312e81"/>
      </linearGradient>
    </defs>
  `;

  // Background grid
  svg += `
    <pattern id="schematicGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99,102,241,0.04)" stroke-width="0.5"/>
    </pattern>
    <rect width="100%" height="100%" fill="url(#schematicGrid)"/>
  `;

  // Draw connections first (behind blocks)
  connections.forEach((conn) => {
    const fromPos = positions[conn.from];
    const toPos = positions[conn.to];
    if (!fromPos || !toPos) return;

    const fromCx = fromPos.x + BLOCK_W / 2;
    const fromCy = fromPos.y + BLOCK_H / 2;
    const toCx = toPos.x + BLOCK_W / 2;
    const toCy = toPos.y + BLOCK_H / 2;

    // Calculate control points for curved line
    const midX = (fromCx + toCx) / 2;
    const midY = (fromCy + toCy) / 2;
    const dx = toCx - fromCx;
    const dy = toCy - fromCy;

    let cx1, cy1, cx2, cy2;
    if (Math.abs(dx) > Math.abs(dy)) {
      cx1 = fromCx + dx * 0.3;
      cy1 = fromCy;
      cx2 = toCx - dx * 0.3;
      cy2 = toCy;
    } else {
      cx1 = fromCx;
      cy1 = fromCy + dy * 0.3;
      cx2 = toCx;
      cy2 = toCy - dy * 0.3;
    }

    const isPower = conn.description.toLowerCase().includes('power') || conn.description.toLowerCase().includes('supply') || conn.description.toLowerCase().includes('regulat');
    const strokeColor = isPower ? '#10b981' : '#4b5563';
    const strokeDash = isPower ? '' : '4 3';

    svg += `
      <path d="M ${fromCx} ${fromCy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toCx} ${toCy}" 
            fill="none" stroke="${strokeColor}" stroke-width="1.5" 
            stroke-dasharray="${strokeDash}" 
            marker-end="url(#arrowhead)" opacity="0.6"
            class="circuit-line"/>
    `;

    // Connection label
    const labelX = midX;
    const labelY = midY - 8;
    const shortDesc = conn.description.length > 25 
      ? conn.description.substring(0, 22) + '...' 
      : conn.description;
    svg += `
      <text x="${labelX}" y="${labelY}" text-anchor="middle" class="schematic-label" 
            fill="#6b7280" font-size="9" opacity="0.7">${escapeXml(shortDesc)}</text>
    `;
  });

  // Draw component blocks
  components.forEach((comp) => {
    const pos = positions[comp.name];
    if (!pos) return;

    const colors = COLORS[comp.type] || COLORS.Support;
    const icon = TYPE_ICONS[comp.type] || '□';
    const isMCU = comp.type === 'MCU';

    const bw = isMCU ? BLOCK_W + 40 : BLOCK_W;
    const bh = isMCU ? BLOCK_H + 20 : BLOCK_H;
    const bx = isMCU ? pos.x - 20 : pos.x;
    const by = isMCU ? pos.y - 10 : pos.y;

    // Block shadow
    svg += `<rect x="${bx + 2}" y="${by + 2}" width="${bw}" height="${bh}" rx="8" 
              fill="rgba(0,0,0,0.3)" />`;

    // Block background
    svg += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" 
              fill="${isMCU ? 'url(#mcuGrad)' : colors.fill}" 
              stroke="${colors.stroke}" stroke-width="${isMCU ? 2 : 1.5}" 
              ${isMCU ? 'filter="url(#glow)"' : ''}
              class="schematic-node"/>`;

    // Pins (small dots)
    if (!isMCU) {
      svg += `<circle cx="${bx}" cy="${by + bh/2}" r="3" fill="${colors.stroke}" opacity="0.6"/>`;
      svg += `<circle cx="${bx + bw}" cy="${by + bh/2}" r="3" fill="${colors.stroke}" opacity="0.6"/>`;
    } else {
      // MCU has multiple pins
      for (let i = 0; i < 4; i++) {
        const py = by + 12 + (i * (bh - 24) / 3);
        svg += `<circle cx="${bx}" cy="${py}" r="2.5" fill="${colors.stroke}" opacity="0.5"/>`;
        svg += `<circle cx="${bx + bw}" cy="${py}" r="2.5" fill="${colors.stroke}" opacity="0.5"/>`;
      }
      // Top/bottom pins
      for (let i = 0; i < 3; i++) {
        const px = bx + 30 + (i * (bw - 60) / 2);
        svg += `<circle cx="${px}" cy="${by}" r="2.5" fill="${colors.stroke}" opacity="0.5"/>`;
        svg += `<circle cx="${px}" cy="${by + bh}" r="2.5" fill="${colors.stroke}" opacity="0.5"/>`;
      }
    }

    // Icon
    svg += `<text x="${bx + 14}" y="${by + bh/2 + 1}" font-size="${isMCU ? 18 : 14}" 
              fill="${colors.text}" dominant-baseline="middle">${icon}</text>`;

    // Component name (truncated)
    const displayName = comp.name.length > 18 ? comp.name.substring(0, 15) + '...' : comp.name;
    svg += `<text x="${bx + (isMCU ? 38 : 32)}" y="${by + bh/2 - 6}" 
              class="schematic-component-label" fill="${colors.text}" 
              font-size="${isMCU ? 12 : 10}" font-weight="600">${escapeXml(displayName)}</text>`;

    // Type label
    svg += `<text x="${bx + (isMCU ? 38 : 32)}" y="${by + bh/2 + 10}" 
              fill="${colors.text}" font-size="9" opacity="0.6" 
              font-family="'JetBrains Mono', monospace">${escapeXml(comp.type)}</text>`;
  });

  // Title
  svg += `
    <text x="20" y="${maxY - 15}" font-family="'Inter', sans-serif" font-size="10" 
          fill="#4b5563" font-weight="500">Edesign.ai — Block Diagram Schematic</text>
  `;

  svg += '</svg>';
  containerElement.innerHTML = svg;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
