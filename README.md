# Star Path Viewer

Trace a star on any date within a time span of millennia.
[→ Go to website](https://stardial-astro.github.io/star-path-viewer)

[![Version](https://img.shields.io/badge/version-v1.0-blue)](#features) [![npm](https://img.shields.io/badge/npm-10.2.4-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com) [![react](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev) [![mui](https://img.shields.io/badge/MUI-5.16.6-007FFF?logo=mui&logoColor=white)](https://mui.com)

## Description

[Star Path Viewer](https://stardial-astro.github.io/star-path-viewer) is a [React](https://react.dev) web application of [this project](https://github.com/claude-hao/star-path-calculator) as a RESTful client for [this Flask server](https://github.com/lydiazly/star-path-calculator-flask).

Input the date, location, and a celestial object's infomation to view the star path and rising/setting details.

## Table of Contents<!-- omit in toc -->

- [Description](#description)
- [Features](#features)
  - [Main Functions](#main-functions)
  - [User Interface](#user-interface)
- [Services](#services)
- [Resources](#resources)
- [References](#references)

## Features

### Main Functions

:stars: Plots the star path and calculates the rising/setting times based on the provided date, location, and star information.
:calendar: Covers a wide time span, from **3001 BCE to 3000 CE**.
:ringed_planet: Uses the [JPL DE406 ephemeris and Hipparchus Catelogue](#resources) to calculate the planet and star positions for any given time.
:telescope: Accounts for the **proper motion** of a star if the Hipparcos Catalogue number is provided.
:night_with_stars: Displays star paths with distinct line styles for daytime, twilight, and nighttime.
:clock1: Offers both [local time](#resources) and UT1 time in output details (*Daylight Saving Time is not included*).

### User Interface

:round_pushpin: Offers flexible location input options, including location search, geographical position lookup, or manual latitude and longitude entry.
:calendar: Accepts both **Gregorian** and **Julian** calendar date inputs.
:spiral_calendar_pad: Allows users to quickly retrieve equinox or solstice dates by specifying just the year and location, instead of a full date.
:star: Supports star or planet input by name, Hipparcos Catalogue number, or ICRS coordinates (RA, Dec).
:mag: Allows searching for Hipparcos Catalogue numbers by integers or strings of names, supporting Bayer designations, proper names, and [Chinese names (traditional, simplified, and pinyin)](#resources).
:framed_picture: SVG diagrams are available for download in SVG, PNG, or PDF formats.

## Services

This app relies on the following services:

1. **[browser-geo-tz](https://github.com/kevmo314/browser-geo-tz)** - A browser variant of the geographical timezone lookup package [node-geo-tz](https://github.com/evansiroky/node-geo-tz).

2. **[Nominatim API](https://nominatim.org/release-docs/latest/api/Overview)** - An API to search [OSM](www.openstreetmap.org) data by name and address (geocoding) and to generate synthetic addresses of OSM points (reverse geocoding).

3. **[Baidu Web Service API](https://lbsyun.baidu.com/faq/api?title=webapi)** - Only if unable to connect to Nominatim, fallback to this geocoding service.

## Resources

This React client uses the following external resources:

- Hipparchus Catalogue

  [The Hipparcos and Tycho Catalogues](https://www.cosmos.esa.int/web/hipparcos/catalogues)
  [FTP](https://cdsarc.cds.unistra.fr/ftp/cats/I/239) (DE406)

- Bayer Designation and Proper Name

  [FTP](https://cdsarc.cds.unistra.fr/ftp/I/239/version_cd/tables) (ident4, ident6)

- Timezone

  [Timezone Boundary Builder](https://github.com/evansiroky/timezone-boundary-builder)

- Chinese Star Names

  [Hong Kong Observatory](https://web.archive.org/web/20120209032035/http://www.lcsd.gov.hk/CE/Museum/Space/Research/StarName/c_research_chinengstars.htm)

- Traditional Chinese to Simplified Chinese Conversion

  [Open Chinese Convert](https://pypi.org/project/OpenCC)

- Chinese Characters to Pinyin Conversion

  [pypinyin](https://github.com/mozillazg/python-pinyin)

## References

- [Rise, Set, and Twilight Definitions](https://aa.usno.navy.mil/faq/RST_defs)

- R. Tousey and M. J. Koomen, "The Visibility of Stars and Planets During Twilight," *Journal of the Optical Society of America*, Vol. 43, pp. 177-183, 1953. [Online]. Available: <https://opg.optica.org/josa/viewmedia.cfm?uri=josa-43-3-177&seq=0&html=true>
