# Registration System Implementation

## Overview

This document describes the complete registration system implementation matching the `/mnt/data/registration.png` mockup, including both frontend (React Native) and backend (Java/Spring Boot) components.

## Architecture

### Frontend (React Native + TypeScript)
- **Screen**: `screens/SignUp/index.tsx`
- **Styles**: `screens/SignUp/styles.tsx`
- **API Client**: Direct fetch to `/api/v1/auth/register`
- **Validation**: Client-side using regex patterns
- **Offline Handling**: Online-only, no offline storage

### Backend (Java/Spring Boot)
- **Controller**: `UserController.java` - `/api/v1/user/register` endpoint
- **Service**: `UserService.java` / `UserServiceImpl.java`
- **DTO**: `UserRegistrationDto.java` - Request validation
- **Entity**: `User.java` (common module)
- **Repository**: `UserRepository.java` (common module)

---

## Frontend Implementation

### UI/UX Features (Matching Mockup)

#### Header Section
```
┌─────────────────────────┐
│      Sign Up (Title)    │
│                         │
│    [TripCare Logo]      │
└─────────────────────────┘
```
- Centered "Sign Up" title (28px, bold)
- TripCare arrow logo below title (120x60)

#### Form Fields (All with labels above)

1. **First Name**
   - Label: "First Name"
   - Placeholder: "First Name"
   - Clear icon (X) on right
   - Validation: 2+ chars, letters/spaces/hyphens/apostrophes only

2. **Last Name**
   - Label: "Last Name"
   - Placeholder: "Last Name"
   - Clear icon (X) on right
   - Validation: Same as first name

3. **Email Address**
   - Label: "Email Address"
   - Placeholder: "Email Address"
   - Keyboard: Email type
   - Clear icon (X) on right
   - Validation: Valid email format

4. **Password**
   - Label: "Password"
   - Placeholder: (blank)
   - Secure entry
   - Eye icon on right (toggle show/hide)
   - Validation: Min 8 chars, must contain uppercase, lowercase, and digit

5. **Home City**
   - Label: "Home City"
   - Placeholder: "Home City"
   - Autocomplete dropdown
   - Clear icon (X) when selected
   - Validation: Must select from dropdown list

#### Terms & Policies
```
☑️ I have read and accepted the TripCare Privacy Policy and User Agreement
```
- Checkbox (20x20, rounded corners)
- Clickable links (blue, underlined):
  - "TripCare Privacy Policy" → `https://tripcare.co/privacy-policy`
  - "User Agreement" → `https://tripcare.co/user-agreement`
- Required to enable button

#### Create Account Button
- Full-width, pill-shaped (56px height, 28px border radius)
- Text: "Create an Account"
- Background: Theme blue (`#69b6e6`)
- Disabled state: Grey background when form invalid
- Loading indicator during submission

#### Sign In Link
```
Already have an account? Sign In
```
- Centered below button
- "Sign In" is clickable and blue

### Validation Rules

#### Client-Side Validation
```typescript
// First/Last Name
regex.name = /^[\p{L} \-']{2,}$/u
// Must be 2+ characters
// Only letters, spaces, hyphens, apostrophes

// Email
regex.email = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/
// Standard email format

// Password
regex.password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,50}$/
// Min 10 characters (updated from 8 to match existing pattern)
// At least one uppercase letter
// At least one lowercase letter
// At least one digit
// Allowed special characters

// Home City
// Must have a valid placeId from autocomplete selection
```

#### Error Messages
- Shown below each field after blur
- Red text color
- Examples:
  - "First name must be at least 2 characters"
  - "Only letters, spaces, hyphens, and apostrophes allowed"
  - "Please enter a valid email address"
  - "Password must contain uppercase, lowercase, and digit"
  - "Please select a city from the list"

### Offline Behavior

```typescript
// Check API connectivity before submission
const isApiReachable = useIsApiReachable();

if (isApiReachable === false) {
  setErrorMessage('You must be online to create an account.');
  return;
}
```

