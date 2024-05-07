## Requirements

- `node` version >=14.17.6
- [tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) have been installed in chrome broswer
- **windows os only:** [windows-build-tools](https://www.npmjs.com/package/windows-build-tools) have been installed
- **mac os only:** Command Line Tools (CLT) for Xcode: xcode-select --install, [developer.apple.com/downloads](http://developer.apple.com/downloads) or [Xcode 3](https://apps.apple.com/us/app/xcode/id497799835)
- **arch linux os only:** [base-devel](https://archlinux.org/groups/x86_64/base-devel/) have been installed

## Getting started

Clone the repository

```zsh
git clone git@github.com:I-Want-ToBelieve/color-code.git
# or git clone https://github.com/I-Want-ToBelieve/color-code.git
```

Switch to the repo folder

```zsh
cd color-code
```

Install dependencies **(If you are blocked by GFW, please read the [QA](#qa) section)**

```zsh
yarn install
```

Runs the app in the development mode

```zsh
yarn start
# or yarn serve
# or yarn dev
```

Use chrome broswer open the development server link

```
google-chrome-stable http://localhost:8124/dev.user.js # in archlinux
chrome http://localhost:8124/dev.user.js # in windows via scoop
```

## Devlopement

how to open the setting page?

![how to open the setting page](https://greasyfork.s3.us-east-2.amazonaws.com/wiu6d32rsarffrxgli97e9uff7ls)

the setting page prototype

<p class="codepen" data-height="300" data-default-tab="result" data-slug-hash="GRRjmOE" data-editable="true" data-user="FloatingShuYin" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/FloatingShuYin/pen/GRRjmOE">
  Syntax highlighting Setting Page prototype</a> by doublethink (<a href="https://codepen.io/FloatingShuYin">@FloatingShuYin</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Bundle

Bundle everything from `src/` into `dist/bundle.user.js`:

`yarn build`

or

`npx rollup --config`

### Development server

`yarn serve`

This will automatically update `dist/bundle.user.js` when code changes and serve it on [localhost:8124](http://localhost:8124/).

It also creates a second userscript `dist/dev.user.js`, if you install it in Tampermonkey, it will automatically fetch the latest version from http://localhost:8124/bundle.user.js once you reload a website with F5.

### Bundle without source map

Bundle for publishing without sourcemapping to `dist/release-3.2.1.user.js`

`yarn build:release`

or on Windows

`yarn build:release:win32`

**Note: If you have added [these plugins](#enhance-your-development-experience) to your editor, you rarely need to manually execute any of the above code specification related commands.**

## Enhance your development experience

The [vscode](https://code.visualstudio.com/) editor extensions listed below can enhance your development experience, and other editors should have similar plugins.

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [css modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules)
- [vscode-@emotion/styled](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-@emotion/styled)
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)
- [dotenv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
- [npm Dependency Links](https://marketplace.visualstudio.com/items?itemName=herrmannplatz.npm-dependency-links)
- [SVG Language Support](https://marketplace.visualstudio.com/items?itemName=jock.svg)

## Learn More

There are a lot of link comments in the source code, if you do not understand the code, you might as well click the link in the comments to see!

## QA

Q: `yarn upgrade` does not update package.json

A: ref https://github.com/yarnpkg/yarn/issues/2042

```zsh
yarn global add npm-check-updates
ncu -u
yarn install --check-files
ncu -u
```

Q: What to do if the dependencies cannot be downloaded due to network problems

A: ref https://npm.taobao.org/mirrors

First execute the following command to add the mirror, and then use `yarn install` to download the dependencies

```zsh
yarn config set registry https://registry.npm.taobao.org -g
yarn config set disturl https://npm.taobao.org/dist -g
yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/ -g
yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/ -g
yarn config set phantomjs_cdnurl https://npm.taobao.org/mirrors/phantomjs/ -g
```

if it still does not work, you can try to use `yarn --ignore-optional` to skip the download of optional dependencies

power by [rollup-userscript-template](https://github.com/cvzi/rollup-userscript-template)
