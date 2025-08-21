# Director Value - Plan Feature Matrix

## 📋 **Plan Overview**

| Plan | Price | Trial | Features | Target Users |
|------|-------|-------|----------|--------------|
| **FREE_TRIAL** | €0.00 | 30 days | Basic listing + trial access | New users evaluating service |
| **BASIC** | €5.99/mo | ✅ | Single business + limited dashboard | Small businesses, freelancers |
| **PRO** | €12.99/mo | ✅ | Basic + Analytics + enhanced features | Growing businesses |
| **VIP** | €19.99/mo | ✅ | Pro + Leads + multiple businesses + priority | Established businesses, agencies |

---

## 🎯 **Feature Access Matrix**

### **Dashboard Access**
| Feature | FREE_TRIAL | BASIC | PRO | VIP | ADMIN |
|---------|------------|-------|-----|-----|-------|
| Dashboard Overview | ✅ Limited | ✅ Limited | ✅ Full | ✅ Full | ✅ System |
| Business Management | ✅ Single | ✅ Single | ✅ Single | ✅ Multiple | ✅ All |
| Analytics Dashboard | ❌ | ❌ | ✅ | ✅ | ✅ |
| Lead Management | ❌ | ❌ | ❌ | ✅ | ✅ |
| Billing Management | ✅ | ✅ | ✅ | ✅ | ✅ |
| Review Management | ✅ | ✅ | ✅ | ✅ | ✅ |

### **Business Listing Features**
| Feature | FREE_TRIAL | BASIC | PRO | VIP |
|---------|------------|-------|-----|-----|
| Business Name | ✅ | ✅ | ✅ | ✅ |
| Address & Contact | ✅ | ✅ | ✅ | ✅ |
| Phone & Email | ✅ | ✅ | ✅ | ✅ |
| Business Description | ✅ | ✅ | ✅ | ✅ |
| Services/Products List | ❌ | ❌ | ✅ | ✅ |
| Logo Upload | ❌ | ❌ | ✅ | ✅ |
| Google Maps Integration | ❌ | ❌ | ✅ | ✅ |
| Working Hours | ❌ | ❌ | ✅ | ✅ |
| Hide Email (Contact Form) | ❌ | ❌ | ❌ | ✅ |
| Priority Placement | ❌ | ❌ | ❌ | ✅ |

### **Customer Interaction**
| Feature | FREE_TRIAL | BASIC | PRO | VIP |
|---------|------------|-------|-----|-----|
| Customer Reviews | ✅ | ✅ | ✅ | ✅ |
| Review Responses | ✅ | ✅ | ✅ | ✅ |
| Direct Email Contact | ✅ | ✅ | ✅ | ❌ (Form only) |
| Contact Form Relay | ❌ | ❌ | ❌ | ✅ |
| Lead Tracking | ❌ | ❌ | ❌ | ✅ |
| Lead Analytics | ❌ | ❌ | ❌ | ✅ |

### **Analytics & Insights**
| Feature | FREE_TRIAL | BASIC | PRO | VIP |
|---------|------------|-------|-----|-----|
| Basic Statistics | ✅ Limited | ✅ Limited | ✅ | ✅ |
| Detailed Analytics | ❌ | ❌ | ✅ | ✅ |
| Performance Metrics | ❌ | ❌ | ✅ | ✅ |
| Growth Tracking | ❌ | ❌ | ✅ | ✅ |
| Export Data | ❌ | ❌ | ✅ | ✅ |

---

## 🚀 **User Journey by Plan**

### **FREE_TRIAL (30 Days)**
1. **Sign up** → Create account
2. **Create business** → Basic listing only
3. **Limited access** → Try features for 30 days
4. **Auto-deactivate** → Must upgrade to continue

**Upgrade Prompts:** Continuous encouragement to upgrade with feature previews

### **BASIC (€5.99/mo)**
1. **Single business** → One listing maximum
2. **Basic features** → Name, address, phone, email
3. **Limited dashboard** → Review management + billing
4. **Search visibility** → Standard placement

**Upgrade Path:** Analytics preview + multiple business hints

### **PRO (€12.99/mo)**
1. **Enhanced listing** → Services, logo, maps, hours
2. **Analytics access** → Performance insights
3. **Better visibility** → Enhanced search features
4. **Growth tools** → Performance tracking

**Upgrade Path:** Lead management + multiple business access

### **VIP (€19.99/mo)**
1. **Multiple businesses** → Unlimited listings
2. **Lead management** → Customer inquiry tracking
3. **Priority placement** → Top search results
4. **Privacy features** → Contact form relay
5. **Full analytics** → Complete insights package

---

## 🔐 **Access Control Implementation**

### **Route Protection**
```typescript
// VIP-only features
/dashboard/leads → RequireVipPlan
/dashboard/businesses/new → RequireVipPlan (if existing business)

// PRO+ features  
/dashboard/analytics → RequireProPlan

// Business owner features
/dashboard/billing → RequireBusinessOwner
/dashboard/businesses → RequireBusinessOwner
```

### **Navigation Filtering**
- **Dynamic menu** based on user role and plan
- **Upgrade prompts** for restricted features
- **Feature previews** to encourage upgrades

### **Database Restrictions**
- **Business count limits** enforced at creation
- **Feature access** checked server-side
- **Plan verification** on all protected actions

---

## 💰 **Revenue Model**

### **Monthly Recurring Revenue**
- **Basic:** €5.99 × subscribers
- **Pro:** €12.99 × subscribers  
- **VIP:** €19.99 × subscribers

### **Upgrade Conversion Strategy**
1. **Free Trial** → Show limited features, encourage upgrade
2. **Basic** → Highlight analytics and multiple business benefits
3. **Pro** → Promote lead management and priority placement

### **Key Metrics**
- **Trial conversion rate** (FREE_TRIAL → Paid)
- **Plan upgrade rate** (Basic → Pro → VIP)
- **Customer lifetime value** by plan
- **Feature utilization** per plan level

---

## 🎨 **UI/UX Considerations**

### **Dashboard Experience**
- **Plan-aware navigation** shows available features
- **Upgrade CTAs** strategically placed for restricted features
- **Feature previews** demonstrate higher-tier value

### **Billing Integration**
- **Stripe subscriptions** handle plan changes
- **Prorated billing** for mid-cycle upgrades
- **Trial management** with automatic deactivation

### **Admin Tools**
- **Plan verification** for customer support
- **Usage monitoring** per plan level
- **Revenue tracking** by subscription tier

---

This feature matrix ensures clear value proposition for each plan tier while providing logical upgrade paths for revenue growth.
