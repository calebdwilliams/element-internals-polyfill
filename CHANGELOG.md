# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
