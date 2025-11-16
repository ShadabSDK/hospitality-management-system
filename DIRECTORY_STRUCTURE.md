# Project Directory Structure

## Complete Directory Tree

```
hospitality-management-system/
│
├── 📁 src/                              # All source code
│   │
│   ├── 📁 backend/                      # Node.js Backend API
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/               # Configuration files
│   │   │   ├── database.js              # MongoDB connection
│   │   │   ├── redis.js                 # Redis connection
│   │   │   ├── aws.js                   # AWS S3 configuration
│   │   │   ├── stripe.js                # Stripe configuration
│   │   │   └── index.js                 # Config exports
│   │   │
│   │   ├── 📁 controllers/              # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── tenant.controller.js
│   │   │   ├── restaurant.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── dish.controller.js
│   │   │   ├── qrcode.controller.js
│   │   │   ├── upload.controller.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── billing.controller.js
│   │   │   └── menu.controller.js
│   │   │
│   │   ├── 📁 services/                 # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── tenant.service.js
│   │   │   ├── restaurant.service.js
│   │   │   ├── category.service.js
│   │   │   ├── dish.service.js
│   │   │   ├── qrcode.service.js
│   │   │   ├── upload.service.js
│   │   │   ├── analytics.service.js
│   │   │   ├── billing.service.js
│   │   │   └── menu.service.js
│   │   │
│   │   ├── 📁 models/                   # Mongoose schemas
│   │   │   ├── Tenant.js
│   │   │   ├── AdminUser.js
│   │   │   ├── Restaurant.js
│   │   │   ├── Category.js
│   │   │   ├── Dish.js
│   │   │   ├── QRCode.js
│   │   │   └── Analytics.js
│   │   │
│   │   ├── 📁 repositories/             # Data access layer
│   │   │   ├── tenant.repository.js
│   │   │   ├── user.repository.js
│   │   │   ├── restaurant.repository.js
│   │   │   ├── category.repository.js
│   │   │   ├── dish.repository.js
│   │   │   ├── qrcode.repository.js
│   │   │   └── analytics.repository.js
│   │   │
│   │   ├── 📁 middlewares/              # Express middlewares
│   │   │   ├── auth.middleware.js       # JWT authentication
│   │   │   ├── tenant.middleware.js     # Tenant isolation
│   │   │   ├── validation.middleware.js # Input validation
│   │   │   ├── rateLimit.middleware.js  # Rate limiting
│   │   │   ├── errorHandler.middleware.js
│   │   │   └── featureFlag.middleware.js # Plan-based features
│   │   │
│   │   ├── 📁 routes/                   # API routes
│   │   │   ├── index.js                 # Route aggregator
│   │   │   ├── auth.routes.js
│   │   │   ├── restaurant.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── dish.routes.js
│   │   │   ├── qrcode.routes.js
│   │   │   ├── upload.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── billing.routes.js
│   │   │   └── menu.routes.js           # Public menu routes
│   │   │
│   │   ├── 📁 utils/                    # Utility functions
│   │   │   ├── logger.js                # Winston/Pino logger
│   │   │   ├── errors.js                # Custom error classes
│   │   │   ├── validators.js            # Validation helpers
│   │   │   ├── jwt.js                   # JWT utilities
│   │   │   ├── constants.js             # App constants
│   │   │   ├── cache.js                 # Redis cache helpers
│   │   │   └── helpers.js               # General helpers
│   │   │
│   │   ├── 📁 views/                    # EJS templates
│   │   │   ├── menu.ejs                 # Menu HTML template
│   │   │   └── partials/                # Partial templates
│   │   │       ├── header.ejs
│   │   │       └── footer.ejs
│   │   │
│   │   └── app.js                       # Express app setup
│   │
│   ├── 📁 tests/                        # Test files
│   │   ├── 📁 unit/
│   │   ├── 📁 integration/
│   │   └── 📁 e2e/
│   │
│   │   ├── .env.example                     # Environment variables template
│   │   ├── .env                             # Environment variables (gitignored)
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   └── server.js                        # Application entry point
│   │
│   └── 📁 frontend/                         # Flutter Admin App
│       ├── 📁 lib/
│       │   ├── 📁 screens/                  # UI screens
│       │   │   ├── 📁 auth/
│       │   │   │   ├── login_screen.dart
│       │   │   │   └── register_screen.dart
│       │   │   │
│       │   │   ├── 📁 dashboard/
│       │   │   │   └── dashboard_screen.dart
│       │   │   │
│       │   │   ├── 📁 restaurant/
│       │   │   │   ├── restaurant_profile_screen.dart
│       │   │   │   └── restaurant_edit_screen.dart
│       │   │   │
│       │   │   ├── 📁 menu/
│       │   │   │   ├── menu_list_screen.dart
│       │   │   │   ├── category_list_screen.dart
│       │   │   │   ├── category_form_screen.dart
│       │   │   │   ├── dish_list_screen.dart
│       │   │   │   └── dish_form_screen.dart
│       │   │   │
│       │   │   ├── 📁 qrcode/
│       │   │   │   └── qrcode_screen.dart
│       │   │   │
│       │   │   ├── 📁 analytics/
│       │   │   │   └── analytics_screen.dart
│       │   │   │
│       │   │   └── 📁 billing/
│       │   │       └── billing_screen.dart
│       │   │
│       │   ├── 📁 widgets/                  # Reusable widgets
│       │   │   ├── custom_button.dart
│       │   │   ├── custom_text_field.dart
│       │   │   ├── dish_card.dart
│       │   │   ├── category_card.dart
│       │   │   ├── qr_code_widget.dart
│       │   │   └── loading_indicator.dart
│       │   │
│       │   ├── 📁 services/                 # API services
│       │   │   ├── api_service.dart         # Base API client
│       │   │   ├── auth_service.dart
│       │   │   ├── restaurant_service.dart
│       │   │   ├── category_service.dart
│       │   │   ├── dish_service.dart
│       │   │   ├── qrcode_service.dart
│       │   │   ├── upload_service.dart
│       │   │   ├── analytics_service.dart
│       │   │   └── billing_service.dart
│       │   │
│       │   ├── 📁 models/                   # Data models
│       │   │   ├── tenant.dart
│       │   │   ├── user.dart
│       │   │   ├── restaurant.dart
│       │   │   ├── category.dart
│       │   │   ├── dish.dart
│       │   │   ├── qrcode.dart
│       │   │   └── analytics.dart
│       │   │
│       │   ├── 📁 providers/                # State management
│       │   │   ├── auth_provider.dart
│       │   │   ├── restaurant_provider.dart
│       │   │   ├── menu_provider.dart
│       │   │   └── theme_provider.dart
│       │   │
│       │   ├── 📁 utils/                    # Utilities
│       │   │   ├── constants.dart
│       │   │   ├── validators.dart
│       │   │   ├── storage.dart             # Local storage
│       │   │   └── helpers.dart
│       │   │
│       │   └── main.dart                    # App entry point
│       │
│       ├── 📁 assets/                       # Images, fonts, etc.
│       │   ├── 📁 images/
│       │   └── 📁 fonts/
│       │
│       ├── 📁 ios/                          # iOS platform-specific
│       │   ├── 📁 Runner/
│       │   │   ├── AppDelegate.swift
│       │   │   ├── Info.plist
│       │   │   └── Assets.xcassets/
│       │   ├── Podfile                      # CocoaPods dependencies
│       │   └── Runner.xcodeproj/
│       │
│       ├── 📁 android/                      # Android platform-specific
│       │   ├── 📁 app/
│       │   │   ├── 📁 src/
│       │   │   │   └── 📁 main/
│       │   │   │       ├── 📁 kotlin/       # Kotlin native code
│       │   │   │       ├── 📁 java/          # Java native code (if needed)
│       │   │   │       └── AndroidManifest.xml
│       │   │   └── build.gradle
│       │   ├── build.gradle
│       │   └── gradle.properties
│       │
│       ├── 📁 web/                          # Web platform-specific
│       │   ├── index.html                  # Web entry point
│       │   ├── manifest.json               # PWA manifest
│       │   └── 📁 icons/                    # Web app icons
│       │
│       ├── 📁 test/                         # Flutter tests
│       │   ├── 📁 unit/
│       │   ├── 📁 widget/
│       │   └── 📁 integration/
│       │
│       ├── .gitignore
│       ├── .metadata                       # Flutter metadata
│       ├── analysis_options.yaml           # Dart analyzer config
│       ├── pubspec.yaml                    # Flutter dependencies
│       └── README.md
│
├── 📁 docs/                            # Additional documentation
│   ├── API.md                           # API documentation
│   ├── DEPLOYMENT.md                    # Deployment guide
│   └── CONTRIBUTING.md
│
├── 📁 scripts/                         # Utility scripts
│   ├── setup.sh                        # Setup script
│   ├── seed.js                         # Database seeding
│   └── migrate.js                      # Database migrations
│
├── 📁 docker/                          # Docker configurations
│   ├── Dockerfile                      # Backend Dockerfile
│   ├── docker-compose.yml              # Local development
│   └── docker-compose.prod.yml         # Production
│
├── .gitignore
├── .env.example
├── LICENSE
├── README.md
├── ARCHITECTURE.md
├── MVP_DECISIONS.md
└── package.json                         # Root package.json (optional)
```

