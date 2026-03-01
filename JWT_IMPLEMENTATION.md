# Implementación JWT - Guía de Uso

## Resumen de cambios implementados

Se han realizado los siguientes cambios para implementar autenticación JWT en el proyecto:

### 1. **Nuevos Archivos Creados:**

#### `src/auth/jwt.service.ts`
- Servicio para generar y verificar tokens JWT
- Métodos:
  - `generateAccessToken(payload)`: Genera un token JWT con el payload proporcionado
  - `verifyToken(token)`: Verifica la validez de un token
  - `decodeToken(token)`: Decodifica un token para obtener el payload

#### `src/auth/guards/jwt.guard.ts`
- Guard (protector) de rutas que verifica la autenticación JWT
- Valida que el token esté presente en el header de autorización
- Extrae el payload del token y lo adjunta a la solicitud para su uso posterior

### 2. **Archivos Modificados:**

#### `src/auth/auth.module.ts`
- Se agregó la importación y configuración del `JwtModule`
- Se exportan `JwtTokenService`, `JwtAuthGuard` y `JwtModule` para que estén disponibles en otros módulos
- Configuración asincrónica que lee las variables de entorno `JWT_SECRET` y `JWT_EXPIRES_IN`

#### `src/customer/customer.module.ts`
- Se importó `AuthModule` para tener acceso a `JwtTokenService` y `JwtAuthGuard`

#### `src/customer/services/customer.service.ts`
- Se inyectó `JwtTokenService` en el constructor
- Se modificó el método `login()` para generar y retornar un token JWT junto con los datos del usuario
- El token JWT contiene: `id`, `email`, `name`, `currentId`

#### `src/customer/customer.controller.ts`
- Se importó `JwtAuthGuard`
- Se aplicó el decorator `@UseGuards(JwtAuthGuard)` a las siguientes rutas protegidas:
  - `GET /kyc-status/:email/:acceptTcandPrivacity/:acceptPubiclty`
  - `POST /logout`
  - `PATCH /:id/preferences`
  - `POST /score-verification`
  - `POST /employment-verifications`
  - `POST /acept-proposal`
  - `GET /getUserSalay/:email`
  - `POST /check-session`

### 3. **Rutas Públicas (sin protección):**
- `POST /register`
- `GET /verify-email-register/:email`
- `POST /sign-up`
- `POST /send-otp`
- `POST /send-otp-recover`
- `POST /verify-otp`
- `POST /verify-otp-pass`
- `POST /otp-whatsapp`
- `POST /verify-otp-whatsapp`
- `POST /login` (genera el token)
- `GET /validationLink/:email`
- `POST /createDocument`
- `GET /contract-info/:email`
- `POST /sw-sapien`
- `GET /commission`

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## Cómo usar el JWT

### 1. **Login del Usuario**

**Solicitud:**
```bash
POST /customer/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "userPassword123"
}
```

**Respuesta (éxito):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": 1,
      "names": "John Doe",
      "email": "user@example.com",
      "curp": "encryptDataCURP",
      "generateCurrentId": "uuid-string"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. **Usar el Token en Solicitudes Protegidas**

Para acceder a cualquier ruta protegida, debe incluir el token en el header de autorización:

```bash
GET /customer/kyc-status/user@example.com/true/false
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. **Estructura del Token JWT**

El token contiene el siguiente payload:

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "currentId": "uuid-string",
  "iat": 1704067200,
  "exp": 1704153600
}
```

## Flujo de Autenticación

```
1. Usuario envía credenciales al endpoint /login
2. Sistema valida email y contraseña
3. Si son válidos, genera un JWT con los datos del usuario
4. Retorna el token al cliente
5. El cliente incluye el token en futuras solicitudes
6. El JwtAuthGuard valida el token antes de ejecutar la ruta
7. Si el token es válido, la solicitud procede
8. Si el token es inválido o expirado, se retorna error 401 (Unauthorized)
```

## Manejo de Errores

### Token no proporcionado:
```
HTTP 401 Unauthorized
Message: "No token provided"
```

### Token inválido o expirado:
```
HTTP 401 Unauthorized
Message: "Invalid or expired token"
```

## Seguridad

- Usa una `JWT_SECRET` fuerte y única en producción
- Configura un tiempo de expiración apropiado en `JWT_EXPIRES_IN`
- El token debe ser transmitido por HTTPS en producción
- Guarda el token en el lado del cliente de manera segura (preferentemente en httpOnly cookies)

## Próximos Pasos Recomendados

1. Implementar refresh tokens para renovar el acceso sin rehacer login
2. Agregar roles y permisos (@Role decorator)
3. Implementar logout en base de datos (token blacklist)
4. Agregar validación de alcance (scopes) en el JWT
5. Implementar 2FA (Two-Factor Authentication)
