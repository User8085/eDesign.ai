/* ================================================================
   EDESIGN.AI — Multi-Agent Electronic Design Pipeline
   ================================================================
   Each agent performs a specialized role and passes structured
   output to the next agent in the pipeline.
   ================================================================ */

/**
 * Simulates processing delay with progress reporting
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ================================================================
   AGENT 1: REQUIREMENT ANALYZER
   ================================================================ */
export async function agentRequirementAnalyzer(userPrompt) {
  await delay(800);

  const promptLower = userPrompt.toLowerCase();

  // Parse purpose
  let purpose = userPrompt.split(/[.!?]/)[0].trim();
  if (purpose.length > 120) purpose = purpose.substring(0, 120) + '...';

  // Detect inputs
  const inputs = [];
  const inputKeywords = {
    'temperature': 'Temperature sensor input (analog)',
    'humidity': 'Humidity sensor input (analog/digital)',
    'pressure': 'Pressure sensor input',
    'light': 'Light/ambient sensor input (analog)',
    'motion': 'Motion/PIR sensor input (digital)',
    'ultrasonic': 'Ultrasonic distance sensor input',
    'accelerometer': 'Accelerometer data (I2C/SPI)',
    'gyroscope': 'Gyroscope data (I2C/SPI)',
    'gps': 'GPS module NMEA data (UART)',
    'camera': 'Camera module input (CSI/SPI)',
    'button': 'Push button input (digital)',
    'switch': 'Switch input (digital)',
    'potentiometer': 'Potentiometer input (analog)',
    'microphone': 'Audio input (analog/I2S)',
    'touchscreen': 'Touch panel input (I2C/SPI)',
    'current': 'Current sensor input (analog)',
    'voltage': 'Voltage sensor input (analog)',
    'soil moisture': 'Soil moisture sensor (analog)',
    'gas': 'Gas sensor input (analog)',
    'ir': 'IR receiver input (digital)',
    'rfid': 'RFID reader input (SPI)',
    'encoder': 'Rotary encoder input (digital)',
    'keypad': 'Keypad matrix input',
    'adc': 'ADC input',
    'sensor': 'Sensor input',
  };

  for (const [key, desc] of Object.entries(inputKeywords)) {
    if (promptLower.includes(key)) inputs.push(desc);
  }
  if (inputs.length === 0) inputs.push('Power input', 'User input (buttons/switches)');

  // Detect outputs
  const outputs = [];
  const outputKeywords = {
    'led': 'LED indicator output (digital/PWM)',
    'display': 'Display output (I2C/SPI)',
    'oled': 'OLED display output (I2C)',
    'lcd': 'LCD display output (I2C/parallel)',
    'motor': 'Motor driver output (PWM)',
    'servo': 'Servo motor output (PWM)',
    'relay': 'Relay control output (digital)',
    'buzzer': 'Buzzer/speaker output (digital/PWM)',
    'bluetooth': 'Bluetooth wireless output',
    'wifi': 'WiFi wireless output',
    'lora': 'LoRa wireless output',
    'speaker': 'Audio output (DAC/I2S)',
    'actuator': 'Actuator output',
    'pump': 'Pump control output (relay/MOSFET)',
    'heater': 'Heater control output (relay/MOSFET)',
    'fan': 'Fan control output (PWM/relay)',
    'rgb': 'RGB LED strip output (PWM/WS2812)',
    'dac': 'DAC output',
    'uart': 'UART serial output',
    'usb': 'USB output',
    'data': 'Data output',
    'cloud': 'Cloud/server data push',
    'log': 'Data logging output',
  };

  for (const [key, desc] of Object.entries(outputKeywords)) {
    if (promptLower.includes(key)) outputs.push(desc);
  }
  if (outputs.length === 0) outputs.push('Status LED output', 'Debug UART output');

  // Detect power requirements
  let power = '5V DC via USB (500mA)';
  if (promptLower.includes('battery') || promptLower.includes('portable')) {
    power = '3.7V LiPo battery (1000-2000mAh) with charging circuit';
  } else if (promptLower.includes('12v') || promptLower.includes('motor') || promptLower.includes('relay')) {
    power = '12V DC adapter (1-2A) with 5V/3.3V regulation';
  } else if (promptLower.includes('solar')) {
    power = 'Solar panel (6V/2W) with battery backup and MPPT';
  } else if (promptLower.includes('3.3v') || promptLower.includes('3v3')) {
    power = '3.3V regulated supply';
  } else if (promptLower.includes('24v') || promptLower.includes('industrial')) {
    power = '24V DC industrial supply with local regulation';
  }

  // Detect constraints
  const constraints = [];
  if (promptLower.includes('low power') || promptLower.includes('battery') || promptLower.includes('energy'))
    constraints.push('Low power consumption required');
  if (promptLower.includes('small') || promptLower.includes('compact') || promptLower.includes('miniature'))
    constraints.push('Compact form factor required');
  if (promptLower.includes('cheap') || promptLower.includes('cost') || promptLower.includes('budget'))
    constraints.push('Cost-optimized component selection');
  if (promptLower.includes('outdoor') || promptLower.includes('weather') || promptLower.includes('waterproof'))
    constraints.push('Weatherproof enclosure needed (IP65+)');
  if (promptLower.includes('fast') || promptLower.includes('real-time') || promptLower.includes('low latency'))
    constraints.push('Real-time processing required');
  if (promptLower.includes('high current') || promptLower.includes('high power'))
    constraints.push('High current handling required');
  if (promptLower.includes('noise') || promptLower.includes('emc') || promptLower.includes('emi'))
    constraints.push('EMI/EMC compliance required');
  if (constraints.length === 0) {
    constraints.push('Standard PCB size (< 100x100mm)', 'Through-hole & SMD components acceptable');
  }

  // Detect protocols
  const protocols = [];
  const protocolKeywords = {
    'i2c': 'I2C',
    'spi': 'SPI',
    'uart': 'UART',
    'usb': 'USB',
    'can': 'CAN Bus',
    'modbus': 'Modbus',
    'wifi': 'WiFi (802.11 b/g/n)',
    'bluetooth': 'Bluetooth / BLE',
    'ble': 'Bluetooth Low Energy',
    'lora': 'LoRa / LoRaWAN',
    'zigbee': 'Zigbee',
    'mqtt': 'MQTT (over WiFi/Ethernet)',
    'http': 'HTTP/HTTPS',
    'ethernet': 'Ethernet (TCP/IP)',
    'rs485': 'RS-485',
    'rs232': 'RS-232',
    'pwm': 'PWM',
    '1-wire': '1-Wire',
    'onewire': '1-Wire',
    'nfc': 'NFC',
    'infrared': 'IR Communication',
  };

  for (const [key, desc] of Object.entries(protocolKeywords)) {
    if (promptLower.includes(key)) protocols.push(desc);
  }
  if (protocols.length === 0) {
    if (promptLower.includes('wireless') || promptLower.includes('iot') || promptLower.includes('internet'))
      protocols.push('WiFi (802.11 b/g/n)', 'MQTT');
    else
      protocols.push('UART (debug)', 'I2C (sensor bus)');
  }

  return {
    purpose,
    inputs,
    outputs,
    power,
    constraints,
    protocols
  };
}

/* ================================================================
   AGENT 2: CIRCUIT DESIGN ENGINEER
   ================================================================ */
