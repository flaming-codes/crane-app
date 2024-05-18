<br />
<br />
<br />

<p align="center"><img src="./web/static/images/og/cover-01.jpg" /></p>
<h2 align="center">
<a href="https://cran-e.com">CRAN/E</a>
</h2>
<p align="center">CRAN/E is a modern PWA (Progressive Web App) that serves as a search engine and information display for packages hosted on CRAN. CRAN/E means 'The Comprehensive R Archive Network, Enhanced' and aims at finding R-packages as fast as possible.</p>

<br />
<br />
<br />
<br />
<br />

# Applications

## [PWA (Progressive Web App)](https://cran-e.com)

You can use CRAN/E directly in any modern browser. If supported, CRAN/E can provide its best performance by using local databases and effective caching. CRAN/E can also be installed locally in Chromium-based browsers. For more information regarding PWAs, please visit [this great guide](https://web.dev/progressive-web-apps/).

## [Raycast Extension](https://www.raycast.com/flaming-codes/cran-e-search)

You can directly use the typeahead search of CRAN/E in Raycast. We published an extension on the Raycast Store to search for packages and authors. All CRAN/E Raycast extensions are developed as FOSS as well at [flaming-codes/crane-raycast](https://github.com/flaming-codes/crane-raycast).

## [Google Play Store](https://play.google.com/store/apps/details?id=com.cran_e.twa)

CRAN/E is also available via the Play Store on Android and Chrome OS devices. Please note that this store app is equivalant to the PWA and only repackaged for the Play Store.

## [Microsoft Store](https://apps.microsoft.com/store/detail/crane/9PL1GMMSC8L3)

If you prefer, you can also install CRAN/E via the Microsoft Store. Please note that this store app is equivalant to the PWA and only repackaged for the Microsoft Store.

<br />
<br />

# About

This repository contains all code required to build the Frontend of CRAN/E. We decided to develop it as OSS as we believe in the advantage of a strong community as well as transparency regarding our development.

> CRAN/E is not a package hosting solution for R-code. It's sole purpose is to provide a simple and effective interface for finding packages hosted on CRAN.

You find the site code (frontend & main backend) in `/web`. You find different smaller backend-only services in `/services/...`. The main code in `/web` is deployed on **Vercel's Edge Platform** and uses SvelteKit to deliver the pages as well as serve endpoints to fetch their data. The `/services/...` contain different smaller backend-only services that are deployed on other platforms, like **fly.io**.

## Motivation

The official [CRAN](https://cran.r-project.org/) is in a desperate visual state. Although it's using a very simple structure and basically no potentially distracting styling, using the original site is hard for a few reasons:

- no search interface
- all packages in the overview get loaded at once
- using outdated and deprecated technology, such as `<frameset>`

Therefore we decided to develop a new user interface with search capabilities, that's working on all screen classes using state-of-the-art APIs.

<br />
<br />

# Structure

This repo uses the `web`-directory for the PWA codebase. Isolated backend services are located in the `services`-directory. The `web`-directory is a SvelteKit project. The `services`-directory contains different backend-only services that can be deployed on different platforms.

<br />
<br />

# Contribution

We openly encourage everyone to submit bug reports and new ideas to consistently improve the overall app experience.

## Feature requests

For new features you want to add, please use the **Github Discussions** feature of this repo. We don't blindly accept feature requests as issues. Each feature requests is discussed first, and if a consent is achieved, the progress for implementing it will be tracked via an issue.

## Bug reports

For new bug reports, please create an issue in this repository. The issue setup will guide through the necessary data required for submission.

<br />
<br />

# Application architecture

Please visit the [wiki-pages](https://github.com/flaming-codes/crane-app/wiki) of this repo for an overview of the architecture.

<br />
<br />

# Maintainer

This code is mainly created and maintained by [flaming.codes](https://flaming.codes).
