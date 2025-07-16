# Render Exact Commands - Gunicorn Fix

## 🚨 **IMMEDIATE FIX - Use These Exact Commands**

### **Build Command:**
```bash
pip install -r requirements.txt
```

### **Start Command (Choose ONE):**

**Option 1 (Recommended):**
```bash
python -m gunicorn main:app --bind 0.0.0.0:$PORT
```

**Option 2 (Alternative):**
```bash
python -m gunicorn main:app --bind 0.0.0.0:$PORT --workers 2
```

**Option 3 (If above don't work):**
```bash
/usr/local/bin/python -m gunicorn main:app --bind 0.0.0.0:$PORT
```

## 📋 **Step-by-Step Instructions**

### **1. Go to Your Render Backend Service**
- Visit [render.com](https://render.com)
- Click on your backend service

### **2. Update Build Command**
- Go to **"Settings"** tab
- Find **"Build Command"**
- Replace with: `pip install -r requirements.txt`

### **3. Update Start Command**
- Find **"Start Command"**
- Replace with: `python -m gunicorn main:app --bind 0.0.0.0:$PORT`

### **4. Save and Deploy**
- Click **"Save Changes"**
- Go to **"Manual Deploy"**
- Click **"Deploy latest commit"**

## 🔧 **Why This Works**

- `python -m gunicorn` uses Python's module system instead of direct command
- This bypasses PATH issues that cause "command not found"
- Works even if gunicorn isn't in system PATH

## ✅ **Expected Results**

After deployment, you should see:
- ✅ Build logs: "Successfully installed gunicorn-21.2.0"
- ✅ Start logs: "Starting gunicorn 21.2.0"
- ✅ No "command not found" errors
- ✅ Server running on port

## 🚨 **If Still Getting Error**

Try this alternative start command:
```bash
cd app/backend && python -m gunicorn main:app --bind 0.0.0.0:$PORT
```

This explicitly changes to the backend directory first. 