export async function agentCircuitDesigner(requirements) {
  await delay(1200);

  const components = [];
  const connections = [];
  const inputsStr = requirements.inputs.join(' ').toLowerCase();
  const outputsStr = requirements.outputs.join(' ').toLowerCase();
  const purposeStr = requirements.purpose.toLowerCase();
  const protocolsStr = requirements.protocols.join(' ').toLowerCase();
  const powerStr = requirements.power.toLowerCase();

  // Determine MCU
  let mcuType = 'general';
  if (protocolsStr.includes('wifi') || protocolsStr.includes('bluetooth') || protocolsStr.includes('ble') ||
      purposeStr.includes('iot') || purposeStr.includes('wifi') || purposeStr.includes('internet')) {
    mcuType = 'wifi_bt';
  } else if (protocolsStr.includes('lora')) {
    mcuType = 'lora';
  } else if (purposeStr.includes('simple') || purposeStr.includes('basic')) {
    mcuType = 'simple';
  }

  const mcuMap = {
    'wifi_bt': { name: 'Microcontroller (WiFi+BT)', type: 'MCU', desc: 'ESP32-based WiFi/BLE module' },
    'lora': { name: 'Microcontroller (LoRa)', type: 'MCU', desc: 'STM32 with LoRa module' },
    'simple': { name: 'Microcontroller (8-bit)', type: 'MCU', desc: 'ATmega328P-based controller' },
    'general': { name: 'Microcontroller (32-bit)', type: 'MCU', desc: 'ARM Cortex-M based controller' },
  };

  components.push(mcuMap[mcuType]);

  // Power supply components
  if (powerStr.includes('lipo') || powerStr.includes('battery')) {
    components.push({ name: 'LiPo Battery', type: 'Power', desc: '3.7V rechargeable lithium polymer battery' });
    components.push({ name: 'Battery Charger IC', type: 'Power', desc: 'USB LiPo charging controller' });
    components.push({ name: 'LDO Regulator (3.3V)', type: 'Power', desc: 'Low-dropout 3.3V regulator' });
    connections.push({ from: 'LiPo Battery', to: 'Battery Charger IC', description: 'Battery charge path' });
    connections.push({ from: 'Battery Charger IC', to: 'LDO Regulator (3.3V)', description: 'Regulated output to LDO' });
    connections.push({ from: 'LDO Regulator (3.3V)', to: mcuMap[mcuType].name, description: '3.3V power supply to MCU' });
  } else if (powerStr.includes('12v')) {
    components.push({ name: 'DC Barrel Jack', type: 'Connector', desc: '12V DC input connector' });
    components.push({ name: 'Buck Converter (5V)', type: 'Power', desc: '12V to 5V step-down converter' });
    components.push({ name: 'LDO Regulator (3.3V)', type: 'Power', desc: '5V to 3.3V LDO regulator' });
    connections.push({ from: 'DC Barrel Jack', to: 'Buck Converter (5V)', description: '12V input to buck converter' });
    connections.push({ from: 'Buck Converter (5V)', to: 'LDO Regulator (3.3V)', description: '5V to 3.3V regulation' });
    connections.push({ from: 'LDO Regulator (3.3V)', to: mcuMap[mcuType].name, description: '3.3V power supply to MCU' });
  } else if (powerStr.includes('solar')) {
    components.push({ name: 'Solar Panel', type: 'Power', desc: '6V 2W solar panel' });
    components.push({ name: 'MPPT Controller', type: 'Power', desc: 'Maximum power point tracking charger' });
    components.push({ name: 'LiPo Battery', type: 'Power', desc: 'Backup battery (3.7V)' });
    components.push({ name: 'LDO Regulator (3.3V)', type: 'Power', desc: '3.3V output regulator' });
    connections.push({ from: 'Solar Panel', to: 'MPPT Controller', description: 'Solar input to MPPT' });
    connections.push({ from: 'MPPT Controller', to: 'LiPo Battery', description: 'Battery charging path' });
    connections.push({ from: 'LiPo Battery', to: 'LDO Regulator (3.3V)', description: 'Battery to regulator' });
    connections.push({ from: 'LDO Regulator (3.3V)', to: mcuMap[mcuType].name, description: '3.3V supply to MCU' });
  } else {
    components.push({ name: 'USB-C Connector', type: 'Connector', desc: 'USB Type-C power/data input' });
    components.push({ name: 'LDO Regulator (3.3V)', type: 'Power', desc: '5V to 3.3V LDO regulator' });
    connections.push({ from: 'USB-C Connector', to: 'LDO Regulator (3.3V)', description: 'USB 5V to 3.3V regulation' });
    connections.push({ from: 'LDO Regulator (3.3V)', to: mcuMap[mcuType].name, description: '3.3V power supply' });
  }

  // Power filtering
  components.push({ name: 'Decoupling Capacitors', type: 'Passive', desc: '100nF + 10µF ceramic caps near power pins' });
  connections.push({ from: 'Decoupling Capacitors', to: mcuMap[mcuType].name, description: 'Power filtering at MCU VDD pins' });

  // Sensor components
  if (inputsStr.includes('temperature') || inputsStr.includes('humidity')) {
    components.push({ name: 'Temp/Humidity Sensor', type: 'Sensor', desc: 'Digital temperature & humidity sensor' });
    connections.push({ from: 'Temp/Humidity Sensor', to: mcuMap[mcuType].name, description: 'I2C data bus (SDA/SCL)' });
  }
  if (inputsStr.includes('pressure')) {
    components.push({ name: 'Barometric Pressure Sensor', type: 'Sensor', desc: 'Digital barometric pressure sensor' });
    connections.push({ from: 'Barometric Pressure Sensor', to: mcuMap[mcuType].name, description: 'I2C data bus (SDA/SCL)' });
  }
  if (inputsStr.includes('light') || inputsStr.includes('ambient')) {
    components.push({ name: 'Light Sensor', type: 'Sensor', desc: 'Ambient light sensor (analog)' });
    connections.push({ from: 'Light Sensor', to: mcuMap[mcuType].name, description: 'Analog input (ADC pin)' });
  }
  if (inputsStr.includes('motion') || inputsStr.includes('pir')) {
    components.push({ name: 'PIR Motion Sensor', type: 'Sensor', desc: 'Passive infrared motion detector' });
    connections.push({ from: 'PIR Motion Sensor', to: mcuMap[mcuType].name, description: 'Digital GPIO input' });
  }
  if (inputsStr.includes('ultrasonic') || inputsStr.includes('distance')) {
    components.push({ name: 'Ultrasonic Sensor', type: 'Sensor', desc: 'Ultrasonic distance measurement module' });
    connections.push({ from: 'Ultrasonic Sensor', to: mcuMap[mcuType].name, description: 'Trigger (GPIO out) + Echo (GPIO in)' });
  }
  if (inputsStr.includes('accelerometer') || inputsStr.includes('gyroscope') || inputsStr.includes('imu')) {
    components.push({ name: 'IMU (6-axis)', type: 'Sensor', desc: '3-axis accelerometer + 3-axis gyroscope' });
    connections.push({ from: 'IMU (6-axis)', to: mcuMap[mcuType].name, description: 'I2C/SPI data bus + INT pin' });
  }
  if (inputsStr.includes('gps') || inputsStr.includes('nmea')) {
    components.push({ name: 'GPS Module', type: 'Module', desc: 'GNSS receiver module with antenna' });
    connections.push({ from: 'GPS Module', to: mcuMap[mcuType].name, description: 'UART TX/RX for NMEA data' });
  }
  if (inputsStr.includes('current sensor')) {
    components.push({ name: 'Current Sensor', type: 'Sensor', desc: 'Hall-effect current sensor' });
    connections.push({ from: 'Current Sensor', to: mcuMap[mcuType].name, description: 'Analog output to ADC pin' });
  }
  if (inputsStr.includes('gas sensor')) {
    components.push({ name: 'Gas Sensor', type: 'Sensor', desc: 'MQ-series metal oxide gas sensor' });
    connections.push({ from: 'Gas Sensor', to: mcuMap[mcuType].name, description: 'Analog output to ADC pin' });
  }
  if (inputsStr.includes('soil moisture')) {
    components.push({ name: 'Soil Moisture Sensor', type: 'Sensor', desc: 'Capacitive soil moisture sensor' });
    connections.push({ from: 'Soil Moisture Sensor', to: mcuMap[mcuType].name, description: 'Analog output to ADC pin' });
  }
  if (inputsStr.includes('rfid')) {
    components.push({ name: 'RFID Reader', type: 'Module', desc: '13.56MHz RFID/NFC reader module' });
    connections.push({ from: 'RFID Reader', to: mcuMap[mcuType].name, description: 'SPI bus (MOSI/MISO/SCK/CS)' });
  }
  if (inputsStr.includes('button') || inputsStr.includes('switch') || inputsStr.includes('user input')) {
    components.push({ name: 'Push Buttons', type: 'Input', desc: 'Tactile push buttons with pull-up resistors' });
    connections.push({ from: 'Push Buttons', to: mcuMap[mcuType].name, description: 'Digital GPIO with internal/external pull-ups' });
  }

  // Output components
  if (outputsStr.includes('oled')) {
    components.push({ name: 'OLED Display', type: 'Display', desc: '0.96" or 1.3" OLED module' });
    connections.push({ from: mcuMap[mcuType].name, to: 'OLED Display', description: 'I2C data bus (SDA/SCL)' });
  } else if (outputsStr.includes('lcd')) {
    components.push({ name: 'LCD Display', type: 'Display', desc: 'Character or TFT LCD module' });
    connections.push({ from: mcuMap[mcuType].name, to: 'LCD Display', description: 'I2C or parallel data bus' });
  } else if (outputsStr.includes('display')) {
    components.push({ name: 'OLED Display', type: 'Display', desc: '0.96" OLED I2C display module' });
    connections.push({ from: mcuMap[mcuType].name, to: 'OLED Display', description: 'I2C data bus (SDA/SCL)' });
  }

  if (outputsStr.includes('motor') || outputsStr.includes('servo')) {
    components.push({ name: 'Motor Driver', type: 'Driver', desc: 'H-bridge motor driver module' });
    components.push({ name: 'DC Motor / Servo', type: 'Actuator', desc: 'Motor or servo actuator' });
    connections.push({ from: mcuMap[mcuType].name, to: 'Motor Driver', description: 'PWM + direction GPIO signals' });
    connections.push({ from: 'Motor Driver', to: 'DC Motor / Servo', description: 'Motor power output' });
  }

  if (outputsStr.includes('relay')) {
    components.push({ name: 'Relay Module', type: 'Actuator', desc: 'Relay with optocoupler isolation' });
    connections.push({ from: mcuMap[mcuType].name, to: 'Relay Module', description: 'Digital GPIO control signal' });
  }

  if (outputsStr.includes('buzzer') || outputsStr.includes('speaker') || outputsStr.includes('audio')) {
    components.push({ name: 'Buzzer/Speaker', type: 'Output', desc: 'Piezo buzzer or small speaker with driver' });
    connections.push({ from: mcuMap[mcuType].name, to: 'Buzzer/Speaker', description: 'PWM or DAC audio output' });
  }

  if (outputsStr.includes('led') || outputsStr.includes('status')) {
    components.push({ name: 'Status LEDs', type: 'Output', desc: 'Indicator LEDs with current-limiting resistors' });
    connections.push({ from: mcuMap[mcuType].name, to: 'Status LEDs', description: 'Digital GPIO with series resistors (220Ω)' });
  }

  if (outputsStr.includes('rgb') || outputsStr.includes('ws2812') || outputsStr.includes('neopixel')) {
    components.push({ name: 'RGB LED Strip', type: 'Output', desc: 'Addressable WS2812B LED strip' });
    connections.push({ from: mcuMap[mcuType].name, to: 'RGB LED Strip', description: 'Single-wire data out (GPIO)' });
  }

  // Communication modules
  if (protocolsStr.includes('lora')) {
    components.push({ name: 'LoRa Transceiver', type: 'Wireless', desc: 'SX1276/78 LoRa module with antenna' });
    connections.push({ from: mcuMap[mcuType].name, to: 'LoRa Transceiver', description: 'SPI bus + DIO interrupt pins' });
  }

  // Programming / Debug header
  components.push({ name: 'Programming Header', type: 'Connector', desc: 'UART/JTAG/SWD programming interface' });
  connections.push({ from: 'Programming Header', to: mcuMap[mcuType].name, description: 'Debug/programming interface' });

  // Reset circuit
  components.push({ name: 'Reset Circuit', type: 'Support', desc: 'Reset button with RC debounce' });
  connections.push({ from: 'Reset Circuit', to: mcuMap[mcuType].name, description: 'RESET pin with pull-up and cap' });

  // Crystal oscillator (if not ESP32)
  if (mcuType !== 'wifi_bt') {
    components.push({ name: 'Crystal Oscillator', type: 'Support', desc: 'Main clock crystal with load capacitors' });
    connections.push({ from: 'Crystal Oscillator', to: mcuMap[mcuType].name, description: 'XTAL1/XTAL2 pins' });
  }

  const design_notes = `Circuit designed for ${requirements.purpose}. ` +
    `Power supply: ${requirements.power}. ` +
    `Communication via ${requirements.protocols.join(', ')}. ` +
    `Ensure adequate decoupling capacitors near all IC power pins. ` +
    `Use proper ESD protection on external-facing connectors.`;

  return {
    components,
    connections,
    design_notes
  };
}

/* ================================================================
   AGENT 3: COMPONENT SELECTION ENGINEER
   ================================================================ */
