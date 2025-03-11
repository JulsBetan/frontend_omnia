# 📌 Configuración de Autenticación con Microsoft Entra ID en Supabase

Este documento describe el proceso completo para configurar la autenticación con **Microsoft Entra ID** en **Supabase** y su integración en una aplicación Vue.js.

---

## **1️⃣ Creación y Configuración de la Aplicación en Microsoft Entra ID**
### **1.1 Crear una aplicación en Azure**
1. Accede a **[Azure Portal](https://portal.azure.com/)**.
2. Ve a **"Microsoft Entra ID"** > **"App registrations"**.
3. Haz clic en **"New registration"**.
4. Completa los campos:
   - **Nombre**: `"Omnia Pro Auth"`
   - **Tipos de cuentas admitidos**:  
     - ✅ "Cuentas en cualquier directorio de organización y cuentas personales de Microsoft"
   - **URI de redirección**:
     - Selecciona **"Web"** e ingresa:  
       ```
       https://ntpxufobtaodzapohxud.supabase.co/auth/v1/callback
       ```
5. Haz clic en **"Register"**.

---

### **1.2 Obtener credenciales (Client ID y Secret)**
1. En **Azure Portal**, accede a la aplicación recién creada.
2. Copia el **Application (Client) ID**.
3. En el menú lateral, ve a **"Certificates & secrets"**.
4. En **Client secrets**, haz clic en **"New client secret"**.
   - **Asigna un nombre**: `"SupabaseSecret"`
   - **Duración**: 24 meses.
5. **Guarda el valor del secreto generado** (Client Secret) antes de salir.

---

### **1.3 Configurar Permisos en Microsoft Graph**
1. Ve a **"API Permissions"**.
2. Haz clic en **"Add a permission"**.
3. Selecciona **"Microsoft Graph"** > **"Delegated permissions"**.
4. Agrega los siguientes permisos:
   - ✅ `email`
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `User.Read`
   - ✅ `User.ReadBasic.All`
5. **Haz clic en "Grant admin consent for Default Directory"** para aprobar los permisos.

---

### **1.4 Configurar Tokens Opcionales para Forzar el Email**
1. Ve a **"Token configuration"**.
2. Haz clic en **"Add optional claim"**.
3. Selecciona **"ID"** y marca:
   - ✅ `email`
   - ✅ `upn`
   - ✅ `preferred_username`
4. Guarda los cambios.

---

## **2️⃣ Configuración de Microsoft como Proveedor en Supabase**
1. **Accede a Supabase** y abre tu proyecto.
2. Ve a **"Authentication" > "Providers"**.
3. Selecciona **"Microsoft"**.
4. Ingresa los siguientes valores:
   - **Client ID**:  
     Copia el valor desde **Azure Portal**.
   - **Client Secret**:  
     Usa el secreto generado en **Certificates & secrets**.
   - **Callback URL**:  
     ```
     https://ntpxufobtaodzapohxud.supabase.co/auth/v1/callback
     ```
   - **Azure Tenant URL** (Opcional, si usas un tenant específico):
     ```
     https://login.microsoftonline.com/{TENANT_ID}
     ```
   - **Scopes adicionales**:
     ```
     openid profile email User.ReadBasic.All
     ```
5. **Guarda los cambios**.

---

## **3️⃣ Configuración en la Aplicación Vue.js**
### **3.1 Instalar Supabase en Vue**
Si aún no tienes Supabase instalado en Vue, ejecútalo con:

```sh
npm install @supabase/supabase-js
