# GitHub Setup Instructions

Follow these steps to set up your GitHub repository and push your code:

1. Go to [GitHub](https://github.com/) and sign in with your account
2. Click the "+" button in the top-right corner and select "New repository"
3. Enter "st-deep-plotting" as the repository name
4. Add a description: "A SillyTavern extension for enhanced storytelling through structured plot management"
5. Select "Public" repository
6. Check "Add a README file" (it will be replaced with our custom one)
7. Choose "MIT License" from the Add a license dropdown
8. Click "Create repository"
9. After creation, go to your local extension directory and run:

```bash
# Set the remote origin to your GitHub repository
# Replace YOUR_GITHUB_USERNAME with your actual GitHub username
git remote add origin https://github.com/ldc861117/st-deep-plotting.git

# Push your code to GitHub
git push -u origin main
```

10. Open your package.json and manifest.json files and update the placeholders with your GitHub username where indicated.
11. Make another commit and push the changes:

```bash
git add package.json manifest.json
git commit -m "Update GitHub username in package and manifest files"
git push
```

Your extension is now ready to be installed from GitHub using SillyTavern's extension system!

## Installing Your Extension in SillyTavern

1. In SillyTavern, go to Extensions -> Install Extensions
2. Enter GitHub repository URL (https://github.com/ldc861117/st-deep-plotting)
3. Click Install
4. Reload the page when prompted

Your Deep Plotting extension should now be installed and ready to use! 

## Updating Your Extension

The extension now has support for updates. Here's how it works:

1. When you publish a new version, update the version number in both manifest.json and index.js (the currentVersion variable)
2. Push these changes to your GitHub repository
3. Users will see an update button in their SillyTavern extension panel for Deep Plotting
4. When clicked, it will automatically download the new version
5. Users can also type /deep-plotting-update in chat to check for updates manually

To test the update button:
1. Change the version number in manifest.json to "1.0.1" 
2. Push the changes to GitHub
3. In your local SillyTavern, you should see the update button appear 