---

## Directory Structure Details

### Root Level Organization

- **`src/`** - All source code (backend and frontend)
- **`docs/`** - Additional documentation
- **`scripts/`** - Utility scripts
- **`docker/`** - Docker configurations
- **Root files** - Documentation, configs, licenses

### Backend Structure (`src/backend/`)

#### `src/backend/src/config/`
- Database connections (MongoDB, Redis)
- AWS S3 configuration
- Stripe API configuration
- Environment-based settings

#### `src/backend/src/controllers/`
- Thin controllers that handle HTTP requests/responses
- Input validation
- Call services and return responses

#### `src/backend/src/services/`
- Business logic layer
- Orchestration of operations
- Integration with external services

#### `src/backend/src/models/`
- Mongoose schemas
- Data validation rules
- Model relationships

#### `src/backend/src/repositories/`
- Database query abstraction
- CRUD operations
- Complex queries

#### `src/backend/src/middlewares/`
- Authentication (JWT)
- Tenant isolation enforcement
- Rate limiting
- Error handling
- Feature flag checks

#### `src/backend/src/routes/`
- API endpoint definitions
- Route handlers mapping
- Versioning (`/api/v1/...`)

#### `src/backend/src/utils/`
- Logger configuration
- Custom error classes
- Validation helpers
- JWT utilities
- Cache helpers

