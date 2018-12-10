# Icons

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
  - [Prefixes](#prefixes)
- [Understanding `meta.json`](#understanding-metajson)
- [FAQ](#faq)
    - [Will there be an `iconfont` package for IBM Design Language icons?](#will-there-be-an-iconfont-package-for-ibm-design-language-icons)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Introduction

The Carbon Elements [icon package](/packages/icons) is used as a centralized
source of truth for icons from the IBM Design Language. The source files for all
official icons is available [here](/packages/icons/src/svg). The organization of
this directory is as follows:

- All icons in the top-level directory are considered as glyphs, meaning that we
  should build icons that are exactly the size of the SVG's artboard
- All icons in a directory that is not a number are considered prefixed. For
  example, `/cloud/menu.svg` would be considered as an icon called `menu.svg`
  with the prefix `cloud`
- Any directory named as a number represents the size of all icons in that
  directory. For example, `/32/menu.svg` would mean that we put the `menu.svg`
  icon on a 32x32 artboard.

These rules also apply to sub-directories. For example, `/32/cloud/menu.svg`
would mean that `menu.svg` would be on a 32x32 artboard and would have the
`cloud` prefix.

### Prefixes

As mentioned above, prefixes encode directory and size information for icons in
our [SVG source directory](/packages/icons/src/svg). These are intended to be
used to help organize our source files, in addition to properly generating paths
in our output bundles.

For example, imagine we have the following icons in our source directory:

```
svg
├── cloud
│   └── menu.svg
├── 16
│   └── menu.svg
```

We have two icons named `menu.svg`, however one is under the `16` directory and
the other is under the `cloud` directory. When we build our icon module
directories, these files will be transformed to:

```js
es
├── cloud
│   └── menu
│   │   └── index.js
├── menu
│   └── 16.js
```

This structure would allow developers to require these modules by doing the
following:

```js
import CloudMenu from '@carbon/icons/es/cloud/menu';
import Menu16 from '@carbon/icons/es/menu/16';
```

As we support an increasing amount of icons in our core library, it's important
that we keep track of these prefixes and size information so that we can
optimize the paths to make it easier for developers to import and use these
assets.

## Understanding `meta.json`

The `@carbon/icons` package exposes a `meta.json` file that is helpful for
library authors to use when generating component icon libraries. For a full
guide for building icon libraries, check out [this
guide](/docs/guides/building-an-icon-library.md).

The `meta.json` file contains an array of all of the icons built from the source
files available in `@carbon/icons`. Each entry contains the following metadata
that you can use:

```json5
{
  // The source filename
  filename: 'add--outline.svg',
  basename: 'add--outline',

  // Optional size attribute if under a `16` directory
  size: 16,

  // Prefix represents each directory in the path to the source file.
  // Useful for output paths in the icon library
  prefix: [
    // Means that the icon is available at `/16/add--outline.svg`
    '16',
  ],

  // An icon "descriptor" which represents all the information about the icon
  // syntax tree in an object. Each level has `elem`, `attrs`, and `content`.
  descriptor: {
    elem: 'svg',
    attrs: {
      '...': '...',
    },
    content: [
      {
        elem: 'path',
        attrs: {
          d: '...',
        },
      },
    ],
  },

  // JavaScript-safe module name for the icon. Used to stay consistent across
  // libraries
  moduleName: 'AddOutline16',

  // Represents the output options of the file in `@carbon/icons`. Useful for
  // mirroring the output path in each icon library
  outputOptions: {
    file: 'es/add--outline/16.js',
  },
}
```

## FAQ

#### Will there be an `iconfont` package for IBM Design Language icons?

Currently, we do not intend to support an iconfont for the IBM Design Language
icons. This is due to the following constraints:

- There is a large number of icons in the IBM Design Language, and so any
  iconfont package would be unnecessarily large for most users
- Iconfonts have been identified to have several issues regarding accessibility,
  namely for individuals with dyslexia
  - https://twitter.com/sarah_edo/status/1044580394052403200
  - https://speakerdeck.com/ninjanails/death-to-icon-fonts
