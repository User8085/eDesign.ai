🚀 Edesign.ai

AI-Powered Electronic Circuit & PCB Design Automation System

📌 Overview:

Edesign.ai is a multi-agent AI-based system that converts natural language prompts into structured electronic circuit designs. The goal is to simulate a real-world EDA (Electronic Design Automation) workflow by automating the process from requirement analysis to circuit-level design.

This project demonstrates how high-level user inputs can be transformed into implementable hardware designs using modular AI agents.

🎯 Key Features:

🧠 Natural Language Input- 
Users can describe a system in plain English (e.g., “Temperature monitoring system using Arduino”)

⚙️ Multi-Agent Architecture-
Different agents handle different stages of the design pipeline


🔍 Requirement Analysis:
Extracts inputs, outputs, and system objectives from user prompts

🔌 Automated Component Selection
Chooses appropriate microcontrollers, sensors, and modules

📐 Schematic Generation
Generates structured circuit connections and pin mappings


🔮 Future Scope:
Arduino code generation
PCB layout automation
SPICE simulation integration
🏗️ System Architecture

The system is designed as a modular pipeline, similar to real-world semiconductor design flows.


🔹 1. Requirement Analyzer
Parses user input
Identifies:
Inputs (e.g., sensors)
Outputs (e.g., actuators)
System purpose

🔹 2. Design Agent
Selects:
Microcontroller (Arduino, ESP32, etc.)
Required components
Power considerations

🔹 3. Schematic Generator
Converts design into:
Circuit connections
Pin configurations
Structured schematic data

🔹 4. (Planned Extensions)
Arduino code generation (Embedded C)
PCB layout generation (KiCad integration)
Simulation & validation
🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript
Build Tool: Vite
Architecture: Multi-Agent System (Custom JS Logic)
Concept Inspiration: Electronic Design Automation (EDA)
