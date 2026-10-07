# Swifty Proteins

A cross-platform mobile application for exploring and visualizing molecular ligands in interactive 3D.

Swifty Proteins was developed as part of the **42 School curriculum**, with a focus on mobile development, 3D graphics, scientific data processing, secure authentication, networking and structured file parsing.

---

## 📱 App Demo

A short demonstration of Swifty Proteins running on Android.

https://github.com/user-attachments/assets/20b37145-f6db-46c8-9ee6-2a6bc1ae8837

---

## 🧬 Overview

Swifty Proteins allows users to search for molecular ligands and visualize their structures interactively in 3D.

The application retrieves ligand data from the **RCSB Protein Data Bank (RCSB PDB)** using the `.cif` format, parses the molecular information, and converts it into a 3D representation suitable for interaction on a mobile device.

The project combines several areas of software engineering:

- Mobile application development
- TypeScript and React Native
- 3D graphics and rendering
- Chemical Information File (`.cif`) parsing
- Network programming and asynchronous operations
- Secure local authentication
- Biometric authentication
- Molecular data structures
- Touch-based 3D interaction
- Native sharing capabilities
- Error handling and performance considerations

The project subject specifically requires the use of RCSB `.cif` files and interactive molecular visualization.

---

## ✨ Features

### 🔐 Authentication

- Local user registration and authentication.
- Password validation and secure password hashing.
- Passwords are never stored in plain text.
- Biometric authentication when supported by the device.
- Secure fallback to username/password authentication.
- Authentication state is reset when the application returns from the background.
- Clear feedback for authentication failures.

The authentication system follows the security requirements defined by the project, including password hashing and biometric authentication with a password fallback.

### 🔎 Ligand Search

- Complete ligand catalogue generated from the project dataset.
- Real-time search.
- Case-insensitive filtering.
- Search by ligand identifier.
- Efficient rendering of a large ligand list.
- Loading feedback while retrieving molecular data.

The project requires the ligand list to support real-time, case-insensitive filtering and to retrieve the selected ligand from RCSB.

### 🌐 RCSB Integration

Ligand structures are retrieved directly from the RCSB database using the `.cif` endpoint:

```text
https://files.rcsb.org/ligands/view/{ligand}.cif
```

The application performs the complete pipeline:

```text
Ligand selection
      ↓
HTTP request
      ↓
CIF document
      ↓
CIF parsing
      ↓
Atoms + bonds
      ↓
3D molecular representation
```

The project specification requires `.cif` data from RCSB and allows the application to implement its own parser or use an appropriate library.

### 🧪 CIF Parsing

The application processes Chemical Information Files and extracts the molecular information required for visualization.

The parser handles molecular data such as:

- Atom identifiers
- Element types
- Cartesian coordinates
- Bond relationships
- Molecular structure information

This converts text-based scientific data into application-level data structures that can be consumed by the 3D renderer.

### 🧊 3D Molecular Visualization

Molecules are displayed using an interactive **ball-and-stick representation**.

- Atoms are rendered as spheres.
- Bonds are rendered as cylinders.
- Atom colors follow the CPK convention.
- The camera is positioned to provide a useful initial view.
- Molecules can be rotated using touch gestures.
- Molecules can be zoomed using pinch gestures.
- Individual atoms can be selected to inspect their information.

The subject defines ball-and-stick rendering, CPK coloring, atom information and interactive rotation/zoom as core requirements.

### 🎨 CPK Coloring

The application follows the standard CPK color convention for the main chemical elements:

| Element | CPK representation |
|---|---|
| Carbon | Black / Gray |
| Hydrogen | White |
| Oxygen | Red |
| Nitrogen | Blue |
| Sulfur | Yellow |
| Phosphorus | Orange |

These conventions are part of the project's molecular visualization requirements.

### 🧭 3D Interaction

The molecular viewer is designed for direct touch interaction:

- **Rotate:** drag across the molecular view.
- **Zoom:** pinch with two fingers.
- **Pan:** two-finger movement where supported.
- **Atom selection:** tap an atom to inspect its element information.

The goal is to keep the 3D scene responsive while manipulating molecular structures on a real mobile device.

### 📤 Sharing

The application provides a native sharing workflow for the current molecular visualization, allowing the generated view to be exported through the device's native sharing interface.

The project specification requires a share action capable of capturing the current 3D view and passing it to the platform's native share sheet.

### ⚠️ Error Handling

Network and parsing operations are handled explicitly so that failures are communicated to the user instead of causing application crashes.

Handled scenarios include:

- No internet connection
- HTTP 404 / ligand not found
- Request timeout
- Invalid or corrupted CIF data
- Invalid user input
- Authentication errors
- Unsupported biometric authentication

The subject explicitly requires graceful handling of network, parsing, memory and input errors, together with clear loading and error feedback.

---