export async function agentComponentSelector(circuitDesign, requirements) {
  await delay(1000);

  const bom = [];
  const protocolsStr = requirements.protocols.join(' ').toLowerCase();
  const purposeStr = requirements.purpose.toLowerCase();

  for (const comp of circuitDesign.components) {
    const nameLower = comp.name.toLowerCase();

    // MCU selection
    if (comp.type === 'MCU') {
      if (nameLower.includes('wifi') || nameLower.includes('bt')) {
        bom.push({ name: 'ESP32-WROOM-32E', value: 'WiFi+BLE MCU', package: 'Module (18x25.5mm)', quantity: 1, datasheet: 'Espressif ESP32 Technical Reference', category: 'MCU' });
      } else if (nameLower.includes('lora')) {
        bom.push({ name: 'STM32L073RZT6', value: 'ARM Cortex-M0+ MCU', package: 'LQFP-64', quantity: 1, datasheet: 'STMicroelectronics STM32L073', category: 'MCU' });
      } else if (nameLower.includes('8-bit')) {
        bom.push({ name: 'ATmega328P-AU', value: '8-bit AVR MCU', package: 'TQFP-32', quantity: 1, datasheet: 'Microchip ATmega328P', category: 'MCU' });
      } else {
        bom.push({ name: 'STM32F411CEU6', value: 'ARM Cortex-M4 MCU', package: 'UFQFPN-48', quantity: 1, datasheet: 'STMicroelectronics STM32F411', category: 'MCU' });
      }
    }

    // Power components
    else if (nameLower.includes('ldo regulator')) {
      bom.push({ name: 'AMS1117-3.3', value: '3.3V LDO (1A)', package: 'SOT-223', quantity: 1, datasheet: 'Advanced Monolithic Systems AMS1117', category: 'Power' });
      bom.push({ name: 'Capacitor (Input)', value: '10µF/25V', package: '0805 Ceramic', quantity: 1, category: 'Passive' });
      bom.push({ name: 'Capacitor (Output)', value: '22µF/10V', package: '0805 Ceramic', quantity: 1, category: 'Passive' });
    }
    else if (nameLower.includes('buck converter')) {
      bom.push({ name: 'LM2596S-5.0', value: '5V Buck Converter (3A)', package: 'TO-263-5', quantity: 1, datasheet: 'Texas Instruments LM2596', category: 'Power' });
      bom.push({ name: 'Inductor', value: '33µH/3A', package: 'Radial 10x10mm', quantity: 1, category: 'Passive' });
      bom.push({ name: 'Schottky Diode', value: 'SS34 (3A/40V)', package: 'SMA', quantity: 1, category: 'Power' });
      bom.push({ name: 'Capacitor (Buck In)', value: '680µF/25V', package: 'Electrolytic 10x12mm', quantity: 1, category: 'Passive' });
      bom.push({ name: 'Capacitor (Buck Out)', value: '220µF/10V', package: 'Electrolytic 8x10mm', quantity: 1, category: 'Passive' });
    }
    else if (nameLower.includes('battery charger')) {
      bom.push({ name: 'TP4056', value: 'LiPo Charger IC (1A)', package: 'SOP-8', quantity: 1, datasheet: 'NanJing Top Power TP4056', category: 'Power' });
      bom.push({ name: 'DW01A', value: 'Battery Protection IC', package: 'SOT-23-6', quantity: 1, category: 'Power' });
      bom.push({ name: 'FS8205A', value: 'Dual MOSFET (Protection)', package: 'TSSOP-8', quantity: 1, category: 'Power' });
    }
    else if (nameLower.includes('mppt')) {
      bom.push({ name: 'BQ25570', value: 'Ultra Low Power MPPT', package: 'DSBGA-20', quantity: 1, datasheet: 'Texas Instruments BQ25570', category: 'Power' });
    }

    // Connectors
    else if (nameLower.includes('usb-c')) {
      bom.push({ name: 'USB Type-C Connector', value: '16-pin USB-C', package: 'SMD USB-C', quantity: 1, category: 'Connector' });
      bom.push({ name: 'CC Resistors', value: '5.1kΩ', package: '0402', quantity: 2, category: 'Passive' });
    }
    else if (nameLower.includes('barrel jack')) {
      bom.push({ name: 'DC Barrel Jack', value: '2.1x5.5mm', package: 'Through-hole', quantity: 1, category: 'Connector' });
    }

    // Sensors
    else if (nameLower.includes('temp/humidity')) {
      bom.push({ name: 'SHT31-DIS', value: 'Digital Temp/Humidity', package: 'DFN-8 (2.5x2.5mm)', quantity: 1, datasheet: 'Sensirion SHT31', category: 'Sensor' });
      bom.push({ name: 'Pull-up Resistors (I2C)', value: '4.7kΩ', package: '0402', quantity: 2, category: 'Passive' });
    }
    else if (nameLower.includes('barometric') || nameLower.includes('pressure')) {
      bom.push({ name: 'BMP280', value: 'Barometric Pressure', package: 'LGA-8 (2x2.5mm)', quantity: 1, datasheet: 'Bosch BMP280', category: 'Sensor' });
    }
    else if (nameLower.includes('light sensor')) {
      bom.push({ name: 'BH1750FVI', value: 'Digital Ambient Light', package: 'WSOF6I (3x1.6mm)', quantity: 1, datasheet: 'ROHM BH1750FVI', category: 'Sensor' });
    }
    else if (nameLower.includes('pir motion')) {
      bom.push({ name: 'HC-SR501', value: 'PIR Motion Sensor', package: 'Module (32x24mm)', quantity: 1, category: 'Sensor' });
    }
    else if (nameLower.includes('ultrasonic')) {
      bom.push({ name: 'HC-SR04', value: 'Ultrasonic Distance', package: 'Module (45x20mm)', quantity: 1, category: 'Sensor' });
    }
    else if (nameLower.includes('imu') || nameLower.includes('6-axis')) {
      bom.push({ name: 'MPU-6050', value: '6-Axis IMU', package: 'QFN-24 (4x4mm)', quantity: 1, datasheet: 'InvenSense MPU-6050', category: 'Sensor' });
    }
    else if (nameLower.includes('gps')) {
      bom.push({ name: 'NEO-6M', value: 'GPS Module', package: 'Module (16x12.2mm)', quantity: 1, datasheet: 'u-blox NEO-6M', category: 'Module' });
      bom.push({ name: 'GPS Antenna', value: 'Ceramic Patch', package: '25x25mm', quantity: 1, category: 'Module' });
    }
    else if (nameLower.includes('current sensor')) {
      bom.push({ name: 'ACS712-20A', value: 'Hall Effect Current', package: 'SOIC-8', quantity: 1, datasheet: 'Allegro ACS712', category: 'Sensor' });
    }
    else if (nameLower.includes('gas sensor')) {
      bom.push({ name: 'MQ-2', value: 'Gas/Smoke Sensor', package: 'Module (32x20mm)', quantity: 1, category: 'Sensor' });
    }
    else if (nameLower.includes('soil moisture')) {
      bom.push({ name: 'Capacitive Soil Sensor v1.2', value: 'Soil Moisture', package: 'Module (98x23mm)', quantity: 1, category: 'Sensor' });
    }
    else if (nameLower.includes('rfid')) {
      bom.push({ name: 'MFRC522', value: '13.56MHz RFID', package: 'Module (40x60mm)', quantity: 1, datasheet: 'NXP MFRC522', category: 'Module' });
    }

    // Output components
    else if (nameLower.includes('oled')) {
      bom.push({ name: 'SSD1306 OLED', value: '0.96" 128x64 I2C', package: 'Module (27x27mm)', quantity: 1, datasheet: 'Solomon Systech SSD1306', category: 'Display' });
    }
    else if (nameLower.includes('lcd')) {
      bom.push({ name: 'HD44780 LCD 16x2', value: '16x2 Character LCD', package: 'Module (80x36mm)', quantity: 1, category: 'Display' });
      bom.push({ name: 'PCF8574T', value: 'I2C LCD Adapter', package: 'SOIC-16', quantity: 1, category: 'IC' });
    }
    else if (nameLower.includes('motor driver')) {
      bom.push({ name: 'L298N', value: 'Dual H-Bridge (2A)', package: 'Multiwatt-15', quantity: 1, datasheet: 'STMicroelectronics L298', category: 'Driver' });
      bom.push({ name: 'Flyback Diodes', value: '1N4007', package: 'DO-41', quantity: 4, category: 'Passive' });
    }
    else if (nameLower.includes('relay')) {
      bom.push({ name: 'SRD-05VDC-SL-C', value: '5V SPDT Relay (10A)', package: 'Module', quantity: 1, category: 'Actuator' });
      bom.push({ name: 'BC547B', value: 'NPN Transistor (Driver)', package: 'TO-92', quantity: 1, category: 'Active' });
      bom.push({ name: 'Flyback Diode', value: '1N4148', package: 'DO-35', quantity: 1, category: 'Passive' });
      bom.push({ name: 'Base Resistor', value: '1kΩ', package: '0402', quantity: 1, category: 'Passive' });
    }
    else if (nameLower.includes('buzzer') || nameLower.includes('speaker')) {
      bom.push({ name: 'Piezo Buzzer', value: '5V Active Buzzer', package: 'Through-hole (12mm)', quantity: 1, category: 'Output' });
    }
    else if (nameLower.includes('status led')) {
      bom.push({ name: 'LED (Green)', value: '3mm Green LED', package: 'Through-hole 3mm', quantity: 2, category: 'Output' });
      bom.push({ name: 'LED (Red)', value: '3mm Red LED', package: 'Through-hole 3mm', quantity: 1, category: 'Output' });
      bom.push({ name: 'LED Resistors', value: '220Ω', package: '0402', quantity: 3, category: 'Passive' });
    }
    else if (nameLower.includes('rgb led')) {
      bom.push({ name: 'WS2812B LED Strip', value: 'Addressable RGB (5V)', package: 'Strip/Individual', quantity: 1, category: 'Output' });
      bom.push({ name: 'Level Shifter', value: 'SN74HCT125N', package: 'PDIP-14', quantity: 1, category: 'IC' });
    }

    // Wireless modules
    else if (nameLower.includes('lora transceiver')) {
      bom.push({ name: 'RFM95W', value: '868/915MHz LoRa', package: 'Module (16x16mm)', quantity: 1, datasheet: 'HopeRF RFM95W', category: 'Wireless' });
      bom.push({ name: 'LoRa Antenna', value: 'SMA 868/915MHz', package: 'SMA connector + antenna', quantity: 1, category: 'Wireless' });
    }

    // Programming header
    else if (nameLower.includes('programming header')) {
      bom.push({ name: 'Pin Header (Programming)', value: '2.54mm 6-pin', package: 'Through-hole 1x6', quantity: 1, category: 'Connector' });
    }

    // Reset circuit
    else if (nameLower.includes('reset circuit')) {
      bom.push({ name: 'Tactile Switch (Reset)', value: '6x6mm', package: 'Through-hole', quantity: 1, category: 'Input' });
      bom.push({ name: 'Reset Pull-up', value: '10kΩ', package: '0402', quantity: 1, category: 'Passive' });
      bom.push({ name: 'Reset Cap', value: '100nF', package: '0402', quantity: 1, category: 'Passive' });
    }

    // Crystal
    else if (nameLower.includes('crystal')) {
      if (nameLower.includes('8-bit') || comp.desc.includes('ATmega')) {
        bom.push({ name: 'Crystal Oscillator', value: '16MHz', package: 'HC49/S', quantity: 1, category: 'Passive' });
      } else {
        bom.push({ name: 'Crystal Oscillator', value: '8MHz', package: 'HC49/S', quantity: 1, category: 'Passive' });
      }
      bom.push({ name: 'Load Capacitors', value: '22pF', package: '0402', quantity: 2, category: 'Passive' });
    }

    // Push buttons
    else if (nameLower.includes('push button')) {
      bom.push({ name: 'Tactile Switch', value: '6x6x5mm', package: 'Through-hole', quantity: 2, category: 'Input' });
      bom.push({ name: 'Pull-up Resistors', value: '10kΩ', package: '0402', quantity: 2, category: 'Passive' });
    }

    // Decoupling caps
    else if (nameLower.includes('decoupling')) {
      bom.push({ name: 'Decoupling Cap (100nF)', value: '100nF/16V', package: '0402 Ceramic', quantity: 4, category: 'Passive' });
      bom.push({ name: 'Bulk Cap (10µF)', value: '10µF/16V', package: '0805 Ceramic', quantity: 2, category: 'Passive' });
    }
  }

  return { bom };
}

