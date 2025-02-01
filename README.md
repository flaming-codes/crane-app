<p align="center"><img src="https://cran-e.com/og" /></p>
<h2 align="center">
<a href="https://cran-e.com">CRAN/E</a>
</h2>
<p align="center">CRAN/E is a modern PWA (Progressive Web App) that serves as a search engine and information display for packages hosted on CRAN. CRAN/E means 'The Comprehensive R Archive Network, Enhanced' and aims at finding R-packages as fast as possible.</p>

<br />
<br />
<br />

# Applications

## [PWA (Progressive Web App)](https://cran-e.com)

You can use CRAN/E directly in any modern browser. CRAN/E can also be installed as a PWA locally in Chromium-based browsers as well as the latest Safari. For more information regarding PWAs, please visit [this great guide](https://web.dev/progressive-web-apps/).

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=fd7f0da41296&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

## [Raycast Extension](https://www.raycast.com/flaming-codes/cran-e-search)

You can directly use the typeahead search of CRAN/E in Raycast. We published an extension on the Raycast Store to search for packages and authors. All CRAN/E Raycast extensions are developed as FOSS as well at [flaming-codes/crane-raycast](https://github.com/flaming-codes/crane-raycast).

<br />
<br />

# About

This repository contains all code required to build the Frontend of CRAN/E. We decided to develop it as OSS as we believe in the advantage of a strong community as well as transparency regarding our development.

> CRAN/E is not a package hosting solution for R-code. It's sole purpose is to provide a simple and effective interface for finding packages hosted on CRAN.

You find the site code (frontend & main backend) in `/web`. The main code in `/web` is deployed on [DigitalOcean](https://www.digitalocean.com/) and uses [Remix](https://remix.run/) to deliver the pages as well as serve endpoints to fetch their data.

## Motivation

The official [CRAN](https://cran.r-project.org/) is in a desperate visual state. Although it's using a very simple structure and basically no potentially distracting styling, using the original site is hard for a few reasons:

- no search interface
- all packages in the overview get loaded at once
- using outdated and deprecated technology, such as `<frameset>`

Therefore we decided to develop a new user interface with search capabilities, that's working on all screen classes using state-of-the-art APIs.

<br />
<br />

# Structure

This repo uses the `web`-directory for the PWA codebase. The `web`-directory is a Remix-project and contains all necessary code to run the frontend of CRAN/E.

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

# Maintainer

This code is mainly created and maintained by [flaming.codes](https://flaming.codes).
