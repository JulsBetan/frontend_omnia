o# 📌 Configuración de Autenticación con Google en Supabase

Este documento describe el proceso completo para configurar la autenticación con **Google OAuth 2.0** en **Supabase** y su integración en una aplicación Vue.js.

---

## **1️⃣ Creación y Configuración del Proyecto en Google Cloud**
Para habilitar la autenticación con Google, primero necesitas **registrar tu aplicación en Google Cloud Console**.

### **1.1 Crear un Proyecto en Google Cloud**
1. Accede a **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Si no tienes un proyecto, haz clic en **"Seleccionar un proyecto" > "Nuevo Proyecto"**.
3. **Asigna un nombre al proyecto** y haz clic en **"Crear"**.
4. Una vez creado, selecciona el proyecto.

---

### **1.2 Habilitar Google OAuth 2.0**
1. Ve al menú **"API y servicios" > "Credenciales"**.
2. Haz clic en **"Crear credenciales"** > **"ID de cliente de OAuth"**.
3. **Selecciona "Tipo de aplicación: Aplicación web".**
4. **Configura las URI de redirección**:
   - **URI autorizadas de redirección**:
     ```
     https://ntpxufobtaodzapohxud.supabase.co/auth/v1/callback
     ```
   - **URI autorizadas de JavaScript**:
     ```
     http://localhost:5173
     https://julbetan.dev
     ```
5. **Haz clic en "Crear"** y copia los valores:
   - **Client ID**
   - **Client Secret**

---

## **2️⃣ Configuración de Google como Proveedor en Supabase**
1. **Accede a Supabase** y abre tu proyecto.
2. Ve a **"Authentication" > "Providers"**.
3. Selecciona **"Google"**.
4. Ingresa los siguientes valores:
   - **Client ID**:  
     Copia el valor desde **Google Cloud Console**.
   - **Client Secret**:  
     Usa el secreto generado en **Google Cloud Console**.
   - **Callback URL**:  
     ```
     https://ntpxufobtaodzapohxud.supabase.co/auth/v1/callback
     ```
5. **Guarda los cambios**.

---

## **3️⃣ Configuración en la Aplicación Vue.js**
### **3.1 Instalar Supabase en Vue**
Si aún no tienes Supabase instalado en Vue, ejecútalo con:

```sh
npm install @supabase/supabase-js
