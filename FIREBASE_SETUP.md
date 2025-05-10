# Firebase Setup Instructions

## Fixing "Missing or insufficient permissions" Error

If you're encountering a "FirebaseError: Missing or insufficient permissions" error when accessing the Account page after Google login, follow these steps to fix it:

## 1. Deploy Firestore Security Rules

The error occurs because Firebase Firestore has strict default security rules that prevent reading/writing data even for authenticated users.

You need to deploy the security rules in `firestore.rules` to your Firebase project:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to your Firebase account
firebase login

# Initialize Firebase in your project (if not already done)
firebase init

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

## 2. Check Firebase Console

Alternatively, you can manually update your security rules in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database in the left sidebar
4. Click on the "Rules" tab
5. Copy and paste the content from the `firestore.rules` file in this project
6. Click "Publish"

## 3. Understanding the Security Rules

The security rules in this project allow:

- Authenticated users to read and write their own user document
- Admin users to read and write all documents in the database

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can read and write all documents
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 4. Application Handling

Note that the application has been updated to handle Firebase permission errors gracefully:

- The Account page will show basic user information even if Firestore access fails
- Authentication features continue to work even with limited database access
- Error messages are displayed with clear explanations 