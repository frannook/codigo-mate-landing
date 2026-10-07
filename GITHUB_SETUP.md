# Cómo Subir el Proyecto a GitHub

El proyecto está listo para clonar y trabajar en equipo. Sigue estos pasos **desde tu máquina local**:

## 1️⃣ Crear el Repositorio en GitHub

1. Abre https://github.com/new
2. **Nombre del repo:** `codigo-mate-landing`
3. **Descripción:** "AI chatbot landing page with Next.js, Gemini API, and booking system"
4. **Visibilidad:** Public (para que tus compañeros puedan acceder)
5. **NO inicialices con README** (ya lo tenemos)
6. Click **"Create repository"**

Verás una pantalla con instrucciones. Copia la URL del repo (será algo como `https://github.com/frannook/codigo-mate-landing.git`)

---

## 2️⃣ Pushear desde Local

En tu terminal local, en la carpeta donde descargaste/clonaste el proyecto:

```bash
# Agregar el remoto (reemplaza con tu URL)
git remote add origin https://github.com/frannook/codigo-mate-landing.git

# Cambiar rama default a main (si está en master)
git branch -M main

# Pushear todo el código
git push -u origin main
```

**Esperado:** Los commits y archivos aparecerán en GitHub en 10-30 segundos.

---

## 3️⃣ Compartir con Compañeros

1. En GitHub, ve a **Settings** → **Collaborators** (o Invite collaborators)
2. Busca por username de GitHub de cada compañero
3. Dale permisos **"Write"** (para que puedan hacer push)

O simplemente comparte el link del repo: `https://github.com/frannook/codigo-mate-landing`

---

## 4️⃣ Clonar en Otra Máquina (o Compañeros)

```bash
git clone https://github.com/frannook/codigo-mate-landing
cd codigo-mate-landing

# Install
npm install

# Setup env (crear .env.local, NO subir a git)
cp .env.example .env.local
# Editar con tus claves...

# Dev
npm run dev
```

---

## ✅ Verificar Checklist

- [ ] Repositorio creado en GitHub
- [ ] `git push -u origin main` ejecutado exitosamente
- [ ] Todos los archivos aparecen en GitHub
- [ ] `.env.local` NO aparece en el repo (debe estar en `.gitignore`)
- [ ] Compañeros tienen acceso (compartiste el link o invitaste)
- [ ] Clonaste desde GitHub localmente y funciona (`npm run dev`)

---

## 🔑 Variables de Entorno (en cada máquina)

**NO subas `.env.local` a GitHub.** Cada desarrollador debe crear el suyo:

```bash
# .env.local (copiar de .env.example y llenar)
GEMINI_API_KEY=tu_key_aqui
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
```

Si necesitas compartir keys entre el equipo, usa:
- **Vercel Environment Variables** (si deployás ahí)
- **1Password / Bitwarden** (compartida en el equipo)
- **Notion / Documento privado** (temporal, luego migrar a vault)

---

## 🚀 Workflow de Equipo

Todos los desarrolladores:

```bash
# Crear rama nueva
git checkout -b feature/tu-feature

# Haz cambios, commits
git add .
git commit -m "descripción clara"

# Pushear
git push -u origin feature/tu-feature

# En GitHub: crea Pull Request
# Compañeros reviewean
# Merge a main
```

**Regla:** Nunca pushear directo a `main`. Siempre via Pull Request.

---

**¡Listo para trabajar en equipo! 🎉**
