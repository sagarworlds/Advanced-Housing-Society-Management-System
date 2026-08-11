# Advanced Housing Society Management System

[![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![C%23](https://img.shields.io/badge/C%23-12-239120?logo=csharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive multi-tenant SaaS application for managing modern housing societies with features for maintenance, billing, visitor management, and resident communication.

## 🎯 Features

- **User Management & Authentication** – Role-based access control (Admin, Manager, Resident)
- **Maintenance & Billing Management** – Track maintenance requests and automate billing cycles
- **Gate & Visitor Management** – Digital entry logs and visitor pre-authorization
- **Complaint & Helpdesk Management** – Ticket-based issue resolution system
- **Facility & Amenity Booking** – Self-service booking for common areas
- **Notices & Communication** – Broadcast announcements and notifications to residents

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | [C# ASP.NET Core](https://dotnet.microsoft.com/) (.NET 10), [Entity Framework Core](https://learn.microsoft.com/en-us/ef/), [SQLite](https://www.sqlite.org/) |
| **Frontend** | [Angular](https://angular.io/) 20 (PWA, Mobile-first responsive design) |
| **Language** | [C#](https://learn.microsoft.com/en-us/dotnet/csharp/) (Backend), [TypeScript](https://www.typescriptlang.org/) (Frontend) |
| **Architecture** | Multi-tenant SaaS with data isolation |

## 📋 Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 18+ & npm
- [SQLite](https://www.sqlite.org/download.html) (bundled with .NET)

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

The application will be available at `http://localhost:4200`

## 📁 Project Structure

```
.
├── backend/          # ASP.NET Core API
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── Data/
├── frontend/         # Angular PWA application
│   ├── src/
│   ├── components/
│   └── services/
└── docs/            # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) – see the LICENSE file for details.

## 🎓 Authors

- **Sagar Worlds** – Initial development

---

*Last updated: July 2026*
