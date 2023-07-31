# How to install

https://github.com/koichii/xcx-my-extension.git
https://koichii.github.io/xcx-my-extension/dist/myExtension.mjs
https://shiroganeconsultant.com/xcx-my-extension/dist/myExtension.mjs

★ビルド
ローカルから開発環境へコピー
cd ~/xcratch/xcx-my-extension
npm run build

★開発マシンから本番マシンへコピー
scp ~/xcratch/xcx-my-extension/dist/myExtension.mjs koichii@j-code.org:/datadrive/pcratch/assets/
https://kitaratch.j-code.org/get_asset_file/myExtension.mjs

==
開発環境からローカルへコピー
/dist/myExtension.mjs
git push
xcratch拡張機能として読み込む
https://shiroganeconsultant.com/xcx-my-extension/dist/myExtension.mjs
==

# My Extension
An example extension for [Xcratch](https://xcratch.github.io/)

This extension add extra-block "do it", that executes string in its input field as a sentence in Javascript and return the result.


## ✨ What You Can Do With This Extension

Play [Example Project](https://xcratch.github.io/editor/#https://githubAccount.github.io/xcx-my-extension/projects/example.sb3) to look at what you can do with "My Extension" extension. 
<iframe src="https://xcratch.github.io/editor/player#https://githubAccount.github.io/xcx-my-extension/projects/example.sb3" width="540px" height="460px"></iframe>


## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/). 
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field 
```
https://githubAccount.github.io/xcx-my-extension/dist/myExtension.mjs
```

## Development

### Register on the local Xcratch

Run register script to install this extension on the local Xcratch for testing.

```sh
npm run register
```

### Bundle into a Module

Run build script to bundle this extension into a module file which could be loaded on Xcratch.

```sh
npm run build
```

## 🏠 Home Page

Open this page from [https://githubAccount.github.io/xcx-my-extension/](https://githubAccount.github.io/xcx-my-extension/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/githubAccount/xcx-my-extension/issues). 
