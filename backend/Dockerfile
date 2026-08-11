FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

# Copy project files for caching restore layer
COPY ["SocietyManagement.Api/SocietyManagement.Api.csproj", "SocietyManagement.Api/"]
COPY ["SocietyManagement.Core/SocietyManagement.Core.csproj", "SocietyManagement.Core/"]
COPY ["SocietyManagement.Infrastructure/SocietyManagement.Infrastructure.csproj", "SocietyManagement.Infrastructure/"]

RUN dotnet restore "SocietyManagement.Api/SocietyManagement.Api.csproj"

# Copy full source and publish
COPY . .
WORKDIR "/src/SocietyManagement.Api"
RUN dotnet publish "SocietyManagement.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=build /app/publish .

# Render dynamically injects PORT at runtime
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "SocietyManagement.Api.dll"]
