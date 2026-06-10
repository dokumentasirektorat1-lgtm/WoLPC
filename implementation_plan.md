# Remote Wake-on-LAN (NyalakanPC) Implementation Plan

Building a robust remote PC wake system using ESP01 behind a captive portal.

## 1. Architecture Overview
- **Device**: ESP01 (ESP8266) submersed in the "REKTORAT" network.
- **Protocol**: MQTT for low-latency, two-way communication over the internet.
- **Cloud Infrastructure**: Using a public MQTT broker (e.g., HiveMQ) for remote access without port forwarding.
- **Frontend**: A modern, premium React dashboard with a real-time terminal.

## 2. ESP01 Firmware Features
- [ ] **Captive Portal Automator**: Logic to detect `hs.univet.id` redirect and POST login credentials.
- [ ] **Credential Rotation**: Automatically try different accounts (KEPEG022, VIP01-09) if login fails.
- [ ] **MQTT Client**: Connect to a secure/unique topic for commands and log publishing.
- [ ] **Wake-on-LAN Logic**: Send Magic Packets to the target MAC address.
- [ ] **Remote Serial**: Forward serial output to an MQTT topic for the web terminal.

## 3. Web Dashboard Features (Premium UI/UX)
- [ ] **Dashboard Home**: Elegant cards for each registered device.
- [ ] **Terminal Console**: A glassmorphic terminal showing live logs from the ESP01.
- [ ] **Device Configuration**: Add/Edit device names and MAC addresses.
- [ ] **Connectivity Status**: Real-time indication if the ESP01 is online.

## 4. Tech Stack
- **Firmware**: C++/Arduino (ESP8266WiFi, PubSubClient, WakeOnLan).
- **Frontend**: React + Vite + CSS Modules.
- **Styling**: Modern dark mode with glassmorphism and subtle animations.
- **Communication**: MQTT.js for the browser.

## 5. Security Considerations
- Use unique MQTT topic prefixes to prevent unauthorized access.
- Implement a simple "Access Key" in the dashboard to sign commands.