#### `src/backend/src/views/`
- EJS templates for menu rendering
- HTML templates for public menu pages

---

### Frontend Structure (`src/frontend/`)

**Multi-Platform Support:**
- ✅ **iOS** - Native iOS app
- ✅ **Android** - Native Android app
- ✅ **Web** - Progressive Web App (PWA)

#### `src/frontend/lib/` - Shared Dart Code
All Dart code in `lib/` is **platform-agnostic** and works on iOS, Android, and Web.

#### `src/frontend/lib/screens/`
- Flutter screens organized by feature
- Auth, Dashboard, Restaurant, Menu, QR Code, Analytics, Billing
- **Platform-agnostic** - Same code for all platforms

#### `src/frontend/lib/widgets/`
- Reusable UI components
- Custom buttons, text fields, cards
- **Responsive** - Adapts to iOS, Android, and Web

#### `src/frontend/lib/services/`
- API communication layer
- HTTP client setup
- Service classes for each domain
- **Cross-platform** - Works on all platforms

#### `src/frontend/lib/models/`
- Dart data models
- JSON serialization
- Model classes matching backend schemas
- **Shared** - Same models across platforms

#### `src/frontend/lib/providers/`
- State management (Provider/Riverpod)
- App-wide state
- Business logic for UI
- **Universal** - Same state management for all platforms

