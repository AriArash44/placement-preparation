# Placement Preparation Projects for Angular

Hands-on implementations of project ideas from [placementpreparation.io](https://www.placementpreparation.io) built with **Angular**.  
This repo is a learning playground to practice Angular, UI libraries, and related tooling.

---

## Objectives
- Build real projects to strengthen Angular skills  
- Explore UI libraries and tooling in this stack  
- Learn state management, routing, testing, and deployment  
- Create a portfolio of small-to-medium apps

---

## Tech Stack and Essential Libraries
- **Framework**: Angular (Angular CLI)  
- **Language**: TypeScript  
- **Routing & HTTP**: Angular Router; `@angular/common/http` (HttpClient)  
- **Reactive**: RxJS (observables, operators)  
- **UI / Styling**:
  - **Tailwind CSS** (utility-first styling)
  - **Angular Material** + **Angular CDK** (components, accessibility, theming)
- **State Management**:
  - **NgRx** (store, effects) — essential for larger apps
  - **Akita** (optional, simpler alternative)
- **i18n**: `ngx-translate` (runtime translations)
- **Forms**: Reactive Forms (`@angular/forms`)
- **Testing**:
  - Unit: **Jest**
  - E2E: **Cypress** (if needed)
- **Build / Bundling**: Angular CLI (default)
- **Package Managers**: npm
---

## Project Layout
Each project lives in its own folder. Example structure:
```
├─ project-1(To-Do-List-App)
├─ project-2(Weather-App)
├─ project-3(Currency-Converter-App)
└─ etc
```
---

## Setup Instructions
To run any project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/AriArash44/placement-preparation.git
   cd placement-preparation
2. Navigate to the project folder:
   ```bash
   cd project-1(To-Do-List-App)
3. Install dependencies:
   ```bash
   npm install
4. Run the development server:
   ```bash
   ng serve
5. Open your browser at http://localhost:4200/.