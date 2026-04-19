# EV Simulator Pro

An interactive Exposure Value (EV) Calculator and Camera Interface simulator built with React and TypeScript. This tool helps photographers and students understand the relationship between Aperture, Shutter Speed, and ISO, and how they collectively determine the Exposure Value.

## 🚀 Features

- **Interactive Viewfinder**: Real-time simulation of how camera settings affect an image.
  - **Brightness Simulation**: Visualizes overexposure and underexposure.
  - **Depth of Field (DoF)**: Simulates background blur based on the selected Aperture.
  - **Motion Blur**: Abstractly represents the effect of Shutter Speed on moving subjects.
  - **HUD Overlay**: Classic camera grid and exposure meter (-3 to +3 stops).
- **Manual Controls**: Precise adjustment of:
  - **Aperture (f-stop)**: From f/1.4 to f/22.
  - **Shutter Speed**: From 1/1000s to 1s.
  - **ISO**: From 100 to 6400.
- **Mathematical Breakdown**: Real-time calculation of the EV formula using KaTeX:
  $$EV = \log_2(N^2) - \log_2(t) - \log_2(ISO/100)$$
- **Equivalent Exposure Curve**: A dynamic graph showing different combinations of Aperture and Shutter Speed that result in the same EV.
- **Data Log**: Save and compare different exposure configurations.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Bundler**: Vite
- **Data Visualization**: Recharts
- **Math Rendering**: KaTeX
- **Icons**: Lucide React
- **Styling**: Modern CSS (Variables, Grid, Flexbox)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Galaxy1920/ev-simulator.git
   cd ev-simulator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🌐 Deployment

This project is configured for **GitHub Pages**. The deployment is handled automatically via GitHub Actions (see `.github/workflows/deploy.yml`).

The production base path is set to `/ev-simulator/` in `vite.config.ts`.

## 📖 How it Works

The simulator uses a reference "Target EV" to represent a correctly exposed scene. The difference between the user-selected settings and this target determines the visual brightness in the viewfinder:
- **EV < Target**: The image appears brighter (Overexposed).
- **EV > Target**: The image appears darker (Underexposed).

The equivalent exposure curve demonstrates the "Law of Reciprocity," showing how you can trade stops of light between Aperture and Shutter Speed while maintaining a constant exposure level.

---
Developed by [Galaxy1920](https://github.com/Galaxy1920)