#### `src/frontend/lib/utils/`
- Constants, validators
- Local storage helpers (platform-specific implementation)
- Utility functions
- **Adaptive** - Uses platform-specific APIs when needed

#### Platform-Specific Folders

##### `src/frontend/ios/`
- iOS native configuration
- Xcode project files
- Info.plist (permissions, app settings)
- Podfile (iOS dependencies)
- Native iOS code if needed

##### `src/frontend/android/`
- Android native configuration
- Gradle build files
- AndroidManifest.xml (permissions, app settings)
- Kotlin/Java native code if needed
- App signing configuration

##### `src/frontend/web/`
- Web-specific files
- index.html (web entry point)
- manifest.json (PWA configuration)
- Web app icons
- Service worker (for offline support)

##### `src/frontend/assets/`
- Images, fonts, icons
- **Shared** across all platforms
- Platform-specific assets can be organized by platform if needed

---

### Root Level Organization

**Root folder is kept clean for:**
- **Documentation**: `README.md`, `ARCHITECTURE.md`, `MVP_DECISIONS.md`, `DIRECTORY_STRUCTURE.md`
- **Configuration files**: `.env.example`, `.gitignore`, `LICENSE`
- **Docker**: Dockerfiles and docker-compose files in `docker/`
- **Scripts**: Setup, seeding, migration scripts in `scripts/`
- **Documentation**: Additional docs in `docs/`

**All source code is organized under `src/`:**
- `src/backend/` - Node.js backend API
- `src/frontend/` - Flutter admin app

---

## File Count Summary

- **Backend**: ~50+ files
- **Frontend**: ~40+ files
- **Documentation**: 5+ files
- **Configuration**: 10+ files

**Total**: ~100+ files for complete MVP structure

---

## Multi-Platform Development Notes

### Flutter Platform Support

Flutter provides **write once, run everywhere** capability:

1. **Shared Code (95%+)**: All business logic, UI, and services in `lib/` work on all platforms
2. **Platform-Specific (5%)**: Only native configurations and platform-specific features need separate code

### Platform-Specific Considerations

#### iOS
- **Permissions**: Camera (QR scanning), Photo Library (image uploads) in `Info.plist`
- **App Store**: Requires Apple Developer account for distribution
- **Native Features**: Can use platform channels for iOS-specific features

#### Android
- **Permissions**: Camera, Storage in `AndroidManifest.xml`
- **Play Store**: Requires Google Play Developer account
- **Min SDK**: Android 5.0 (API 21) minimum
- **Native Features**: Can use platform channels for Android-specific features

#### Web
- **PWA Support**: Can be installed as Progressive Web App
- **Service Worker**: For offline functionality
- **Responsive Design**: Adapts to different screen sizes
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Platform Detection in Code

```dart
// Example: Platform-specific code when needed
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

if (kIsWeb) {
  // Web-specific code
} else if (Platform.isIOS) {
  // iOS-specific code
} else if (Platform.isAndroid) {
  // Android-specific code
}
```

### Building for Different Platforms

```bash
# Build for iOS
flutter build ios

# Build for Android
flutter build apk          # APK file
flutter build appbundle    # AAB for Play Store

# Build for Web
flutter build web
```

### Testing Across Platforms

- **Unit Tests**: Test business logic (platform-agnostic)
- **Widget Tests**: Test UI components (platform-agnostic)
- **Integration Tests**: Test on real devices/emulators for each platform

---

## Next Steps

Once you approve this structure, I will:
1. Create all directories
2. Add placeholder files with basic structure
3. Add configuration files (`.env.example`, `package.json`, `pubspec.yaml`, etc.)
4. Set up initial code scaffolding
5. Add platform-specific configuration templates

Ready to proceed? 🚀

