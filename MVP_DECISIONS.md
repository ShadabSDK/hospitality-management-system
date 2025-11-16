# MVP Implementation Decisions

## Confirmed Requirements

### 1. QR Codes
- **Decision:** One QR code per restaurant
- **Implementation:** 
  - QR code generated once per restaurant
  - URL format: `https://domain.com/menu/<slug>`
  - Stored in `qrCodes` collection with `restaurantId`

### 2. Dish-Category Relationship
- **Decision:** One dish belongs to one category (many-to-one)
- **Schema:** `Dish.categoryId` (single ObjectId reference)

---

## Recommended MVP Solutions

### 1. Billing Plans Structure

#### Plan Tiers
```javascript
{
  'trial': {
    name: 'Free Trial',
    duration: 14, // days
    price: 0,
    features: ['all'] // All features during trial
  },
  'basic': {
    name: 'Basic',
    price: 9.99, // per month
    features: [
      'menu_management',
      'qr_codes',
      'basic_analytics',
      'image_uploads'
    ]
  },
  'premium': {
    name: 'Premium',
    price: 29.99, // per month
    features: [
      'menu_management',
      'qr_codes',
      'advanced_analytics',
      'image_uploads',
      'data_export',
      'priority_support'
    ]
  }
}
```

#### Implementation
- Store `plan` field in `Tenant` model
- Feature flag middleware checks plan before allowing access
- Stripe integration for subscription management
- Trial automatically converts to 'basic' after 14 days (or on payment)

---

### 2. Analytics Approach

#### MVP Strategy: Simple Event Logging
- **Storage:** MongoDB `analytics` collection
- **Real-time:** No (aggregated on-demand)
- **Retention:** Last 30 days (configurable)

#### Schema
```javascript
{
  _id: ObjectId,
  tenantId: ObjectId (indexed),
  restaurantId: ObjectId (indexed),
  eventType: String, // 'menu_view', 'qr_scan', 'dish_click'
  metadata: {
    dishId: ObjectId,      // if dish_click
    categoryId: ObjectId, // if dish_click
    userAgent: String,    // browser info
    ipAddress: String     // for location (optional)
  },
  createdAt: Date (indexed)
}
```

#### Aggregation Queries
```javascript
// Get analytics for last 30 days
db.analytics.aggregate([
  { $match: { 
    tenantId: tenantId, 
    createdAt: { $gte: last30Days } 
  }},
  { $group: {
    _id: '$eventType',
    count: { $sum: 1 }
  }}
])

// Top dishes
db.analytics.aggregate([
  { $match: { eventType: 'dish_click', tenantId: tenantId }},
  { $group: {
    _id: '$metadata.dishId',
    clicks: { $sum: 1 }
  }},
  { $sort: { clicks: -1 }},
  { $limit: 10 }
])
```

#### Future Enhancement
- Move to time-series database (InfluxDB) if scale requires
- Real-time dashboard with WebSockets
- Advanced metrics (conversion rates, peak times)

---

### 3. Image Upload Solution

#### Recommended: Presigned URLs (S3 Direct Upload)

**Why:**
- ✅ Standard industry practice
- ✅ No server bandwidth usage
- ✅ Faster uploads (direct to S3)
- ✅ Better scalability
- ✅ Lower server costs

#### Flow
```
1. Flutter App → POST /api/upload/presigned-url
   Body: { fileName, fileType, fileSize }

2. Backend → Generate S3 presigned URL
   - Valid for 5 minutes
   - Returns: { presignedUrl, fileUrl }

3. Flutter App → Upload directly to S3
   - Uses presignedUrl
   - Uploads image file

4. Flutter App → POST /restaurants/:id/dishes
   Body: { name, price, categoryId, imageUrl: fileUrl }
```

#### Implementation Details

**Backend Endpoint:**
```javascript
POST /api/upload/presigned-url
Headers: Authorization: Bearer <JWT>
Body: {
  fileName: "pizza.jpg",
  fileType: "image/jpeg",
  fileSize: 2048000
}

Response: {
  presignedUrl: "https://s3.amazonaws.com/bucket/path?signature=...",
  fileUrl: "https://s3.amazonaws.com/bucket/path/pizza.jpg",
  expiresIn: 300 // seconds
}
```

**S3 Configuration:**
- Bucket: `restaurant-menus-images`
- Folder structure: `{tenantId}/{restaurantId}/{dishId}/{fileName}`
- CORS enabled for Flutter app domain
- Public read access (or CloudFront CDN)

**Image Optimization (Future):**
- Resize on upload (multiple sizes: thumbnail, medium, large)
- WebP format conversion
- CDN delivery via CloudFront

#### Alternative (Simpler but Less Scalable)
If presigned URLs are too complex for MVP:
- Flutter → Backend → S3
- Backend handles upload using `multer` + `aws-sdk`
- Works but uses server bandwidth

---

## Summary

| Item | Decision | Complexity |
|------|----------|------------|
| QR Codes | One per restaurant | Simple |
| Dish-Category | One-to-many | Simple |
| Plans | 3 tiers (trial, basic, premium) | Medium |
| Analytics | MongoDB logging, on-demand aggregation | Simple |
| Image Upload | Presigned URLs (S3 direct) | Medium |

---

## Next Steps

1. ✅ Confirm these decisions
2. Implement backend structure
3. Set up MongoDB schemas
4. Implement presigned URL endpoint
5. Build feature flag middleware
6. Create analytics logging service