**Key Points:**
- Registration is **online-only**
- No form data is stored offline
- Clear error message if offline
- Uses connectivity hook from offline auth system

### API Integration

```typescript
// POST /api/v1/user/register
const response = await fetch(`${API_BASE_URL}/api/v1/user/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Homer',
    lastName: 'Simpson',
    email: 'homer@simpson.com',
    password: 'SecurePass123',
    homeCity: 'ChIJOwg_06VPwokRYv534QaPC8g', // Google Places ID
  }),
});

// Success Response (201 CREATED)
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "homer@simpson.com",
  "name": "Homer Simpson"
}

// Error Response (409 CONFLICT - Email exists)
{
  "code": "EMAIL_EXISTS",
  "message": "Email already registered",
  "timestamp": "2025-11-23T10:30:00Z"
}

// Error Response (400 BAD_REQUEST - Validation error)
{
  "code": "VALIDATION_ERROR",
  "message": "Password must be at least 8 characters",
  "timestamp": "2025-11-23T10:30:00Z"
}
```

### Error Handling

```typescript
// HTTP Status Code Mapping
409 (CONFLICT) → "This email is already registered. Please sign in instead."
400 (BAD_REQUEST) → "Invalid registration data. Please check your inputs."
500+ (SERVER_ERROR) → "Registration failed. Please try again."

// Network Errors
FETCH_ERROR → "You must be online to create an account."
TIMEOUT → "Request timed out. Please check your connection."
```

---

## Backend Implementation

### API Endpoint

```java
@PostMapping("/register")
public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserRegistrationDto dto)
```

**Method**: POST  
**Path**: `/api/v1/user/register`  
**Auth**: Public (no authentication required)  
**Content-Type**: `application/json`

### UserRegistrationDto

```java
public class UserRegistrationDto {
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[\\p{L} \\-']{2,}$")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[\\p{L} \\-']{2,}$")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8)
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])...")
    private String password;
    
    @NotBlank(message = "Home city is required")
    private String homeCity; // Google Places place_id
    
    // Getter to combine names for User entity
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
```

**Key Changes from Old DTO:**
- Split `name` into `firstName` and `lastName`
- Renamed `homeCityId` to `homeCity` (still stores Google Places ID)
- Added `getFullName()` helper method
- Enhanced validation patterns
- Better error messages

### Service Implementation

```java
@Override
public UserDto register(UserRegistrationDto dto) {
    // 1. Validate input (Bean Validation + manual checks)
    if (dto.getFirstName() == null || dto.getFirstName().trim().isEmpty() ||
        dto.getLastName() == null || dto.getLastName().trim().isEmpty() ||
        dto.getEmail() == null || dto.getEmail().trim().isEmpty() ||
        dto.getPassword() == null || dto.getPassword().trim().isEmpty() ||
        dto.getHomeCity() == null || dto.getHomeCity().trim().isEmpty()) {
        throw new IllegalArgumentException("All fields are required");
    }
    
    // 2. Check if user already exists
    if (userRepository.existsByEmail(dto.getEmail())) {
        throw new RuntimeException("User with this email already exists");
    }
    
    // 3. Encrypt password
    String encryptedPassword = passwordEncoder.encode(dto.getPassword());
    
    // 4. Create user entity (combining first + last names)
    User user = User.builder()
            .name(dto.getFullName()) // "Homer Simpson"
            .email(dto.getEmail())
            .password(encryptedPassword)
            .homeCityId(dto.getHomeCity())
            .build();
    
    // 5. Save user
    User savedUser = userRepository.save(user);
    
    // 6. Return DTO
    return new UserDto(
        savedUser.getId(),
        savedUser.getEmail(),
        savedUser.getName()
    );
}
```

### Controller Error Handling

```java
@PostMapping("/register")
public ResponseEntity<UserDto> register(@Valid @RequestBody UserRegistrationDto dto) {
    try {
        UserDto userDto = userService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    } catch (RuntimeException e) {
        // Duplicate email
        if (e.getMessage().contains("already exists")) {
            throw new BusinessException(
                "EMAIL_EXISTS",
                "Email already registered",
                HttpStatus.CONFLICT
            );
        }
        // Other errors
        throw new BusinessException(
            "REGISTRATION_ERROR",
            e.getMessage(),
            HttpStatus.BAD_REQUEST
        );
    }
}
```

### Database Schema

The `User` entity stores the combined full name:

```sql
CREATE TABLE tripcare.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,           -- "Homer Simpson"
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    home_city_id VARCHAR(255) NOT NULL,   -- Google Places place_id
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Note**: The database stores the combined full name, not separate fields. This maintains backward compatibility while the API accepts first and last names separately.

