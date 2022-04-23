# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.3](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.1.2...v1.1.3) (2022-04-23)


### Bug Fixes

* attach observers to this if window.ShadyDOM exists ([4bb51bb](https://github.com/calebdwilliams/element-internals-polyfill/commit/4bb51bb2a2660514d1c10b66256520d70f603746))

### [1.1.2](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.1.1...v1.1.2) (2022-03-24)

### [1.1.1](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.1.0...v1.1.1) (2022-03-24)

## [1.1.0](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.0.4...v1.1.0) (2022-03-24)


### Features

* removing most polyfilled features due to Firefox support, adding only CustomStateSet to Firefox ([b4b0dee](https://github.com/calebdwilliams/element-internals-polyfill/commit/b4b0dee2ee3c7516551891544a809735dabd3198))

### [1.0.4](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.0.3...v1.0.4) (2022-03-24)


### Bug Fixes

* fixed setFormValidity ([2f58bbb](https://github.com/calebdwilliams/element-internals-polyfill/commit/2f58bbbd8b2afb3c173d7b7fee3be3d2ccf772a4))

### [1.0.3](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.0.2...v1.0.3) (2022-02-27)


### Bug Fixes

* readOnly changes checkValidity ([14b0698](https://github.com/calebdwilliams/element-internals-polyfill/commit/14b06985a40345d52c4647f12c696dc73c30c903))

### [1.0.2](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.0.1...v1.0.2) (2022-02-22)


### Bug Fixes

* polyfill now respects willValidate for check and report validity ([366c43c](https://github.com/calebdwilliams/element-internals-polyfill/commit/366c43cb43e6ad947466267f75be3ce1ab652a1a))

### [1.0.1](https://github.com/calebdwilliams/element-internals-polyfill/compare/v1.0.0...v1.0.1) (2022-02-22)

## [1.0.0](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.55...v1.0.0) (2022-02-21)

### [0.1.55](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.54...v0.1.55) (2022-02-21)


### Features

* reflect custom states as shadow parts in addition to attributes ([641cac2](https://github.com/calebdwilliams/element-internals-polyfill/commit/641cac268d3b4371fcfee2bb9ee09c152486e5ed)), closes [#62](https://github.com/calebdwilliams/element-internals-polyfill/issues/62)

### [0.1.54](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.53...v0.1.54) (2022-01-27)


### Bug Fixes

* fix global declaration ([078ae5e](https://github.com/calebdwilliams/element-internals-polyfill/commit/078ae5ea3ef2179da3fa98d0cfafb47e1b26c4cb))

### [0.1.53](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.52...v0.1.53) (2022-01-26)


### Bug Fixes

* **polyfill:** change attachInternals to not be a getter ([b249f36](https://github.com/calebdwilliams/element-internals-polyfill/commit/b249f362d7c2dd1863d8fc43fc61084d36fb5bc2))

### [0.1.52](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.51...v0.1.52) (2022-01-18)


### Bug Fixes

* **findParentForm:** fixed inconsistency with how Chrome finds forms outside of closed custom elements ([ec7c394](https://github.com/calebdwilliams/element-internals-polyfill/commit/ec7c394cf73efe954a3f007b5f96bebc8184fbe9))

### [0.1.51](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.50...v0.1.51) (2021-12-23)


### Bug Fixes

* respect novalidate ([ff33b37](https://github.com/calebdwilliams/element-internals-polyfill/commit/ff33b37f957e85a34ab4009da79201e9203b296b))

### [0.1.50](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.49...v0.1.50) (2021-12-23)


### Bug Fixes

* update form validity check algorithm to not call checkValidity on all changes ([97c3567](https://github.com/calebdwilliams/element-internals-polyfill/commit/97c356715bc21492c021fd88d746339f49b662cd))

### [0.1.49](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.48...v0.1.49) (2021-12-07)

### [0.1.48](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.47...v0.1.48) (2021-12-06)

### [0.1.47](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.46...v0.1.47) (2021-11-26)


### Bug Fixes

* add ariaSetSize to AomMixin ([c11fcae](https://github.com/calebdwilliams/element-internals-polyfill/commit/c11fcae78a31c142bb876e63d0c7fbd3db9bde9b))
* correct typescript@^4.5.0 types ([68d41a4](https://github.com/calebdwilliams/element-internals-polyfill/commit/68d41a42244bd424aff62a34b5fb2c39fcbe677d))
* fix reconcileValidity spelling error ([2d2ca18](https://github.com/calebdwilliams/element-internals-polyfill/commit/2d2ca189e1b8ac722eb1fae995bddf465f776e97))
* update project to work with built-in ElementInternals types ([392703b](https://github.com/calebdwilliams/element-internals-polyfill/commit/392703b510ec808ff0ef059506edbb6acf2324f7))

### [0.1.46](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.45...v0.1.46) (2021-10-11)


### Bug Fixes

* add role to aom ([16a1f6c](https://github.com/calebdwilliams/element-internals-polyfill/commit/16a1f6c49d8666276a6b8ef15ec4712b46215853))

### [0.1.45](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.44...v0.1.45) (2021-10-11)


### Bug Fixes

* Improve feature detection to support Firefox 93 ([#46](https://github.com/calebdwilliams/element-internals-polyfill/issues/46)) ([850e835](https://github.com/calebdwilliams/element-internals-polyfill/commit/850e8354d7a10fd561ed2aead52c82faf9167249))

### [0.1.44](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.43...v0.1.44) (2021-09-01)


### Bug Fixes

* add internals-disabled attribute and test ([30b5b41](https://github.com/calebdwilliams/element-internals-polyfill/commit/30b5b4114c7e7f572d3565be9ae2350d46470e7d))

### [0.1.43](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.42...v0.1.43) (2021-07-30)


### Bug Fixes

* polyfill manages onsubmit attributes set before form is initialized ([0e333a2](https://github.com/calebdwilliams/element-internals-polyfill/commit/0e333a27c8b7acd383ecf513a598f51b9eef7534))

### [0.1.42](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.41...v0.1.42) (2021-07-25)


### Bug Fixes

* remove lit-specific code which is unneeded after a previous fix ([d819cef](https://github.com/calebdwilliams/element-internals-polyfill/commit/d819cefe76aa883be2bad44b630bcad2ff5af10c))

### [0.1.41](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.40...v0.1.41) (2021-07-25)


### Bug Fixes

* ensure form has elements before trying to process data ([65a51a2](https://github.com/calebdwilliams/element-internals-polyfill/commit/65a51a2230d2c22cb7970134da2eca35ae8b60d0))

### [0.1.40](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.39...v0.1.40) (2021-06-28)


### Bug Fixes

* fix typing discrepency ([4db7c23](https://github.com/calebdwilliams/element-internals-polyfill/commit/4db7c2345329453683973f8d64a0f25579e8b65b))

### [0.1.39](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.38...v0.1.39) (2021-06-07)

### [0.1.38](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.37...v0.1.38) (2021-06-07)


### Bug Fixes

* add attribute filter to disabled observer ([329a620](https://github.com/calebdwilliams/element-internals-polyfill/commit/329a6204186e8d916dd94302eadeed2d3f265ad7))

### [0.1.37](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.36...v0.1.37) (2021-05-27)


### Bug Fixes

* add states to interface ([f800756](https://github.com/calebdwilliams/element-internals-polyfill/commit/f800756a84de16d3dae08b291bee917642e04598))

### [0.1.36](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.35...v0.1.36) (2021-05-23)


### Bug Fixes

* **CustomStateSet:** added to window and will throw illegal constructor by default ([73821d8](https://github.com/calebdwilliams/element-internals-polyfill/commit/73821d8ca05d577a855f2621d75b6893f09aa068))

### [0.1.35](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.34...v0.1.35) (2021-05-23)


### Features

* add CustomStateSet ([2e4c1ad](https://github.com/calebdwilliams/element-internals-polyfill/commit/2e4c1adcdb7d2456fb66e1a552923ee096d36c54))

### [0.1.34](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.33...v0.1.34) (2021-05-08)


### Bug Fixes

* form-associated elements inserted from DocumentFragment now upgrade properly ([cc6e690](https://github.com/calebdwilliams/element-internals-polyfill/commit/cc6e690f173b30e9933c4f68143d9b9e1153ab8d))

### [0.1.33](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.32...v0.1.33) (2021-05-07)


### Bug Fixes

* **polyfill:** polyfill now updates form checkValidity and reportValidity methods ([9830aba](https://github.com/calebdwilliams/element-internals-polyfill/commit/9830aba1862c5939414d99796493ed71dbbfa299))

### [0.1.32](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.31...v0.1.32) (2021-05-01)

### [0.1.31](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.30...v0.1.31) (2021-05-01)

### [0.1.30](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.29...v0.1.30) (2021-04-06)


### Bug Fixes

* fix types ([7c90479](https://github.com/calebdwilliams/element-internals-polyfill/commit/7c904797c5f04c32bf243587621737a7c464388a))

### [0.1.29](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.25...v0.1.29) (2021-03-16)


### Bug Fixes

* update ICustomElement types ([511e55b](https://github.com/calebdwilliams/element-internals-polyfill/commit/511e55bd35fa23ab3bc5fb2ea19ab5b615f82b90))
* update types ([a44d744](https://github.com/calebdwilliams/element-internals-polyfill/commit/a44d7441316e10bfcc6c32ca90c730442e0bf34e))
* **types:** update types ([b0f8860](https://github.com/calebdwilliams/element-internals-polyfill/commit/b0f88609fc6061b64f83c5b68505c06856aad5cb))

### [0.1.28](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.27...v0.1.28) (2021-03-16)


### Bug Fixes

* update types ([c2e8fe3](https://github.com/calebdwilliams/element-internals-polyfill/commit/c2e8fe39fc78bbda144ab410f222d84a6d63a5a0))

### [0.1.27](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.26...v0.1.27) (2021-03-15)


### Bug Fixes

* **types:** update types ([060814d](https://github.com/calebdwilliams/element-internals-polyfill/commit/060814d19cbcb10f979c3d36eb0d343680145b94))

### [0.1.26](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.24...v0.1.26) (2021-03-12)

### [0.1.25](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.24...v0.1.25) (2021-03-12)

### [0.1.24](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.23...v0.1.24) (2021-03-12)

### [0.1.23](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.22...v0.1.23) (2021-03-12)

### [0.1.22](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.21...v0.1.22) (2021-03-12)

### [0.1.21](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.20...v0.1.21) (2021-03-12)

### [0.1.20](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.19...v0.1.20) (2021-03-12)

### [0.1.19](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.18...v0.1.19) (2021-03-12)

### [0.1.18](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.17...v0.1.18) (2021-03-12)

### [0.1.17](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.16...v0.1.17) (2021-03-12)

### [0.1.16](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.15...v0.1.16) (2021-03-12)

### [0.1.15](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.9...v0.1.15) (2021-03-12)


### Bug Fixes

* add hidden input for lit-element after render completes ([#27](https://github.com/calebdwilliams/element-internals-polyfill/issues/27)) ([ebbb8ef](https://github.com/calebdwilliams/element-internals-polyfill/commit/ebbb8efe15fc923e4828091973739a7a8df1ed0a))

### [0.1.14](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.13...v0.1.14) (2021-03-08)

### [0.1.13](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.12...v0.1.13) (2021-03-08)

### [0.1.12](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.11...v0.1.12) (2021-03-08)

### [0.1.11](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.10...v0.1.11) (2021-03-08)

### [0.1.10](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.9...v0.1.10) (2021-03-08)


### Bug Fixes

* add hidden input for lit-element after render completes ([0b93a0a](https://github.com/calebdwilliams/element-internals-polyfill/commit/0b93a0a94158ca83caa82a1b9bd1a3381ca7b322))

### [0.1.9](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.8...v0.1.9) (2021-02-23)


### Features

* add error messages ([1d7c716](https://github.com/calebdwilliams/element-internals-polyfill/commit/1d7c716f5be9b0c9734ae0935e2ea60e34a5983c))


### Bug Fixes

* anchor element focus order on form submission reversed compared to Chrome ([#24](https://github.com/calebdwilliams/element-internals-polyfill/issues/24)) ([8346b2f](https://github.com/calebdwilliams/element-internals-polyfill/commit/8346b2fd357bd22b1f5ef725ad0a4de18db3a97c))
* **setValidity:** Added support for setting ValidityState from a native input as Chrome allows this ([#25](https://github.com/calebdwilliams/element-internals-polyfill/issues/25)) ([dbb3c1a](https://github.com/calebdwilliams/element-internals-polyfill/commit/dbb3c1a742044b04a5e81c9855fb9c775831114e))

### [0.1.8](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.7...v0.1.8) (2021-02-19)


### Bug Fixes

* **setFormValue:** accept empty strings like Chrome ([#23](https://github.com/calebdwilliams/element-internals-polyfill/issues/23)) ([8f41892](https://github.com/calebdwilliams/element-internals-polyfill/commit/8f41892f6de7c494be880bcf193870a3c519ee5c))

### [0.1.7](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.6...v0.1.7) (2021-02-11)


### Bug Fixes

* polyfill accepts non-string values like Chrome ([9ac948e](https://github.com/calebdwilliams/element-internals-polyfill/commit/9ac948e78a6ee7403f0d3515c5c8181b34bc366e))

### [0.1.6](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.5...v0.1.6) (2021-02-10)


### Bug Fixes

* **formSubmitCallback:** elements now report validity when a form is submitted ([01b2499](https://github.com/calebdwilliams/element-internals-polyfill/commit/01b249956f3874f54e3b59db5184c0012ee8c324))

### [0.1.5](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.4...v0.1.5) (2021-02-10)


### Features

* **validation anchor:** add validation anchor behavior ([4cc4631](https://github.com/calebdwilliams/element-internals-polyfill/commit/4cc4631cf0f97d5f57554c555689457bb227b4bf))

### [0.1.4](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.3...v0.1.4) (2021-02-09)


### Features

* add shadowRoot to internals ([2477eb2](https://github.com/calebdwilliams/element-internals-polyfill/commit/2477eb2e9a244eedae54809b270fd0d18d58f88f))

### [0.1.3](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.2...v0.1.3) (2021-02-09)


### Features

* **setFormValue:** Add support for FormData to allow settings multiple form values ([a0b2890](https://github.com/calebdwilliams/element-internals-polyfill/commit/a0b2890365ccbc8d2c79073bdf32f1679e60aa0f))

### [0.1.2](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.1...v0.1.2) (2021-02-06)


### Bug Fixes

* **formAssociatedCallback:** make sure internals are available when formAssociatedCallback is called ([df9effa](https://github.com/calebdwilliams/element-internals-polyfill/commit/df9effa3d01c4b88a1de5ece45acdddc7df4e983))
* **setValidity:** added missing anchor in method signature. ([0290325](https://github.com/calebdwilliams/element-internals-polyfill/commit/029032515dc1ba3ea250fb140f9df3eb67cbb476))

### [0.1.1](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.1.0...v0.1.1) (2020-11-18)


### Bug Fixes

* remove console.log() ([b7292b5](https://github.com/calebdwilliams/element-internals-polyfill/commit/b7292b52ee2baaf14a43436c41153c4f9179cbb1))

## [0.1.0](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.23...v0.1.0) (2020-10-15)


### ⚠ BREAKING CHANGES

* update how input references are added to forms

### Features

* add hidden inputs back to polyfill ([9898822](https://github.com/calebdwilliams/element-internals-polyfill/commit/989882234578c26f69e00fb270ae1d5c38690cd4))

### [0.0.23](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.21...v0.0.23) (2020-10-14)

### [0.0.22](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.21...v0.0.22) (2020-07-09)

### [0.0.21](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.20...v0.0.21) (2020-06-02)


### Bug Fixes

* **polyfill:** correct labels reference ([9d326d1](https://github.com/calebdwilliams/element-internals-polyfill/commit/9d326d10b6696061408c3f0cfefbe3b6a063fc32))

### [0.0.20](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.19...v0.0.20) (2020-06-02)

### [0.0.19](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.18...v0.0.19) (2020-06-02)


### Bug Fixes

* **polyfill:** small improvements and refactor of tests ([846f19d](https://github.com/calebdwilliams/element-internals-polyfill/commit/846f19d0dc03c0aa5d1da6d1f54464bfdd269e3d))

### [0.0.18](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.17...v0.0.18) (2020-05-27)


### Bug Fixes

* **polyfill:** now uses correct event names for validity events ([a2fb8d6](https://github.com/calebdwilliams/element-internals-polyfill/commit/a2fb8d6239995bdff170c63446d41b9421324223))

### [0.0.17](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.16...v0.0.17) (2020-05-27)


### Bug Fixes

* **polyfill:** setValidity no longer calls reportValidity ([52d51b6](https://github.com/calebdwilliams/element-internals-polyfill/commit/52d51b6df2d0ad48c9e120dd4e686bb02616d424))

### [0.0.16](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.15...v0.0.16) (2020-05-19)


### Features

* **polyfill:** element's register self with forms under the prop [el.name] ([c01d1c7](https://github.com/calebdwilliams/element-internals-polyfill/commit/c01d1c71c2acbc95fcad07604795fae02c05aae4))

### [0.0.15](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.14...v0.0.15) (2020-04-28)


### Features

* **polyfill:** add basic aom support ([a2696c2](https://github.com/calebdwilliams/element-internals-polyfill/commit/a2696c2147237849ce165f42411c34adb924169c))

### [0.0.14](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.13...v0.0.14) (2020-04-27)

### [0.0.13](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.12...v0.0.13) (2020-04-27)

### [0.0.12](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.11...v0.0.12) (2020-04-27)


### Bug Fixes

* **polyfill:** fix typo ([df0b2e6](https://github.com/calebdwilliams/element-internals-polyfill/commit/df0b2e67a0bc2674076b96f7bf3dda191ba385eb))

### [0.0.11](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.10...v0.0.11) (2020-04-27)

### [0.0.10](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.9...v0.0.10) (2020-04-27)


### Features

* **remove hidden input:** work to remove hidden input ([bc1345f](https://github.com/calebdwilliams/element-internals-polyfill/commit/bc1345f2b64b7c034fe1514d1f16f6761e76c3c1))

### [0.0.9](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.8...v0.0.9) (2020-04-26)


### Bug Fixes

* **polyfill:** change aria-descrbedby to aria-labelledby ([3cc5cd3](https://github.com/calebdwilliams/element-internals-polyfill/commit/3cc5cd31af66e298f9c8ffdb8a6c5fcf747162d2))

### [0.0.8](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.7...v0.0.8) (2020-04-26)


### Features

* **polyfill:** add support for formAssociatedCallback ([7988907](https://github.com/calebdwilliams/element-internals-polyfill/commit/79889071474d843803bf5dd1087b8c1fb7ddc934))

### [0.0.7](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.6...v0.0.7) (2020-04-16)


### Features

* **polyfill:** now fires invalid and valid events ([1e05937](https://github.com/calebdwilliams/element-internals-polyfill/commit/1e0593702c6c8a56cda40a6936d654d91b1176ce))

### [0.0.6](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.5...v0.0.6) (2020-04-14)


### Bug Fixes

* **polyfill:** fix setValidity ([ee18f41](https://github.com/calebdwilliams/element-internals-polyfill/commit/ee18f4118b2d54ea482f6c7cdb4ae3ccb6ca6830))

### [0.0.5](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.4...v0.0.5) (2019-11-16)


### Bug Fixes

* **structure:** Fix file structure ([5f4cad4](https://github.com/calebdwilliams/element-internals-polyfill/commit/5f4cad44a32cd7f023a69334fe416c14a47de9e2))

### [0.0.4](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.1...v0.0.4) (2019-11-16)


### Bug Fixes

* **polyfill:** Include built files in npm ([ca45513](https://github.com/calebdwilliams/element-internals-polyfill/commit/ca455135e622d6682e489959a79e0aa12dc249ff))
* **structure:** Fix file structure ([9c4bff2](https://github.com/calebdwilliams/element-internals-polyfill/commit/9c4bff2f0db6253afd39fea20830756482eae595))

### [0.0.3](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.2...v0.0.3) (2019-11-15)

### [0.0.2](https://github.com/calebdwilliams/element-internals-polyfill/compare/v0.0.1...v0.0.2) (2019-11-15)


### Bug Fixes

* **polyfill:** Include built files in npm ([ca45513](https://github.com/calebdwilliams/element-internals-polyfill/commit/ca455135e622d6682e489959a79e0aa12dc249ff))

### 0.0.1 (2019-11-15)


### Features

* **polyfill:** Initial commit ([385cb42](https://github.com/calebdwilliams/element-internals-polyfill/commit/385cb427acd5c21946adaf5b9e47bcdfb761d5ab))
