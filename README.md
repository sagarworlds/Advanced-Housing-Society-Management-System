# Advanced Housing Society Management System

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
| **Backend** | C# ASP.NET Core (.NET 10), Entity Framework Core, SQLite |
| **Frontend** | Angular 20 (PWA, Mobile-first responsive design) |
| **Architecture** | Multi-tenant SaaS with data isolation |

## 📋 Prerequisites

- .NET 10 SDK
- Node.js 18+ & npm
- SQLite (bundled with .NET)

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

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [User Guide](./docs/USER_GUIDE.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) – see the LICENSE file for details.

## 📞 Support & Contact

- **Issues:** [GitHub Issues](../../issues)
- **Email:** your-email@example.com
- **Documentation:** [Wiki](../../wiki)

## 🎓 Authors

- **Sagar Worlds** – Initial development

---

*Last updated: July 2026*