/* ================================================================
   AGENT 4: PCB LAYOUT ENGINEER
   ================================================================ */
export async function agentPCBLayout(circuitDesign, componentSelection, requirements) {
  await delay(900);

  const totalComponents = componentSelection.bom.length;
  const hasPowerRegulators = componentSelection.bom.some(c => c.category === 'Power');
  const hasWireless = componentSelection.bom.some(c => c.category === 'Wireless');
  const hasHighCurrent = requirements.constraints.some(c => c.toLowerCase().includes('high current'));
  const hasMotors = componentSelection.bom.some(c => c.name.toLowerCase().includes('motor') || c.name.toLowerCase().includes('l298'));

  // Determine layer count
  let layers = '2-layer';
  if (totalComponents > 30 || hasWireless || requirements.protocols.some(p => p.includes('WiFi'))) {
    layers = '4-layer';
  }

  // Determine board size
  let boardSize = '80x60mm';
  if (totalComponents > 25) boardSize = '100x80mm';
  if (totalComponents < 10) boardSize = '50x40mm';

  const placement_rules = [
    `Board dimensions: ${boardSize} (${layers})`,
    'Place MCU at board center for optimal routing',
    'Group all decoupling capacitors within 3mm of their respective IC power pins',
    'Place power input connectors at board edge',
    hasPowerRegulators ? 'Isolate power regulation section from signal section' : '',
    hasWireless ? 'Keep antenna area clear of ground plane and components (λ/4 clearance)' : '',
    hasWireless ? 'Place RF module at board edge with antenna pointing outward' : '',
    hasMotors ? 'Separate motor driver section from sensitive analog/digital circuitry' : '',
    'Place programming/debug header at board edge for easy access',
    'Maintain minimum 3mm clearance from board edge for all components',
    'Align SMD components on a 0.5mm grid for manufacturing compatibility',
    'Place thermal pads for power components with adequate copper pour',
  ].filter(Boolean);

  const routing_rules = [
    'Minimum trace width: 0.25mm (10mil) for signal traces',
    hasHighCurrent || hasMotors ? 'Power traces: minimum 1.0mm (40mil) for high-current paths' : 'Power traces: minimum 0.5mm (20mil)',
    `Minimum clearance: 0.2mm (8mil) between traces`,
    layers === '4-layer' ? 'Layer stack: Signal - GND - Power - Signal' : 'Top: signal + components, Bottom: ground plane + routing',
    'Use 45° angles for trace routing, avoid 90° bends',
    'Via size: 0.3mm drill / 0.6mm pad for signal vias',
    hasPowerRegulators ? 'Use thermal vias (0.3mm, array of 4-6) under power components' : '',
    'Keep analog and digital signal traces separated',
    hasWireless ? '50Ω impedance-controlled traces for RF paths' : '',
    'Route I2C/SPI bus traces in parallel, matched length where possible',
    'Ground plane coverage: minimum 70% fill on bottom layer',
    'Add stitching vias every 10mm along ground plane boundaries',
  ].filter(Boolean);

  const notes = [
    `PCB fabrication: ${layers}, 1.6mm FR4, 1oz copper, HASL finish`,
    'Solder mask: both sides, green (standard)',
    'Silkscreen: white, top side with component designators',
    `Mounting: 4x M3 mounting holes at corners`,
    'Fiducial marks: 3x 1mm circles for SMD assembly alignment',
    'Board outline: rounded corners (1mm radius)',
    'DRC settings: Manufacturing class 6 (standard PCB house)',
    'Panelization: V-score or tab-routed, check with fabricator',
    'Assembly: Pick-and-place compatible, provide centroid file',
  ];

  return {
    layers,
    board_size: boardSize,
    placement_rules: placement_rules.join('\n'),
    routing_rules: routing_rules.join('\n'),
    notes: notes.join('\n')
  };
}

/* ================================================================
   AGENT 5: VERIFICATION ENGINEER
   ================================================================ */
export async function agentVerification(circuitDesign, componentSelection, pcbLayout, requirements) {
  await delay(700);

  const errors = [];
  const warnings = [];
  const suggestions = [];

  // Power integrity checks
  const hasRegulator = componentSelection.bom.some(b => 
    b.name.toLowerCase().includes('ams1117') || 
    b.name.toLowerCase().includes('lm2596') ||
    b.name.toLowerCase().includes('ldo') ||
    b.name.toLowerCase().includes('bq25570')
  );

  if (!hasRegulator) {
    errors.push('No voltage regulator found — MCU may not receive proper supply voltage');
  }

  const hasDecoupling = componentSelection.bom.some(b => b.name.toLowerCase().includes('decoupling'));
  if (!hasDecoupling) {
    errors.push('Missing decoupling capacitors — add 100nF caps near IC power pins');
  }

  // Check for pull-up resistors on I2C
  const hasI2C = circuitDesign.connections.some(c => c.description.toLowerCase().includes('i2c'));
  const hasPullups = componentSelection.bom.some(b => b.name.toLowerCase().includes('pull-up'));
  if (hasI2C && !hasPullups) {
    warnings.push('I2C bus detected but no pull-up resistors specified — add 4.7kΩ pull-ups on SDA/SCL');
  }

  // Check for ESD protection
  const hasUSB = componentSelection.bom.some(b => b.name.toLowerCase().includes('usb'));
  const hasESD = componentSelection.bom.some(b => b.name.toLowerCase().includes('esd'));
  if (hasUSB && !hasESD) {
    warnings.push('USB connector present without ESD protection — consider adding TVS diodes (e.g., USBLC6-2SC6)');
  }

  // Check motor driver protections
  const hasMotorDriver = componentSelection.bom.some(b => b.name.toLowerCase().includes('l298'));
  const hasFlybackDiode = componentSelection.bom.some(b => b.name.toLowerCase().includes('flyback'));
  if (hasMotorDriver && !hasFlybackDiode) {
    errors.push('Motor driver present without flyback diodes — inductive load may damage driver');
  }

  // Check wireless antenna clearance
  const hasWireless = componentSelection.bom.some(b => 
    b.name.toLowerCase().includes('esp32') || 
    b.name.toLowerCase().includes('rfm') ||
    b.name.toLowerCase().includes('lora')
  );
  if (hasWireless) {
    suggestions.push('Ensure antenna keep-out zone is maintained — no ground plane or traces under antenna');
    suggestions.push('For ESP32: maintain 15mm clearance around PCB antenna area');
  }

  // Power budget check
  const hasMotors = componentSelection.bom.some(b => b.name.toLowerCase().includes('motor') || b.name.toLowerCase().includes('servo'));
  const hasBatteryPower = requirements.power.toLowerCase().includes('battery') || requirements.power.toLowerCase().includes('lipo');
  if (hasMotors && hasBatteryPower) {
    warnings.push('Motors on battery power — verify battery discharge rate supports motor stall current');
  }

  // Check programming interface
  const hasProgrammingHeader = componentSelection.bom.some(b => b.name.toLowerCase().includes('programming') || b.name.toLowerCase().includes('header'));
  if (!hasProgrammingHeader) {
    warnings.push('No programming header found — MCU cannot be programmed on-board');
  }

  // Check reset circuit
  const hasResetCircuit = componentSelection.bom.some(b => b.name.toLowerCase().includes('reset'));
  if (!hasResetCircuit) {
    warnings.push('No reset circuit found — add reset button with RC debounce for reliable operation');
  }

  // Thermal checks
  if (hasMotorDriver) {
    suggestions.push('L298N generates significant heat — add heatsink and consider thermal via array');
  }

  const hasHighPowerReg = componentSelection.bom.some(b => b.name.toLowerCase().includes('lm2596'));
  if (hasHighPowerReg) {
    suggestions.push('Ensure adequate input/output capacitor ESR ratings for LM2596 stability');
  }

  // Signal integrity
  const hasHighSpeedSPI = circuitDesign.connections.some(c => c.description.toLowerCase().includes('spi'));
  if (hasHighSpeedSPI) {
    suggestions.push('SPI traces should be kept short (<50mm) and routed on same layer to minimize cross-talk');
  }

  // General suggestions
  suggestions.push('Add test points on critical power rails and signal nets for debugging');
  suggestions.push('Include power indicator LED with 1kΩ series resistor');
  suggestions.push('Consider adding bulk electrolytic capacitor (100µF) at board power input');

  const status = errors.length === 0 ? 'PASS' : 'FAIL';

  return {
    errors,
    warnings,
    suggestions,
    status
  };
}

/* ================================================================
   AGENT 6: OUTPUT GENERATOR
   ================================================================ */
