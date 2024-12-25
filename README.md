# ItsSandhyaTime
An app to celebrate the divine significance of the "Sandhya times". Sandhya is a time for deep contemplation that can uplift our health, intellect and spirits.
ItsSandhyaTime.in

## Initial Setup
Here are the streamlined steps to deploy to the Firebase development environment:

1. **npm install**
```bash
npm install
```

2. **local dev**
```bash
npm run dev
```


## How to deploy app to Firebase

Here are the streamlined steps to deploy to the Firebase development environment:

1. **Install Firebase CLI globally**
```bash
npm install -g firebase-tools
```


2. **Login to Firebase**
firebase login


This will open a browser window to authenticate with your Google account.


3. **Get Firebase Project Access**

- Ask the project admin (you) to add them to the Firebase project with appropriate permissions

- This is done through the Firebase Console → Project Settings → Users and Permissions

4. **Set Target for Development**
firebase target:apply hosting dev its-sandhya-time-dev


5. **Build and Deploy**
```bash
npm run deploy:dev
```

Check the app on https://its-sandhya-time-dev.web.app
