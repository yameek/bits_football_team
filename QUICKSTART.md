# 🚀 Quick Start Guide
## BITS Football Team Treasury Management System

Get the application running in under 5 minutes!

---

## Prerequisites

Make sure you have these installed:
- ✅ **Node.js** 18+ ([Download](https://nodejs.org/))
- ✅ **Docker & Docker Compose** ([Download](https://www.docker.com/))
- ✅ **npm** (comes with Node.js)

---

## 🎯 Start in 3 Steps

### Step 1: Start the Database (30 seconds)

```bash
cd backend
docker compose up -d
```

✅ PostgreSQL will be running on `localhost:5432`

---

### Step 2: Start the Backend (1 minute)

```bash
# In the backend directory
npm install  # First time only
npm run start:dev
```

✅ Backend API will be running on `http://localhost:3000`  
✅ Swagger docs available at `http://localhost:3000/api`

---

### Step 3: Start the Frontend (1 minute)

```bash
# In a new terminal
cd frontend
npm install  # First time only
npm run dev
```

✅ Frontend app will be running on `http://localhost:3001`

---

## 🎉 You're Done!

Open your browser and go to:
### 👉 **http://localhost:3001**

---

## 📝 First Time Setup

### Create Your First Field

1. Click **Settings** → **Fields**
2. Click **Add Field**
3. Enter:
   - Name: "Central Stadium"
   - Location: "Dhaka, Bangladesh"
   - Default Cost: 600
4. Click **Add Field**

### Create Your First Member

1. Click **Members** → **Add Member**
2. Enter:
   - Name: "John Doe"
   - PIN: 1234
   - Initial Balance: 1000
3. Click **Create Member**

### Create Your First Session

1. Click **Sessions** → **New Session**
2. Select:
   - Field: Central Stadium
   - Date: Today
   - Time: 18:00 - 20:00
3. Click **Create Session**

---

## 🎮 Quick Features Tour

### Dashboard (Home Page)
- View team balance
- See recent alerts
- Check upcoming sessions

### Members Management
- Add/edit/delete members
- Add contributions
- View transaction history
- Check attendance records

### Sessions & Attendance
- Create practice/match sessions
- Mark attendance with PIN lookup
- Add guests
- Update costs
- Finalize session (auto-calculate fees)

### Transactions
- View all transactions
- Create bulk payments
- Filter by type/member/date

### Alerts
- See all active alerts
- Resolve alerts
- Monitor low balances

### Reports
- Team balance overview
- Spending analysis
- Session costs
- Member balances

### Settings
- Manage fields
- Configure thresholds
- System settings

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill any process using port 3000
kill -9 $(lsof -t -i:3000)

# Start again
npm run start:dev
```

### Frontend won't start?
```bash
# Check if port 3001 is available
lsof -i :3001

# Kill any process using port 3001
kill -9 $(lsof -t -i:3001)

# Clear cache and start
rm -rf .next
npm run dev
```

### Database connection error?
```bash
# Check if Docker is running
docker ps

# Restart database
cd backend
docker compose down
docker compose up -d

# Wait 10 seconds then restart backend
npm run start:dev
```

---

## 📱 Mobile Testing

1. Find your local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update frontend `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://YOUR_IP:3000
   ```

3. Access from phone:
   ```
   http://YOUR_IP:3001
   ```

---

## 🎯 Key Workflows

### Workflow 1: Create and Finalize a Session

1. **Create Session** → Sessions → New Session
2. **Mark Attendance** → Open session → Attendance → Add members
3. **Add Guests** (optional) → Add Guest button
4. **Update Costs** → Update Costs → Fill all fields
5. **Finalize** → Finalize Session → Confirm

✅ Fees automatically calculated and deducted!

### Workflow 2: Handle Low Balance Alert

1. **View Alert** → Bell icon (top right)
2. **Add Contribution** → Go to member → Add Contribution
3. **Resolve Alert** → Back to alerts → Mark resolved

### Workflow 3: Bulk Payment

1. **Transactions** → Bulk Payment
2. Select payer and beneficiaries
3. Choose equal or custom split
4. Submit

✅ All balances updated automatically!

---

## 📚 Learn More

- **Full Documentation:** See `PROJECT_COMPLETION_SUMMARY.md`
- **Bug Fixes:** See `BUGS_FIXED.md`
- **API Reference:** http://localhost:3000/api
- **Testing Guide:** See `TESTING_GUIDE.md`

---

## 💡 Pro Tips

1. **Use PIN for quick attendance** - No need to search names
2. **Add guests before finalizing** - They affect per-head calculation
3. **Check alerts regularly** - Stay on top of low balances
4. **Use bulk payments** - When one member pays for others
5. **Generate reports** - Before team meetings

---

## 🆘 Need Help?

1. Check the **Swagger docs** for API details
2. Read the **full documentation** in project root
3. Look at **example workflows** in backend/API_WORKFLOWS.md
4. Review **testing guide** in TESTING_GUIDE.md

---

## ✅ Health Check

Verify everything is working:

### Backend Health
```bash
curl http://localhost:3000/members
# Should return: [] or list of members
```

### Frontend Health
- Open http://localhost:3001
- Should see dashboard

### Database Health
```bash
docker ps | grep postgres
# Should show running container
```

---

## 🎉 You're All Set!

Start managing your football team's treasury like a pro! ⚽

**Happy Managing!** 🏆

---

**Last Updated:** November 9, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
