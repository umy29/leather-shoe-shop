# leather-shoe-shop
E-commerce website for leather shoe shop

## Tech Stack

**Frontend:**
- [Angular 21](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [RxJS](https://rxjs.dev/)

**Backend:**
- [.NET 10](https://dotnet.microsoft.com/en-us/)
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL

## Architecture

We have used Clean Architecture for both the frontend and the backend to ensure a scalable and maintainable structure.

- **Backend Layers**: `Api` (Web SDK), `Application` (Business Logic), `Domain` (Core Models), `Infrastructure` (Data Persistence)
- **Frontend Layers**: `Core/Domain` (Models & Guards), `Data` (Services), `Presentation` (Components & Pages)
