# ZoneWise — iOS App Store Submission Guide

## Prerequisites

Before you begin, you need:

1. **A Mac** with macOS 14 (Sonoma) or later
2. **Xcode 16+** installed from the Mac App Store
3. **Apple Developer Account** ($99/year) — enroll at [developer.apple.com](https://developer.apple.com/programs/enroll/)
4. **CocoaPods** installed (`sudo gem install cocoapods`)
5. **Node.js 18+** and npm

---

## Step 1: Transfer the Project to Your Mac

Copy the entire `zoning-guide/` folder to your Mac. You can use:
- AirDrop
- USB drive
- Git (push to a private repo, clone on Mac)
- zip and transfer

## Step 2: Install Dependencies

Open Terminal, navigate to the project folder:

```bash
cd ~/path/to/zoning-guide
npm install
```

## Step 3: Build Web Assets

```bash
npm run build
```

This compiles the React app into `dist/public/`.

## Step 4: Sync to iOS

```bash
npx cap sync ios
```

This copies the built web assets into the iOS project and installs Cocoapod dependencies.

## Step 5: Install CocoaPods

```bash
cd ios/App
pod install
cd ../..
```

If you don't have CocoaPods:
```bash
sudo gem install cocoapods
```

## Step 6: Open in Xcode

```bash
npx cap open ios
```

This opens the Xcode workspace. **Important:** Always open `App.xcworkspace` (not `App.xcodeproj`).

## Step 7: Configure Signing

In Xcode:

1. Select the **App** target in the project navigator
2. Go to the **Signing & Capabilities** tab
3. Check **"Automatically manage signing"**
4. Select your **Team** (your Apple Developer account)
5. The Bundle Identifier should be `com.zonewise.app` — change this if it's already taken in App Store Connect

## Step 8: Update Version Numbers

In the **General** tab of your target:
- **Display Name:** ZoneWise
- **Bundle Identifier:** com.zonewise.app
- **Version:** 1.0.0
- **Build:** 1

## Step 9: Set Deployment Target

- Set **Minimum Deployments** to **iOS 16.0** (recommended for widest coverage)
- This is in the **General** tab under **Minimum Deployments**

## Step 10: Replace the App Icon

The solid teal icon is a placeholder. For App Store approval, you should:

1. Open `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Replace `AppIcon-512@2x.png` with your designed 1024×1024 icon (no rounded corners — iOS adds them)
3. The icon should clearly show the ZoneWise "Z" logo

You can use tools like:
- [Icon Kitchen](https://icon.kitchen/) — free, generates all sizes
- [App Icon Generator](https://www.appicon.co/) — drag-and-drop
- Figma / Sketch with a 1024×1024 artboard

## Step 11: Test on Simulator

1. Select an iPhone simulator (e.g., "iPhone 16 Pro") from the device menu
2. Press **⌘ + R** to build and run
3. Verify:
   - App launches with teal splash screen
   - Map loads and shows SW Florida
   - Permit Calculator works
   - Find Pros tab works
   - License verification works
   - Dark mode toggle works

## Step 12: Test on Real Device

1. Connect your iPhone via USB
2. Select it as the build target
3. Press **⌘ + R** to build and run
4. You may need to trust the developer certificate on the phone:
   Settings → General → VPN & Device Management → trust your certificate

## Step 13: Create App Store Connect Listing

Go to [App Store Connect](https://appstoreconnect.apple.com/):

1. Click **"My Apps"** → **"+"** → **"New App"**
2. Fill in:
   - **Platform:** iOS
   - **Name:** ZoneWise - FL Zoning & Permits
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.zonewise.app
   - **SKU:** zonewise-v1
   - **User Access:** Full Access
3. Click **Create**

### App Store Metadata

Use this copy for the listing:

**Subtitle:**
```
SW Florida Zoning & Permit Guide
```

**Description:**
```
ZoneWise simplifies zoning, permitting, and contractor hiring for Southwest Florida homeowners — from Brooksville to Naples.

INTERACTIVE ZONING MAP
• Explore zoning districts across 9 SW Florida counties
• Address search with geocoding
• Color-coded zones with legends (residential, commercial, industrial, open space)
• Click counties to zoom in and see local data

PERMIT CALCULATOR
• 10 project types: fences, sheds, decks, roofs, pools, HVAC, electrical, plumbing, additions, and solar
• County-specific fee estimates with Florida surcharge calculations
• Side-by-side county comparison charts
• Required permits, inspections, and timelines for each project
• Pro tips and exemption information

FIND LICENSED PROFESSIONALS
• Search 10 trade categories across Google Maps, Yelp, and Angi
• LIVE FL DBPR license verification — enter any license number to instantly check its status
• Color-coded status badges: Active, Inactive, Delinquent, Revoked, Suspended
• Hiring tips and best practices

COUNTIES COVERED
Hernando • Pasco • Pinellas • Hillsborough • Manatee • Sarasota • Charlotte • Lee • Collier

Data sourced from official county GIS portals, ArcGIS REST services, and the Florida DBPR database. Fee estimates based on 2025–2026 published county fee schedules.
```

**Keywords:**
```
zoning,permits,florida,contractor,building,construction,fees,tampa,naples,fort myers
```

**Categories:**
- Primary: Utilities
- Secondary: Business

**Age Rating:** 4+

**Price:** Free (or your chosen price)

### Screenshots Required

You need screenshots for:
- **iPhone 6.7"** (iPhone 16 Pro Max) — 1290×2796 px
- **iPhone 6.5"** (iPhone 15 Plus) — 1284×2778 px
- **iPad Pro 12.9"** — 2048×2732 px (if supporting iPad)

Take screenshots showing:
1. Map view with zoning overlays
2. Permit Calculator with a project selected
3. Fee comparison across counties
4. Find Pros with a trade selected
5. License verification with a result badge

## Step 14: Archive and Upload

1. In Xcode, select **"Any iOS Device (arm64)"** as the build target
2. Go to **Product → Archive**
3. When the archive is complete, the Organizer window opens
4. Click **"Distribute App"**
5. Select **"App Store Connect"**
6. Click **"Upload"**
7. Wait for processing (usually 15–30 minutes)

## Step 15: Submit for Review

Back in App Store Connect:

1. Select your build under **"Build"** section
2. Fill in the **App Review Information**:
   - Contact info
   - Notes for reviewer: "This app displays public Florida zoning data and permit fee estimates. The license verification feature queries the public FL DBPR database."
3. Click **"Submit for Review"**

Review typically takes 24–48 hours for first submissions.

---

## Backend Considerations

The current app queries a backend server for DBPR license verification (`/api/verify-license`). For the App Store version, you have two options:

### Option A: Host the Backend (Recommended)
Deploy the Express server to a cloud provider:
- **Railway** — `railway up` from the project root
- **Render** — connect your GitHub repo
- **AWS/GCP/Azure** — deploy as a container

Then update `capacitor.config.ts` server URL to point to your hosted backend:
```ts
server: {
  url: "https://your-api.railway.app",
}
```

### Option B: Client-Only Mode
The app already falls back gracefully when the API is unavailable — it shows a "Check Manually" badge with a link to the DBPR portal. No backend needed for the core permit calculator and map features.

---

## Updating the App

When you make changes:

```bash
# 1. Edit web code
# 2. Rebuild
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Open Xcode and archive
npx cap open ios
```

Bump the version and build numbers in Xcode before each App Store update.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "No signing certificate" | Xcode → Preferences → Accounts → Download certificates |
| Pod install fails | `cd ios/App && pod repo update && pod install` |
| White screen on launch | Check `dist/public/index.html` exists, re-run `npx cap sync ios` |
| API calls fail | Update server URL in `capacitor.config.ts`, rebuild and sync |
| Build fails on M1/M2 | Open Xcode with Rosetta or run `arch -x86_64 pod install` |
| Rejected by App Review | See notes in Step 15 — emphasize public data, no user accounts |