---

## Testing

### Manual Testing Checklist

#### ✅ Frontend UI
- [ ] Title and logo are centered
- [ ] All fields have labels above them
- [ ] Clear icons appear in first/last name, email, and home city
- [ ] Password toggle icon works (eye/eye-slash)
- [ ] Home city autocomplete shows suggestions
- [ ] Terms checkbox toggles correctly
- [ ] Privacy Policy and User Agreement links open URLs
- [ ] Button is disabled when form is invalid
- [ ] Button shows loading indicator during submission

#### ✅ Validation
- [ ] First name requires 2+ characters
- [ ] First name rejects numbers/special chars (except - ' space)
- [ ] Last name has same validation as first name
- [ ] Email validates format
- [ ] Password requires 8+ chars with uppercase, lowercase, digit
- [ ] Home city requires selection from dropdown
- [ ] Terms must be checked to enable button
- [ ] Error messages appear below fields after blur
- [ ] Form-level error appears if submission fails

#### ✅ Online/Offline Behavior
- [ ] With internet: Registration works
- [ ] Without internet: Shows "must be online" message
- [ ] Form data is NOT saved offline
- [ ] City search requires internet

#### ✅ API Integration
- [ ] POST /api/v1/user/register endpoint exists
- [ ] Accepts firstName, lastName, email, password, homeCity
- [ ] Returns 201 CREATED on success
- [ ] Returns 409 CONFLICT for duplicate email
- [ ] Returns 400 BAD_REQUEST for validation errors
- [ ] Passwords are encrypted in database
- [ ] Email is stored lowercase
- [ ] Full name combines first + last correctly

### Test Scenarios

```typescript
// Test 1: Successful Registration
REQUEST: POST /api/v1/user/register
INPUT:
{
  firstName: "Homer",
  lastName: "Simpson",
  email: "homer@simpson.com",
  password: "SecurePass123",
  homeCity: "ChIJOwg_06VPwokRYv534QaPC8g"
}

EXPECTED:
- Status: 201 CREATED
- Response: { id: "...", email: "homer@simpson.com", name: "Homer Simpson" }
- Database: User created with name="Homer Simpson"
- Navigation: SignUpSuccess screen

// Test 2: Duplicate Email
INPUT:
{
  firstName: "Marge",
  lastName: "Simpson",
  email: "homer@simpson.com", // Already exists
  password: "SecurePass123",
  homeCity: "ChIJOwg_06VPwokRYv534QaPC8g"
}

EXPECTED:
- Status: 409 CONFLICT
- Error: "This email is already registered. Please sign in instead."
- UI: Red error banner above button

// Test 3: Invalid Password
INPUT:
{
  firstName: "Bart",
  lastName: "Simpson",
  email: "bart@simpson.com",
  password: "short", // Too short, no uppercase/digit
  homeCity: "ChIJOwg_06VPwokRYv534QaPC8g"
}

EXPECTED:
- Button disabled (client-side validation)
- Error under password field: "Password must contain uppercase, lowercase, and digit"
- No API call made

// Test 4: Offline Attempt
SETUP:
- Turn off internet or stop API

INPUT:
- Fill all fields correctly
- Check terms
- Click "Create an Account"

EXPECTED:
- Error banner: "You must be online to create an account."
- No API call made
- Form data not saved
```

---

## Migration Notes

### Changes from Old System

1. **API Endpoint**:
   - Old: `/api/v1/user/register`
   - New: `/api/v1/auth/register`
   - Reason: Registration is part of auth flow, should be in AuthController

2. **Request Body**:
   - Old: `{ name, email, password, homeCityId }`
   - New: `{ firstName, lastName, email, password, homeCity }`
   - Note: `homeCity` is still the Google Places place_id (not the city name)

3. **DTO Structure**:
   - Split `name` into `firstName` + `lastName`
   - Renamed `homeCityId` to `homeCity` (same value type)
   - Added `getFullName()` helper

4. **User Entity**:
   - No changes - still stores combined `name` field
   - Service layer handles the combination

5. **Frontend Changes**:
   - Complete UI redesign to match mockup
   - Separate first/last name inputs
   - Enhanced validation with inline errors
   - Password visibility toggle
   - Terms checkbox with clickable links
   - Online-only with connectivity check

### Backward Compatibility

The old `/api/v1/user/register` endpoint can remain for backward compatibility during migration:

```java
// Keep old endpoint temporarily (deprecated)
@Deprecated
@PostMapping("/api/v1/user/register")
public ResponseEntity<UserDto> registerLegacy(@RequestBody Map<String, String> request) {
    // Convert old format to new
    UserRegistrationDto dto = new UserRegistrationDto();
    String[] nameParts = request.get("name").split(" ", 2);
    dto.setFirstName(nameParts[0]);
    dto.setLastName(nameParts.length > 1 ? nameParts[1] : "");
    dto.setEmail(request.get("email"));
    dto.setPassword(request.get("password"));
    dto.setHomeCity(request.get("homeCityId"));
    
    return register(dto);
}
```

---

## Security Considerations

1. **Password Storage**: Passwords are encrypted using `BCryptPasswordEncoder` before saving
2. **Email Verification**: `isEmailVerified` flag defaults to `false` (requires email verification flow)
3. **Input Validation**: Both client-side and server-side validation
4. **SQL Injection**: JPA/Hibernate prevents SQL injection
5. **XSS Protection**: React Native doesn't render HTML, no XSS risk
6. **Rate Limiting**: Consider adding rate limiting to prevent abuse
7. **HTTPS Only**: Ensure production uses HTTPS for API calls

---

## Files Modified/Created

### Backend
- ✅ `UserController.java` - Enhanced existing `/register` endpoint with error handling
- ✅ `AuthController.java` - Removed duplicate `/register` endpoint  
- ✅ `UserRegistrationDto.java` - Updated with firstName/lastName
- ✅ `UserServiceImpl.java` - Updated to handle new DTO
- ℹ️ `User.java` (common) - No changes needed
- ℹ️ `UserRepository.java` (common) - No changes needed
- ℹ️ `BusinessException.java` (common) - Already supports error codes

### Frontend
- ✅ `screens/SignUp/index.tsx` - Complete rewrite matching mockup
- ✅ `screens/SignUp/styles.tsx` - Updated styles
- ℹ️ `hooks/useConnectivity.ts` - Already exists (offline auth system)
- ℹ️ `utils/regex.ts` - Already exists (validation patterns)

### Documentation
- ✅ `REGISTRATION_IMPLEMENTATION.md` - This file

---

## Next Steps

1. **Testing**: Run through all test scenarios above
2. **Email Verification**: Implement email verification flow (separate feature)
3. **Analytics**: Add tracking for registration funnel
4. **Error Monitoring**: Add Sentry/logging for registration errors
5. **A/B Testing**: Test different button copy/colors
6. **Accessibility**: Add screen reader labels
7. **Internationalization**: Add translations for all strings

---

## Support

For questions or issues:
- Backend: Check `UserController.java` and `UserServiceImpl.java` logs
- Frontend: Check React Native debugger console for `[SignUp]` logs
- API: Use Postman/Insomnia to test `/api/v1/user/register` directly

