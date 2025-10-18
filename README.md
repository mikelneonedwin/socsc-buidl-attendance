# 🧠 SOCSC BUIDL Attendance

A modern attendance tracker for **SOCSC Uniuyo BUIDL sessions**, built with **React**, **shadcn/ui**, and **Sui wallet integration**.

Students can connect their wallet, mark their attendance, and view their past submissions — all from a clean, responsive web interface.

---

## ✨ Features

- 🔐 **Wallet Integration** — Connect your Sui wallet via `@mysten/dapp-kit`
- 📝 **Attendance Form** — Simple, validated form using `react-hook-form` + `zod`
- 📜 **Submission History** — Review all past session records
- ⚡ **Optimistic Updates** — Managed with `@tanstack/react-query`
- 🎨 **Consistent UI** — Built entirely with `shadcn/ui` components and TailwindCSS
- 🔔 **Toasts & Feedback** — Smooth UX powered by `sonner`

---

## 🧰 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript |
| UI Components | shadcn/ui + TailwindCSS |
| Wallet | @mysten/dapp-kit (Sui) |
| State / Async | TanStack Query |
| Forms & Validation | React Hook Form + Zod |
| Notifications | Sonner |
| Build Tool | Vite |

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/mikelneonedwin/socsc-buidl-attendance.git
cd socsc-buidl-attendance