export async function agentOutputGenerator(requirements, circuitDesign, componentSelection, pcbLayout, verification) {
  await delay(500);

  // Generate firmware hints
  const firmwareHints = [];
  const protocolsStr = requirements.protocols.join(' ').toLowerCase();
  
  const hasMCU = componentSelection.bom.find(b => b.category === 'MCU');
  const mcuName = hasMCU ? hasMCU.name : 'Unknown MCU';

  if (mcuName.includes('ESP32')) {
    firmwareHints.push('Framework: Arduino or ESP-IDF (recommended for production)');
    firmwareHints.push('WiFi: Use WiFiManager library for easy provisioning');
    firmwareHints.push('OTA: Enable ArduinoOTA for wireless firmware updates');
    if (protocolsStr.includes('mqtt')) {
      firmwareHints.push('MQTT: Use PubSubClient or AsyncMqttClient library');
    }
    if (protocolsStr.includes('ble')) {
      firmwareHints.push('BLE: Use NimBLE-Arduino for lower memory footprint');
    }
  } else if (mcuName.includes('STM32')) {
    firmwareHints.push('Framework: STM32CubeIDE with HAL libraries');
    firmwareHints.push('Use STM32CubeMX for peripheral configuration');
    firmwareHints.push('Enable DMA for high-throughput data transfers');
  } else if (mcuName.includes('ATmega')) {
    firmwareHints.push('Framework: Arduino IDE or PlatformIO');
    firmwareHints.push('Optimize Flash usage — ATmega328P has only 32KB');
    firmwareHints.push('Use PROGMEM for constant data storage');
  }

  // Sensor-specific firmware hints
  const hasTempSensor = componentSelection.bom.some(b => b.name.includes('SHT31'));
  if (hasTempSensor) {
    firmwareHints.push('SHT31: Use Adafruit_SHT31 library, sample every 2s minimum');
  }
  const hasIMU = componentSelection.bom.some(b => b.name.includes('MPU-6050'));
  if (hasIMU) {
    firmwareHints.push('MPU-6050: Use I2Cdev + MPU6050 library with DMP for processed orientation data');
  }
  const hasGPS = componentSelection.bom.some(b => b.name.includes('NEO-6M'));
  if (hasGPS) {
    firmwareHints.push('GPS: Use TinyGPSPlus library for NMEA parsing at 9600 baud');
  }
  const hasOLED = componentSelection.bom.some(b => b.name.includes('SSD1306'));
  if (hasOLED) {
    firmwareHints.push('OLED: Use Adafruit_SSD1306 or U8g2 library for display rendering');
  }

  // Simulation suggestions
  const simulationSuggestions = [
    'Power supply: Simulate voltage regulation circuit in LTspice/TINA-TI',
    'Verify regulator stability with load transient simulation',
    'Digital: Simulate MCU firmware in Wokwi.com or Proteus',
    'PCB: Run DRC in KiCad before fabrication',
    'Signal integrity: Check high-speed traces with impedance calculator',
    'Thermal: Estimate power dissipation for critical components',
  ];

  // Circuit summary
  const summary = {
    project_name: `Edesign: ${requirements.purpose}`,
    mcu: mcuName,
    total_components: componentSelection.bom.length,
    total_unique_components: new Set(componentSelection.bom.map(b => b.name)).size,
    power_supply: requirements.power,
    communication: requirements.protocols.join(', '),
    pcb_layers: pcbLayout.layers,
    pcb_size: pcbLayout.board_size,
    verification_status: verification.status,
    error_count: verification.errors.length,
    warning_count: verification.warnings.length,
  };

  return {
    summary,
    firmwareHints,
    simulationSuggestions,
    designNotes: circuitDesign.design_notes,
  };
}

/* ================================================================
   AGENT 7: FIRMWARE ENGINEER (ARDUINO / ESP32)
   ================================================================
   Generates real, compilable Arduino firmware code based on:
   - Selected MCU from BOM
   - Connected components and sensors
   - Communication protocols
   ================================================================ */