## 🏗️ Architecture

The application follows a modular React Native architecture separating the presentation layer, application services, data processing and 3D rendering.

A simplified data flow is:

```text
┌──────────────────────┐
│   Authentication     │
│ Register / Login     │
│ Biometrics           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Ligand Search    │
│  Filter / Selection  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      RCSB API        │
│      .cif file       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      CIF Parser      │
│ Atoms / Coordinates  │
│      / Bonds         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Molecular Model    │
│    Data Structures   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      3D Renderer     │
│ CPK / Ball & Stick   │
│ Gestures / Selection │
└──────────────────────┘
```

---

## 🛠️ Technology Stack

| Area | Technology |
|---|---|
| Mobile framework | React Native |
| Language | TypeScript |
| Development platform | Expo |
| Authentication | Local authentication + bcrypt |
| Biometrics | Expo Local Authentication |
| Secure storage | Expo Secure Store |
| Cryptography | Expo Crypto |
| Molecular data | RCSB PDB |
| Molecular format | CIF |
| 3D rendering | React Native compatible 3D rendering stack |
| Networking | Fetch / asynchronous HTTP |
| Package manager | npm |
| Build tooling | Expo / React Native |

The project specification explicitly permits React Native or another modern multiplatform framework and requires current SDK/language versions for the chosen platform.

---

## 🚀 Getting Started

### Prerequisites

Install the required development environment before running the project:

- Node.js
- npm
- Expo CLI / Expo tooling
- Android development environment if building for Android
- A physical Android device or compatible emulator

The project should be tested on a real device because mobile rendering performance and device-specific behavior can differ from emulators or simulators.

### Installation

Clone the repository and install the dependencies:

```bash
git clone <YOUR_REPOSITORY_URL>
cd swifty-proteins
npm install
```

### Environment Variables

Create the required environment configuration according to the local project setup.

Do **not** commit secrets or private credentials to the repository.

Example:

```env
EXPO_PUBLIC_...
```

Keep the real values in your local environment and ensure sensitive files are excluded through `.gitignore`.

### Generate the Ligand Catalogue

The project includes a script for generating the TypeScript ligand catalogue:

```bash
node scripts/generate-ligands.js
```

### Start the Development Server

```bash
npx expo start
```

For Android development:

```bash
npx expo run:android
```

If the project is being evaluated on a physical device, make sure the device is connected and available to ADB.

---

## 📱 Running on a Physical Android Device

For development and evaluation, a physical Android device is recommended.

Check the connected devices:

```bash
adb devices
```

Then launch the application:

```bash
npx expo run:android --device
```

The project requirements explicitly emphasize testing on real devices because performance and behavior can differ significantly from emulators.

---

## 🔄 Application Flow

The typical user flow is:

```text
Launch Application
        │
        ▼
     Login
        │
   ┌────┴─────┐
   │          │
Password   Biometrics
   │          │
   └────┬─────┘
        ▼
   Ligand List
        │
        ▼
  Search Ligand
        │
        ▼
 Select Ligand
        │
        ▼
 Download CIF
        │
        ▼
   Parse CIF
        │
        ▼
 Generate 3D Model
        │
        ▼
 Interact with Molecule
        │
        ├── Rotate
        ├── Zoom
        ├── Select Atom
        └── Share
```

---

## 🔒 Security Considerations

Security is an important part of the application design.

The implementation follows principles required by the project:

- Passwords are hashed rather than stored in plain text.
- Authentication data is handled locally.
- Sensitive information is not committed to the repository.
- Biometric authentication failures are handled explicitly.
- Network data is validated before being processed.
- Authentication is required when the application is launched or returns from the background.

These requirements are aligned with the subject's security section, including secure storage, validation of network data and secure biometric failure handling.

---

## ⚡ Performance

The application is designed with mobile performance in mind.

Key considerations include:

- Asynchronous network requests.
- Loading states during remote operations.
- Efficient ligand list rendering.
- Controlled parsing of molecular data.
- Efficient 3D scene generation.
- Touch interactions designed for smooth manipulation.
- Avoiding unnecessary work on the UI thread.

The project specification requires asynchronous network operations and a responsive UI, while the 3D view targets smooth interaction without visible stuttering.

---

## 📚 References

- **RCSB Protein Data Bank:** molecular structure database used as the source for ligand CIF files.
- **RCSB Ligand CIF endpoint:** `https://files.rcsb.org/ligands/view/{ligand}.cif`
- **42 School:** project curriculum and evaluation requirements.

---

## 👨‍💻 Author

**Víctor Díez Cuesta**

Software Engineering student at **42 Madrid**.

Interested in software development, mobile applications, systems programming, networking and software architecture.

---

## 📄 License

This project was created as part of the 42 School curriculum.

Unless otherwise specified, the source code is intended primarily for educational and portfolio purposes.
