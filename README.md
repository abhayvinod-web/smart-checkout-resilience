# ⚡ Smart Checkout Downtime Resilience & One-Click Auto-Retry

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-12.2-FF0055?style=flat-square&logo=framer&logoColor=white)](https://motion.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> A state-resilient payment checkout interface engineered to prevent cart abandonment during bank gateway outages and network timeouts through real-time bank health telemetry, zero-reload idempotency preservation, and one-click fallback instrument switching.

*Inspired by the **Razorpay Fix-My-Itch** payment resilience problem statement.*

---

## 📌 Table of Contents

- [The Problem](#-the-problem)
- [The Solution & Core Innovation](#-the-solution--core-innovation)
- [Key Features](#-key-features)
- [Finite State Machine (FSM) Architecture](#-finite-state-machine-fsm-architecture)
- [Interactive Recruiter Simulation Panel](#-interactive-recruiter-simulation-panel)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Engineering Highlights](#-engineering-highlights)
- [Author & Contact](#-author--contact)

---

## 🛑 The Problem

During peak flash sales or high-traffic checkout events, acquiring bank payment gateways frequently suffer temporary timeouts, server latency, or OTP delivery delays:

1. **Abrupt Failure Displays:** Traditional checkouts clear the active form state upon encountering a gateway error, forcing buyers to restart checkout from scratch.
2. **Zero Pre-Flight Visibility:** Users often attempt transactions using degraded payment rails without knowing that the specific bank's servers are currently unstable.
3. **Severe Cart Abandonment:** Over **28% of cart drop-offs** during payments are directly attributable to failed transactions where users simply give up rather than re-entering their payment details.

---

## 💡 The Solution & Core Innovation

**Smart Checkout Resilience** introduces an intelligent failover layer between the merchant storefront and payment rails:

- **Pre-Emptive Gateway Telemetry:** Displays live health status (Operational vs Degraded) across major banks (HDFC, SBI, ICICI, Axis) and recommends the fastest route before the user pays.
- **Zero-Reload State Persistence:** Keeps the order payload, cart items, customer details, and session tokens locked in memory across errors.
- **1-Click Fallback Routing:** If a primary rail (e.g. UPI) fails, the UI dynamically opens instant 1-click fallback alternatives (Credit/Debit Card or NetBanking) without refreshing or re-authenticating.
- **Simulated Auto-Recovery:** Synthetic countdown retries and smart OTP re-polling minimize friction when network latency recovers.

---

## ✨ Key Features

- **🔴 Live Gateway Telemetry Indicator:** Visual health bars and uptime scores across major payment aggregators and UPI providers.
- **🔄 Deterministic Failover States:** Seamless transitions between idle, processing, simulated failure, and recovered states.
- **💳 Multi-Rail Support:** Interactive switches between UPI (GPay/PhonePe), Saved Cards (Visa/Mastercard), and Direct NetBanking.
- **🎛 Recruiter Simulation Console:** Built-in floating debug controls allowing anyone reviewing the app to simulate gateway drop-offs, network timeouts, or OTP arrival lag on demand.
- **🔊 Web Audio Feedback:** Synthesized audio cues for state transitions (processing beep, error warning, recovery chime).
- **🧾 Instant Verified Receipt:** Generates complete transaction reference IDs, timestamped audit logs, and downloadable payment confirmations upon successful recovery.

---

## 📐 Finite State Machine (FSM) Architecture

The checkout lifecycle is governed by an explicit finite-state machine to prevent race conditions and invalid UI states:

```plaintext
                     [ 1. IDLE / PRE-FLIGHT ]
                     (Check Rail Health Status)
                                 │
                                 ▼
                     [ 2. PAYMENT INITIATED ]
                     (Idempotency Token Locked)
                                 │
                                 ▼
                     [ 3. PROCESSING / OTP ]
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        (Gateway Success)                 (Rail Outage / Timeout)
                 │                               │
                 ▼                               ▼
      [ 4A. SUCCESS RECEIPT ]          [ 4B. RECOVERY FALLBACK ]
                                       (Preserve Cart & State)
                                                 │
                                                 ▼
                                       [ 5. 1-CLICK RETRY / ALT RAIL ]
                                       (UPI ➔ Saved Card / NetBanking)
                                                 │
                                                 ▼
                                       [ 6. RECOVERED & VERIFIED ]

│       ├── Header.tsx             # Brand header with security badges
│       ├── BankHealthBar.tsx      # Real-time bank status telemetry
│       ├── PaymentMethods.tsx     # UPI, Card, and NetBanking selectors
│       ├── FailureModal.tsx       # State-preserving fallback overlay
│       ├── SuccessReceipt.tsx     # Transaction audit and download receipt
│       └── SimulatorControls.tsx  # Recruiter interactive trigger panel