export async function agentFirmwareEngineer(requirements, circuitDesign, componentSelection) {
  await delay(1000);

  const bom = componentSelection.bom;
  const connections = circuitDesign.connections;
  const protocols = requirements.protocols.join(' ').toLowerCase();

  // Identify MCU
  const mcuPart = bom.find(b => b.category === 'MCU');
  const mcuName = mcuPart ? mcuPart.name : 'Unknown';
  const isESP32 = mcuName.includes('ESP32');
  const isSTM32 = mcuName.includes('STM32');
  const isATmega = mcuName.includes('ATmega');

  // Identify connected components
  const hasSHT31 = bom.some(b => b.name.includes('SHT31'));
  const hasBMP280 = bom.some(b => b.name.includes('BMP280'));
  const hasBH1750 = bom.some(b => b.name.includes('BH1750'));
  const hasMPU6050 = bom.some(b => b.name.includes('MPU-6050'));
  const hasOLED = bom.some(b => b.name.includes('SSD1306'));
  const hasLCD = bom.some(b => b.name.includes('HD44780'));
  const hasGPS = bom.some(b => b.name.includes('NEO-6M'));
  const hasMotorDriver = bom.some(b => b.name.includes('L298N'));
  const hasRelay = bom.some(b => b.name.includes('SRD-05VDC') || b.name.includes('Relay'));
  const hasBuzzer = bom.some(b => b.name.includes('Buzzer'));
  const hasLED = bom.some(b => b.name.includes('LED (Green)') || b.name.includes('LED (Red)'));
  const hasRGB = bom.some(b => b.name.includes('WS2812'));
  const hasLoRa = bom.some(b => b.name.includes('RFM95'));
  const hasPIR = bom.some(b => b.name.includes('HC-SR501'));
  const hasUltrasonic = bom.some(b => b.name.includes('HC-SR04'));
  const hasGasSensor = bom.some(b => b.name.includes('MQ-2'));
  const hasSoilSensor = bom.some(b => b.name.includes('Soil'));
  const hasCurrentSensor = bom.some(b => b.name.includes('ACS712'));
  const hasRFID = bom.some(b => b.name.includes('MFRC522'));
  const hasButtons = bom.some(b => b.name.includes('Tactile Switch') && !b.name.includes('Reset'));
  const hasMQTT = protocols.includes('mqtt');
  const hasWiFi = protocols.includes('wifi') || isESP32;

  // --- Build code sections ---
  const lines = [];

  // ===== HEADER =====
  lines.push(`/*`);
  lines.push(` * ============================================================`);
  lines.push(` *  Edesign.ai — Auto-Generated Firmware`);
  lines.push(` *  Project : ${requirements.purpose}`);
  lines.push(` *  MCU     : ${mcuName}`);
  lines.push(` *  Generated: ${new Date().toISOString().split('T')[0]}`);
  lines.push(` * ============================================================`);
  lines.push(` */`);
  lines.push(``);

  // ===== LIBRARY IMPORTS =====
  lines.push(`// ── Library Imports ──────────────────────────────────────────`);
  if (isESP32) {
    if (hasWiFi) lines.push(`#include <WiFi.h>`);
    if (hasMQTT) lines.push(`#include <PubSubClient.h>`);
  }
  if (hasSHT31 || hasBMP280 || hasBH1750 || hasMPU6050 || hasOLED) {
    lines.push(`#include <Wire.h>`);
  }
  if (hasSHT31) lines.push(`#include <Adafruit_SHT31.h>`);
  if (hasBMP280) lines.push(`#include <Adafruit_BMP280.h>`);
  if (hasBH1750) lines.push(`#include <BH1750.h>`);
  if (hasMPU6050) {
    lines.push(`#include <Adafruit_MPU6050.h>`);
    lines.push(`#include <Adafruit_Sensor.h>`);
  }
  if (hasOLED) {
    lines.push(`#include <Adafruit_GFX.h>`);
    lines.push(`#include <Adafruit_SSD1306.h>`);
  }
  if (hasLCD) {
    lines.push(`#include <LiquidCrystal_I2C.h>`);
  }
  if (hasGPS) lines.push(`#include <TinyGPSPlus.h>`);
  if (hasLoRa) lines.push(`#include <LoRa.h>`);
  if (hasRGB) lines.push(`#include <Adafruit_NeoPixel.h>`);
  if (hasRFID) {
    lines.push(`#include <SPI.h>`);
    lines.push(`#include <MFRC522.h>`);
  }
  lines.push(``);

  // ===== PIN DEFINITIONS =====
  lines.push(`// ── Pin Definitions ──────────────────────────────────────────`);
  if (isESP32) {
    lines.push(`#define SDA_PIN      21   // I2C Data`);
    lines.push(`#define SCL_PIN      22   // I2C Clock`);
    if (hasLED) {
      lines.push(`#define LED_GREEN    2    // Status LED (green)`);
      lines.push(`#define LED_RED      4    // Status LED (red)`);
    }
    if (hasBuzzer) lines.push(`#define BUZZER_PIN   15   // Piezo buzzer`);
    if (hasMotorDriver) {
      lines.push(`#define MOTOR_ENA    25   // Motor A enable (PWM)`);
      lines.push(`#define MOTOR_IN1    26   // Motor A direction 1`);
      lines.push(`#define MOTOR_IN2    27   // Motor A direction 2`);
      lines.push(`#define MOTOR_ENB    14   // Motor B enable (PWM)`);
      lines.push(`#define MOTOR_IN3    12   // Motor B direction 1`);
      lines.push(`#define MOTOR_IN4    13   // Motor B direction 2`);
    }
    if (hasRelay) lines.push(`#define RELAY_PIN    16   // Relay control`);
    if (hasPIR) lines.push(`#define PIR_PIN      34   // PIR motion (input only)`);
    if (hasUltrasonic) {
      lines.push(`#define TRIG_PIN     5    // Ultrasonic trigger`);
      lines.push(`#define ECHO_PIN     18   // Ultrasonic echo`);
    }
    if (hasGasSensor) lines.push(`#define GAS_PIN      36   // MQ-2 analog (input only)`);
    if (hasSoilSensor) lines.push(`#define SOIL_PIN     39   // Soil moisture (input only)`);
    if (hasCurrentSensor) lines.push(`#define CURRENT_PIN  35   // ACS712 analog (input only)`);
    if (hasGPS) {
      lines.push(`#define GPS_RX       16   // GPS module RX`);
      lines.push(`#define GPS_TX       17   // GPS module TX`);
    }
    if (hasRGB) lines.push(`#define NEOPIXEL_PIN 23   // WS2812B data`);
    if (hasButtons) {
      lines.push(`#define BTN1_PIN     32   // Button 1`);
      lines.push(`#define BTN2_PIN     33   // Button 2`);
    }
    if (hasRFID) {
      lines.push(`#define RFID_SS      5    // RFID SDA/CS`);
      lines.push(`#define RFID_RST     0    // RFID Reset`);
    }
    if (hasLoRa) {
      lines.push(`#define LORA_SS      18   // LoRa chip select`);
      lines.push(`#define LORA_RST     14   // LoRa reset`);
      lines.push(`#define LORA_DIO0    26   // LoRa interrupt`);
    }
  } else if (isATmega) {
    lines.push(`// ATmega328P — Arduino Uno pin mapping`);
    lines.push(`#define SDA_PIN      A4   // I2C Data`);
    lines.push(`#define SCL_PIN      A5   // I2C Clock`);
    if (hasLED) {
      lines.push(`#define LED_GREEN    3    // Status LED`);
      lines.push(`#define LED_RED      4    // Error LED`);
    }
    if (hasBuzzer) lines.push(`#define BUZZER_PIN   9    // Buzzer (PWM)`);
    if (hasRelay) lines.push(`#define RELAY_PIN    7    // Relay`);
    if (hasButtons) {
      lines.push(`#define BTN1_PIN     2    // Button 1 (INT0)`);
      lines.push(`#define BTN2_PIN     5    // Button 2`);
    }
    if (hasPIR) lines.push(`#define PIR_PIN      2    // PIR motion`);
    if (hasGasSensor) lines.push(`#define GAS_PIN      A0   // MQ-2 analog`);
    if (hasSoilSensor) lines.push(`#define SOIL_PIN     A1   // Soil moisture`);
    if (hasUltrasonic) {
      lines.push(`#define TRIG_PIN     6    // Ultrasonic trigger`);
      lines.push(`#define ECHO_PIN     7    // Ultrasonic echo`);
    }
    if (hasRGB) lines.push(`#define NEOPIXEL_PIN 8    // WS2812B data`);
  } else {
    lines.push(`// Generic ARM pin mapping — adjust for your board`);
    lines.push(`#define SDA_PIN      PB7`);
    lines.push(`#define SCL_PIN      PB6`);
    if (hasLED) {
      lines.push(`#define LED_GREEN    PA5`);
      lines.push(`#define LED_RED      PA6`);
    }
  }
  lines.push(``);

  // ===== CONSTANTS =====
  lines.push(`// ── Constants ───────────────────────────────────────────────`);
  lines.push(`#define SERIAL_BAUD  115200`);
  lines.push(`#define READ_INTERVAL 2000  // Sensor read interval (ms)`);
  if (hasOLED) {
    lines.push(`#define SCREEN_W     128`);
    lines.push(`#define SCREEN_H     64`);
    lines.push(`#define OLED_ADDR    0x3C`);
  }
  if (hasRGB) lines.push(`#define NUM_PIXELS   8     // Number of NeoPixels`);
  lines.push(``);

  // ===== WIFI / MQTT CONFIG =====
  if (isESP32 && hasWiFi) {
    lines.push(`// ── WiFi Configuration ──────────────────────────────────────`);
    lines.push(`const char* WIFI_SSID     = "YOUR_WIFI_SSID";`);
    lines.push(`const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";`);
    if (hasMQTT) {
      lines.push(``);
      lines.push(`// ── MQTT Configuration ──────────────────────────────────────`);
      lines.push(`const char* MQTT_SERVER   = "broker.hivemq.com";`);
      lines.push(`const int   MQTT_PORT     = 1883;`);
      lines.push(`const char* MQTT_CLIENT   = "edesign_device_01";`);
      lines.push(`const char* MQTT_TOPIC    = "edesign/sensors";`);
    }
    lines.push(``);
  }

  // ===== OBJECT INSTANCES =====
  lines.push(`// ── Sensor & Module Objects ──────────────────────────────────`);
  if (hasSHT31) lines.push(`Adafruit_SHT31 sht31 = Adafruit_SHT31();`);
  if (hasBMP280) lines.push(`Adafruit_BMP280 bmp;`);
  if (hasBH1750) lines.push(`BH1750 lightMeter;`);
  if (hasMPU6050) lines.push(`Adafruit_MPU6050 mpu;`);
  if (hasOLED) lines.push(`Adafruit_SSD1306 display(SCREEN_W, SCREEN_H, &Wire, -1);`);
  if (hasLCD) lines.push(`LiquidCrystal_I2C lcd(0x27, 16, 2);`);
  if (hasGPS) {
    lines.push(`TinyGPSPlus gps;`);
    if (isESP32) lines.push(`HardwareSerial gpsSerial(1);`);
  }
  if (hasRGB) lines.push(`Adafruit_NeoPixel strip(NUM_PIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);`);
  if (hasRFID) lines.push(`MFRC522 rfid(RFID_SS, RFID_RST);`);
  if (isESP32 && hasWiFi) {
    lines.push(`WiFiClient espClient;`);
    if (hasMQTT) lines.push(`PubSubClient mqtt(espClient);`);
  }
  lines.push(``);
  lines.push(`// ── Global Variables ────────────────────────────────────────`);
  lines.push(`unsigned long lastReadTime = 0;`);
  if (hasSHT31) {
    lines.push(`float temperature = 0.0;`);
    lines.push(`float humidity    = 0.0;`);
  }
  if (hasBMP280) {
    lines.push(`float pressure    = 0.0;`);
    lines.push(`float altitude    = 0.0;`);
  }
  if (hasBH1750) lines.push(`float lux         = 0.0;`);
  if (hasUltrasonic) lines.push(`float distanceCm  = 0.0;`);
  if (hasGasSensor) lines.push(`int   gasValue    = 0;`);
  if (hasSoilSensor) lines.push(`int   soilValue   = 0;`);
  if (hasCurrentSensor) lines.push(`float currentAmps = 0.0;`);
  lines.push(``);

  // ===== SETUP =====
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(`//  SETUP`);
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(`void setup() {`);
  lines.push(`  Serial.begin(SERIAL_BAUD);`);
  lines.push(`  delay(100);`);
  lines.push(`  Serial.println("──────────────────────────────────");`);
  lines.push(`  Serial.println(" Edesign.ai Firmware Starting...");`);
  lines.push(`  Serial.println("──────────────────────────────────");`);
  lines.push(``);

  // Pin modes
  if (hasLED) {
    lines.push(`  // LED pins`);
    lines.push(`  pinMode(LED_GREEN, OUTPUT);`);
    lines.push(`  pinMode(LED_RED, OUTPUT);`);
    lines.push(`  digitalWrite(LED_GREEN, LOW);`);
    lines.push(`  digitalWrite(LED_RED, LOW);`);
  }
  if (hasBuzzer) {
    lines.push(`  pinMode(BUZZER_PIN, OUTPUT);`);
    lines.push(`  digitalWrite(BUZZER_PIN, LOW);`);
  }
  if (hasRelay) {
    lines.push(`  pinMode(RELAY_PIN, OUTPUT);`);
    lines.push(`  digitalWrite(RELAY_PIN, LOW);`);
  }
  if (hasPIR) lines.push(`  pinMode(PIR_PIN, INPUT);`);
  if (hasUltrasonic) {
    lines.push(`  pinMode(TRIG_PIN, OUTPUT);`);
    lines.push(`  pinMode(ECHO_PIN, INPUT);`);
  }
  if (hasMotorDriver) {
    lines.push(`  pinMode(MOTOR_ENA, OUTPUT);`);
    lines.push(`  pinMode(MOTOR_IN1, OUTPUT);`);
    lines.push(`  pinMode(MOTOR_IN2, OUTPUT);`);
    lines.push(`  pinMode(MOTOR_ENB, OUTPUT);`);
    lines.push(`  pinMode(MOTOR_IN3, OUTPUT);`);
    lines.push(`  pinMode(MOTOR_IN4, OUTPUT);`);
  }
  if (hasButtons) {
    lines.push(`  pinMode(BTN1_PIN, INPUT_PULLUP);`);
    lines.push(`  pinMode(BTN2_PIN, INPUT_PULLUP);`);
  }
  lines.push(``);

  // I2C init
  if (hasSHT31 || hasBMP280 || hasBH1750 || hasMPU6050 || hasOLED || hasLCD) {
    lines.push(`  // Initialize I2C bus`);
    if (isESP32) {
      lines.push(`  Wire.begin(SDA_PIN, SCL_PIN);`);
    } else {
      lines.push(`  Wire.begin();`);
    }
    lines.push(``);
  }

  // Sensor init
  if (hasSHT31) {
    lines.push(`  // SHT31 Temperature & Humidity sensor`);
    lines.push(`  if (!sht31.begin(0x44)) {`);
    lines.push(`    Serial.println("[ERROR] SHT31 not found!");`);
    if (hasLED) lines.push(`    digitalWrite(LED_RED, HIGH);`);
    lines.push(`  } else {`);
    lines.push(`    Serial.println("[OK] SHT31 initialized");`);
    lines.push(`  }`);
    lines.push(``);
  }
  if (hasBMP280) {
    lines.push(`  // BMP280 Pressure sensor`);
    lines.push(`  if (!bmp.begin(0x76)) {`);
    lines.push(`    Serial.println("[ERROR] BMP280 not found!");`);
    lines.push(`  } else {`);
    lines.push(`    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,`);
    lines.push(`                    Adafruit_BMP280::SAMPLING_X2,`);
    lines.push(`                    Adafruit_BMP280::SAMPLING_X16,`);
    lines.push(`                    Adafruit_BMP280::FILTER_X16,`);
    lines.push(`                    Adafruit_BMP280::STANDBY_MS_500);`);
    lines.push(`    Serial.println("[OK] BMP280 initialized");`);
    lines.push(`  }`);
    lines.push(``);
  }
  if (hasBH1750) {
    lines.push(`  // BH1750 Light sensor`);
    lines.push(`  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE)) {`);
    lines.push(`    Serial.println("[OK] BH1750 initialized");`);
    lines.push(`  }`);
    lines.push(``);
  }
  if (hasMPU6050) {
    lines.push(`  // MPU-6050 IMU`);
    lines.push(`  if (!mpu.begin()) {`);
    lines.push(`    Serial.println("[ERROR] MPU-6050 not found!");`);
    lines.push(`  } else {`);
    lines.push(`    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);`);
    lines.push(`    mpu.setGyroRange(MPU6050_RANGE_500_DEG);`);
    lines.push(`    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);`);
    lines.push(`    Serial.println("[OK] MPU-6050 initialized");`);
    lines.push(`  }`);
    lines.push(``);
  }

  // Display init
  if (hasOLED) {
    lines.push(`  // SSD1306 OLED Display`);
    lines.push(`  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR)) {`);
    lines.push(`    Serial.println("[ERROR] OLED not found!");`);
    lines.push(`  } else {`);
    lines.push(`    display.clearDisplay();`);
    lines.push(`    display.setTextSize(1);`);
    lines.push(`    display.setTextColor(SSD1306_WHITE);`);
    lines.push(`    display.setCursor(0, 0);`);
    lines.push(`    display.println("Edesign.ai");`);
    lines.push(`    display.println("Starting...");`);
    lines.push(`    display.display();`);
    lines.push(`    Serial.println("[OK] OLED initialized");`);
    lines.push(`  }`);
    lines.push(``);
  }
  if (hasLCD) {
    lines.push(`  // LCD Display`);
    lines.push(`  lcd.init();`);
    lines.push(`  lcd.backlight();`);
    lines.push(`  lcd.setCursor(0, 0);`);
    lines.push(`  lcd.print("Edesign.ai");`);
    lines.push(`  lcd.setCursor(0, 1);`);
    lines.push(`  lcd.print("Starting...");`);
    lines.push(`  Serial.println("[OK] LCD initialized");`);
    lines.push(``);
  }

  // GPS init
  if (hasGPS && isESP32) {
    lines.push(`  // GPS Module (UART)`);
    lines.push(`  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);`);
    lines.push(`  Serial.println("[OK] GPS UART initialized");`);
    lines.push(``);
  }

  // NeoPixel init
  if (hasRGB) {
    lines.push(`  // NeoPixel RGB strip`);
    lines.push(`  strip.begin();`);
    lines.push(`  strip.setBrightness(50);`);
    lines.push(`  strip.show();`);
    lines.push(`  Serial.println("[OK] NeoPixel initialized");`);
    lines.push(``);
  }

  // RFID init
  if (hasRFID) {
    lines.push(`  // RFID Reader`);
    lines.push(`  SPI.begin();`);
    lines.push(`  rfid.PCD_Init();`);
    lines.push(`  Serial.println("[OK] RFID reader initialized");`);
    lines.push(``);
  }

  // LoRa init
  if (hasLoRa) {
    lines.push(`  // LoRa Transceiver`);
    lines.push(`  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);`);
    lines.push(`  if (!LoRa.begin(915E6)) {  // 915 MHz — change for your region`);
    lines.push(`    Serial.println("[ERROR] LoRa init failed!");`);
    lines.push(`  } else {`);
    lines.push(`    Serial.println("[OK] LoRa initialized at 915 MHz");`);
    lines.push(`  }`);
    lines.push(``);
  }

  // WiFi init
  if (isESP32 && hasWiFi) {
    lines.push(`  // WiFi Connection`);
    lines.push(`  connectWiFi();`);
    if (hasMQTT) {
      lines.push(`  mqtt.setServer(MQTT_SERVER, MQTT_PORT);`);
    }
    lines.push(``);
  }

  if (hasLED) lines.push(`  digitalWrite(LED_GREEN, HIGH);  // Ready indicator`);
  lines.push(`  Serial.println("──────────────────────────────────");`);
  lines.push(`  Serial.println(" All systems ready!");`);
  lines.push(`  Serial.println("──────────────────────────────────");`);
  lines.push(`}`);
  lines.push(``);

  // ===== LOOP =====
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(`//  MAIN LOOP`);
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(`void loop() {`);
  lines.push(`  unsigned long now = millis();`);
  lines.push(``);

  // MQTT keep alive
  if (isESP32 && hasMQTT) {
    lines.push(`  // Maintain MQTT connection`);
    lines.push(`  if (!mqtt.connected()) reconnectMQTT();`);
    lines.push(`  mqtt.loop();`);
    lines.push(``);
  }

  // GPS parse
  if (hasGPS && isESP32) {
    lines.push(`  // Feed GPS parser`);
    lines.push(`  while (gpsSerial.available() > 0) {`);
    lines.push(`    gps.encode(gpsSerial.read());`);
    lines.push(`  }`);
    lines.push(``);
  }

  // PIR immediate check
  if (hasPIR) {
    lines.push(`  // Check PIR motion sensor`);
    lines.push(`  if (digitalRead(PIR_PIN) == HIGH) {`);
    lines.push(`    Serial.println("[ALERT] Motion detected!");`);
    if (hasBuzzer) lines.push(`    tone(BUZZER_PIN, 1000, 200);`);
    if (hasLED) lines.push(`    digitalWrite(LED_RED, HIGH);`);
    if (hasRelay) lines.push(`    digitalWrite(RELAY_PIN, HIGH);`);
    lines.push(`  } else {`);
    if (hasLED) lines.push(`    digitalWrite(LED_RED, LOW);`);
    if (hasRelay) lines.push(`    // digitalWrite(RELAY_PIN, LOW);  // Uncomment to auto-off`);
    lines.push(`  }`);
    lines.push(``);
  }

  // Button check
  if (hasButtons) {
    lines.push(`  // Check button presses`);
    lines.push(`  if (digitalRead(BTN1_PIN) == LOW) {`);
    lines.push(`    Serial.println("Button 1 pressed");`);
    if (hasRelay) lines.push(`    digitalWrite(RELAY_PIN, !digitalRead(RELAY_PIN)); // Toggle`);
    lines.push(`    delay(300);  // Simple debounce`);
    lines.push(`  }`);
    lines.push(``);
  }

  // RFID check
  if (hasRFID) {
    lines.push(`  // Check for RFID card`);
    lines.push(`  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {`);
    lines.push(`    Serial.print("RFID UID: ");`);
    lines.push(`    for (byte i = 0; i < rfid.uid.size; i++) {`);
    lines.push(`      Serial.print(rfid.uid.uidByte[i] < 0x10 ? "0" : "");`);
    lines.push(`      Serial.print(rfid.uid.uidByte[i], HEX);`);
    lines.push(`    }`);
    lines.push(`    Serial.println();`);
    lines.push(`    rfid.PICC_HaltA();`);
    lines.push(`  }`);
    lines.push(``);
  }

  // Timed sensor reads
  lines.push(`  // ── Periodic sensor readings ──`);
  lines.push(`  if (now - lastReadTime >= READ_INTERVAL) {`);
  lines.push(`    lastReadTime = now;`);
  lines.push(``);

  if (hasSHT31) {
    lines.push(`    // Read SHT31`);
    lines.push(`    temperature = sht31.readTemperature();`);
    lines.push(`    humidity    = sht31.readHumidity();`);
    lines.push(`    if (!isnan(temperature)) {`);
    lines.push(`      Serial.printf("Temp: %.1f°C  Humidity: %.1f%%\\n", temperature, humidity);`);
    lines.push(`    }`);
    lines.push(``);
  }
  if (hasBMP280) {
    lines.push(`    // Read BMP280`);
    lines.push(`    pressure = bmp.readPressure() / 100.0F;  // hPa`);
    lines.push(`    altitude = bmp.readAltitude(1013.25);     // sea-level ref`);
    lines.push(`    Serial.printf("Pressure: %.1f hPa  Alt: %.1f m\\n", pressure, altitude);`);
    lines.push(``);
  }
  if (hasBH1750) {
    lines.push(`    // Read BH1750`);
    lines.push(`    lux = lightMeter.readLightLevel();`);
    lines.push(`    Serial.printf("Light: %.1f lux\\n", lux);`);
    lines.push(``);
  }
  if (hasMPU6050) {
    lines.push(`    // Read MPU-6050`);
    lines.push(`    sensors_event_t a, g, temp;`);
    lines.push(`    mpu.getEvent(&a, &g, &temp);`);
    lines.push(`    Serial.printf("Accel X:%.2f Y:%.2f Z:%.2f\\n", a.acceleration.x, a.acceleration.y, a.acceleration.z);`);
    lines.push(``);
  }
  if (hasUltrasonic) {
    lines.push(`    // Read HC-SR04 ultrasonic`);
    lines.push(`    distanceCm = readUltrasonic();`);
    lines.push(`    Serial.printf("Distance: %.1f cm\\n", distanceCm);`);
    lines.push(``);
  }
  if (hasGasSensor) {
    lines.push(`    // Read MQ-2 gas sensor`);
    lines.push(`    gasValue = analogRead(GAS_PIN);`);
    lines.push(`    Serial.printf("Gas level: %d\\n", gasValue);`);
    lines.push(`    if (gasValue > 400) {`);
    lines.push(`      Serial.println("[WARNING] High gas level!");`);
    if (hasBuzzer) lines.push(`      tone(BUZZER_PIN, 2000, 500);`);
    lines.push(`    }`);
    lines.push(``);
  }
  if (hasSoilSensor) {
    lines.push(`    // Read soil moisture`);
    lines.push(`    soilValue = analogRead(SOIL_PIN);`);
    lines.push(`    int soilPercent = map(soilValue, 4095, 1500, 0, 100);`);
    lines.push(`    soilPercent = constrain(soilPercent, 0, 100);`);
    lines.push(`    Serial.printf("Soil moisture: %d%%\\n", soilPercent);`);
    lines.push(``);
  }
  if (hasCurrentSensor) {
    lines.push(`    // Read ACS712 current sensor`);
    lines.push(`    int rawADC = analogRead(CURRENT_PIN);`);
    lines.push(`    float voltage = (rawADC / 4095.0) * 3.3;`);
    lines.push(`    currentAmps = (voltage - 1.65) / 0.100;  // 100mV/A sensitivity`);
    lines.push(`    Serial.printf("Current: %.2f A\\n", currentAmps);`);
    lines.push(``);
  }
  if (hasGPS) {
    lines.push(`    // Print GPS data`);
    lines.push(`    if (gps.location.isValid()) {`);
    lines.push(`      Serial.printf("GPS: %.6f, %.6f\\n", gps.location.lat(), gps.location.lng());`);
    lines.push(`    }`);
    lines.push(``);
  }

  // Update display
  if (hasOLED) {
    lines.push(`    // Update OLED display`);
    lines.push(`    display.clearDisplay();`);
    lines.push(`    display.setCursor(0, 0);`);
    lines.push(`    display.setTextSize(1);`);
    if (hasSHT31) {
      lines.push(`    display.printf("Temp: %.1f C\\n", temperature);`);
      lines.push(`    display.printf("Humi: %.1f %%\\n", humidity);`);
    }
    if (hasBMP280) {
      lines.push(`    display.printf("Pres: %.0f hPa\\n", pressure);`);
    }
    if (hasBH1750) lines.push(`    display.printf("Lux: %.0f\\n", lux);`);
    if (hasUltrasonic) lines.push(`    display.printf("Dist: %.1f cm\\n", distanceCm);`);
    if (hasGasSensor) lines.push(`    display.printf("Gas: %d\\n", gasValue);`);
    if (hasSoilSensor) lines.push(`    display.printf("Soil: %d\\n", soilValue);`);
    lines.push(`    display.display();`);
    lines.push(``);
  }
  if (hasLCD) {
    lines.push(`    // Update LCD`);
    lines.push(`    lcd.clear();`);
    if (hasSHT31) {
      lines.push(`    lcd.setCursor(0, 0);`);
      lines.push(`    lcd.printf("T:%.1fC H:%.0f%%", temperature, humidity);`);
    }
    if (hasBMP280) {
      lines.push(`    lcd.setCursor(0, 1);`);
      lines.push(`    lcd.printf("P:%.0fhPa", pressure);`);
    }
    lines.push(``);
  }

  // Send data via MQTT
  if (isESP32 && hasMQTT) {
    lines.push(`    // Publish data via MQTT`);
    lines.push(`    if (mqtt.connected()) {`);
    lines.push(`      char payload[256];`);
    let jsonParts = [];
    if (hasSHT31) jsonParts.push('"temp":%.1f,"humidity":%.1f');
    if (hasBMP280) jsonParts.push('"pressure":%.1f');
    if (hasBH1750) jsonParts.push('"lux":%.1f');
    if (hasUltrasonic) jsonParts.push('"distance":%.1f');
    if (hasGasSensor) jsonParts.push('"gas":%d');
    if (hasSoilSensor) jsonParts.push('"soil":%d');
    if (jsonParts.length === 0) jsonParts.push('"status":"ok"');
    const jsonFormat = `{${jsonParts.join(',')}}`;
    let sprintfArgs = [];
    if (hasSHT31) sprintfArgs.push('temperature', 'humidity');
    if (hasBMP280) sprintfArgs.push('pressure');
    if (hasBH1750) sprintfArgs.push('lux');
    if (hasUltrasonic) sprintfArgs.push('distanceCm');
    if (hasGasSensor) sprintfArgs.push('gasValue');
    if (hasSoilSensor) sprintfArgs.push('soilValue');
    if (sprintfArgs.length > 0) {
      lines.push(`      snprintf(payload, sizeof(payload),`);
      lines.push(`        "${jsonFormat}",`);
      lines.push(`        ${sprintfArgs.join(', ')});`);
    } else {
      lines.push(`      snprintf(payload, sizeof(payload), "${jsonFormat}");`);
    }
    lines.push(`      mqtt.publish(MQTT_TOPIC, payload);`);
    lines.push(`      Serial.println("[MQTT] Data published");`);
    lines.push(`    }`);
    lines.push(``);
  }

  // Send data via LoRa
  if (hasLoRa) {
    lines.push(`    // Send data via LoRa`);
    lines.push(`    LoRa.beginPacket();`);
    if (hasSHT31) {
      lines.push(`    LoRa.printf("T:%.1f,H:%.1f", temperature, humidity);`);
    } else {
      lines.push(`    LoRa.print("heartbeat");`);
    }
    lines.push(`    LoRa.endPacket();`);
    lines.push(`    Serial.println("[LoRa] Packet sent");`);
    lines.push(``);
  }

  // Blink status LED
  if (hasLED) {
    lines.push(`    // Blink status LED`);
    lines.push(`    digitalWrite(LED_GREEN, !digitalRead(LED_GREEN));`);
  }

  lines.push(`  }  // end timed block`);
  lines.push(`}`);
  lines.push(``);

  // ===== HELPER FUNCTIONS =====
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(`//  HELPER FUNCTIONS`);
  lines.push(`// ════════════════════════════════════════════════════════════`);
  lines.push(``);

  if (isESP32 && hasWiFi) {
    lines.push(`void connectWiFi() {`);
    lines.push(`  Serial.printf("Connecting to %s ", WIFI_SSID);`);
    lines.push(`  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);`);
    lines.push(`  int attempts = 0;`);
    lines.push(`  while (WiFi.status() != WL_CONNECTED && attempts < 20) {`);
    lines.push(`    delay(500);`);
    lines.push(`    Serial.print(".");`);
    lines.push(`    attempts++;`);
    lines.push(`  }`);
    lines.push(`  if (WiFi.status() == WL_CONNECTED) {`);
    lines.push(`    Serial.printf("\\n[OK] WiFi connected — IP: %s\\n", WiFi.localIP().toString().c_str());`);
    lines.push(`  } else {`);
    lines.push(`    Serial.println("\\n[ERROR] WiFi connection failed!");`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
  }

  if (isESP32 && hasMQTT) {
    lines.push(`void reconnectMQTT() {`);
    lines.push(`  while (!mqtt.connected()) {`);
    lines.push(`    Serial.print("Connecting to MQTT...");`);
    lines.push(`    if (mqtt.connect(MQTT_CLIENT)) {`);
    lines.push(`      Serial.println(" connected!");`);
    lines.push(`    } else {`);
    lines.push(`      Serial.printf(" failed (rc=%d), retrying in 5s\\n", mqtt.state());`);
    lines.push(`      delay(5000);`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
  }

  if (hasUltrasonic) {
    lines.push(`float readUltrasonic() {`);
    lines.push(`  digitalWrite(TRIG_PIN, LOW);`);
    lines.push(`  delayMicroseconds(2);`);
    lines.push(`  digitalWrite(TRIG_PIN, HIGH);`);
    lines.push(`  delayMicroseconds(10);`);
    lines.push(`  digitalWrite(TRIG_PIN, LOW);`);
    lines.push(`  long duration = pulseIn(ECHO_PIN, HIGH, 30000);`);
    lines.push(`  return duration * 0.034 / 2.0;`);
    lines.push(`}`);
    lines.push(``);
  }

  if (hasMotorDriver) {
    lines.push(`void motorA(int speed, bool forward) {`);
    lines.push(`  // speed: 0-255, forward: rotation direction`);
    lines.push(`  digitalWrite(MOTOR_IN1, forward ? HIGH : LOW);`);
    lines.push(`  digitalWrite(MOTOR_IN2, forward ? LOW : HIGH);`);
    lines.push(`  analogWrite(MOTOR_ENA, speed);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`void motorB(int speed, bool forward) {`);
    lines.push(`  digitalWrite(MOTOR_IN3, forward ? HIGH : LOW);`);
    lines.push(`  digitalWrite(MOTOR_IN4, forward ? LOW : HIGH);`);
    lines.push(`  analogWrite(MOTOR_ENB, speed);`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`void motorsStop() {`);
    lines.push(`  analogWrite(MOTOR_ENA, 0);`);
    lines.push(`  analogWrite(MOTOR_ENB, 0);`);
    lines.push(`}`);
    lines.push(``);
  }

  // Final comment block
  lines.push(`/*`);
  lines.push(` * ── How This Code Works ──────────────────────────────────────`);
  lines.push(` *`);
  lines.push(` * 1. setup()  : Initializes serial, pins, sensors, display,`);
  lines.push(` *               and wireless connectivity.`);
  lines.push(` *`);
  lines.push(` * 2. loop()   : Reads all sensors every ${isESP32 ? '2' : '2'} seconds,`);
  lines.push(` *               updates the display, and transmits data`);
  lines.push(` *               via ${hasWiFi && hasMQTT ? 'MQTT over WiFi' : hasLoRa ? 'LoRa radio' : 'Serial monitor'}.`);
  lines.push(` *`);
  lines.push(` * Required Libraries (install via Arduino Library Manager):`);
  const requiredLibs = [];
  if (hasSHT31) requiredLibs.push(' *   - Adafruit SHT31');
  if (hasBMP280) requiredLibs.push(' *   - Adafruit BMP280');
  if (hasBH1750) requiredLibs.push(' *   - BH1750 by Christopher Laws');
  if (hasMPU6050) requiredLibs.push(' *   - Adafruit MPU6050');
  if (hasOLED) requiredLibs.push(' *   - Adafruit SSD1306 + Adafruit GFX');
  if (hasLCD) requiredLibs.push(' *   - LiquidCrystal I2C');
  if (hasGPS) requiredLibs.push(' *   - TinyGPSPlus');
  if (hasLoRa) requiredLibs.push(' *   - LoRa by Sandeep Mistry');
  if (hasRGB) requiredLibs.push(' *   - Adafruit NeoPixel');
  if (hasRFID) requiredLibs.push(' *   - MFRC522 by GithubCommunity');
  if (isESP32 && hasMQTT) requiredLibs.push(' *   - PubSubClient');
  if (requiredLibs.length > 0) lines.push(...requiredLibs);
  else lines.push(' *   (none)');
  lines.push(` *`);
  lines.push(` * Board: ${isESP32 ? 'ESP32 Dev Module' : isATmega ? 'Arduino Uno' : 'STM32 Nucleo'}`);
  lines.push(` * ────────────────────────────────────────────────────────────`);
  lines.push(` */`);

  return {
    code: lines.join('\n'),
    mcu: mcuName,
    framework: isESP32 ? 'Arduino (ESP32)' : isATmega ? 'Arduino (AVR)' : 'STM32 HAL / Arduino',
  };
}

/* ================================================================
   PIPELINE RUNNER
   ================================================================ */
export const AGENTS = [
  { id: 1, name: 'Requirement Analyzer', desc: 'Parsing specifications', icon: '📋' },
  { id: 2, name: 'Circuit Designer', desc: 'Designing architecture', icon: '🔌' },
  { id: 3, name: 'Component Selector', desc: 'Selecting real parts', icon: '🧩' },
  { id: 4, name: 'PCB Layout Engineer', desc: 'Defining PCB rules', icon: '📐' },
  { id: 5, name: 'Verification Engineer', desc: 'Validating design', icon: '✅' },
  { id: 6, name: 'Output Generator', desc: 'Compiling deliverables', icon: '📦' },
  { id: 7, name: 'Firmware Engineer', desc: 'Generating Arduino code', icon: '⌨️' },
];

export async function runPipeline(userPrompt, onProgress) {
  const results = {};

  // Agent 1: Requirement Analyzer
  onProgress(1, 'running');
  results.requirements = await agentRequirementAnalyzer(userPrompt);
  onProgress(1, 'done');

  // Agent 2: Circuit Designer
  onProgress(2, 'running');
  results.circuitDesign = await agentCircuitDesigner(results.requirements);
  onProgress(2, 'done');

  // Agent 3: Component Selector
  onProgress(3, 'running');
  results.componentSelection = await agentComponentSelector(results.circuitDesign, results.requirements);
  onProgress(3, 'done');

  // Agent 4: PCB Layout
  onProgress(4, 'running');
  results.pcbLayout = await agentPCBLayout(results.circuitDesign, results.componentSelection, results.requirements);
  onProgress(4, 'done');

  // Agent 5: Verification
  onProgress(5, 'running');
  results.verification = await agentVerification(results.circuitDesign, results.componentSelection, results.pcbLayout, results.requirements);
  onProgress(5, 'done');

  // Agent 6: Output Generator
  onProgress(6, 'running');
  results.output = await agentOutputGenerator(results.requirements, results.circuitDesign, results.componentSelection, results.pcbLayout, results.verification);
  onProgress(6, 'done');

  // Agent 7: Firmware Engineer
  onProgress(7, 'running');
  results.firmware = await agentFirmwareEngineer(results.requirements, results.circuitDesign, results.componentSelection);
  onProgress(7, 'done');

  return results;
}
