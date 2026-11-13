# Flet vs Expo — Controlled Mobile Benchmark

This repository contains two implementations of the same benchmark application:
- Flet: Python UI in main.py
- Expo / React Native: TypeScript UI in expo-app/

## Matched workloads
1. Navigation workload with 20 screens.
2. Generated 5,000-row dataset; search and selection, with up to 250 rows rendered.
3. Form validation and local submission.
4. Repeated visual state / motion scenario.

These are benchmark harnesses, not production applications.

## Run Flet
Create and activate a Python virtual environment, then run:
pip install -r requirements.txt
python main.py

## Run Expo
cd expo-app
npm install
npx expo start

For native Android, install Android SDK and run npx expo run:android.

## Fair test protocol
- Use the same physical Android device, OS version, refresh setting, power mode, and network state.
- Build both as release/production builds. Do not compare debug Expo with release Flet.
- Run each test at least 10 times after one warm-up; report median and p95.
- Cold launch: force-stop and measure time to first usable frame.
- Warm launch: background and resume, measure time to interactive.
- Navigation: time 20 sequential transitions.
- Scrolling: record dropped frames / jank during the same list interaction.
- Memory: record process PSS/RSS at idle and during list scrolling.
- Package size: compare final installable APK/AAB, noting ABI and split settings.
- Record device temperature and battery state; alternate test order to reduce thermal bias.

Record raw runs, median, p95, device model, Android version, build mode, and tool versions.

Important: GitHub Actions can validate source and build artifacts. It cannot establish real-world phone performance. Device measurements must be collected on the same physical Android device. No performance winner is claimed until those measurements exist.
