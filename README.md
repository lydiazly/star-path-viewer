# StarPathViewer

[![npm](https://img.shields.io/badge/npm-10.2.4-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com) [![react](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)](https://react.dev) [![mui](https://img.shields.io/badge/MUI-5.16.6-007FFF?logo=mui&logoColor=white)](https://mui.com)

[→ Go to website](https://stardial-astro.github.io/star-path-viewer)

## Introduction

[StarPathViewer](https://stardial-astro.github.io/star-path-viewer) is a [React](https://react.dev) web application of [this project](https://github.com/claude-hao/star-path-calculator) as a RESTful client for [this Flask server](https://github.com/lydiazly/star-path-calculator-flask).

Input the date, location, and a celestial object's infomation to view the star path and rising/setting details.

## Table of Contents<!-- omit in toc -->

- [Introduction](#introduction)
- [Features](#features)
- [Dependencies](#dependencies)
- [Run the React app locally in development mode](#run-the-react-app-locally-in-development-mode)
  - [1. Install packages](#1-install-packages)
  - [2. Provide environment variables](#2-provide-environment-variables)

## Features

- Input the date, location, and star infomation to view the star path and rising/setting details.
- Fetch the dates of the equinoxes and solstices of a given year.
- Support Gregorian/Julian date input.
- Location search, geographical position lookup, or enter the latitude and longitude manually.
- Specify a celectial object by choosing a name, entering a Hipparcos Catalog number, or providing the ICRS coordinates (RA, Dec).
- Download the SVG figure as SVG, PNG, or PDF.

## Dependencies

This project relies on the following open course services:

1. **[browser-geo-tz](https://github.com/kevmo314/browser-geo-tz)** - A browser variant of the geographical timezone lookup package [node-geo-tz](https://github.com/evansiroky/node-geo-tz).

2. **[Nominatim API](https://nominatim.org/release-docs/latest/api/Overview)** - An API to search [OSM](www.openstreetmap.org) data by name and address (geocoding) and to generate synthetic addresses of OSM points (reverse geocoding).

3. **[Baidu Web Service API](https://lbsyun.baidu.com/faq/api?title=webapi)** - Only if unable to connect to Nominatim, fallback to this geocoding service.

## Run the React app locally in development mode

### 1. Install packages

  ```sh
  yarn
  ```

### 2. Provide environment variables

  Create `.env`:

  ```sh
  GENERATE_SOURCEMAP=false
  REACT_APP_SERVER_URL=<server_url>
  HTTPS=true
  SSL_CRT_FILE=./localhost.pem
  SSL_KEY_FILE=./localhost-key.pem
  ```

  where `<server_url>` is the [remote](https://github.com/lydiazly/star-path-calculator-flask) or local server's URL, `localhost.pem` and `localhost-key.pem` are the CA certificate and its key (see below).

  ```sh
  npm start
  ```

  View in the brower at <https://localhost:3000/star-path-viewer>

- SSL

  (1) Install [mkcert](https://github.com/FiloSottile/mkcert)

  Mac:

  ```sh
  brew install mkcert
  ```

  (2) Create a local certificate authority (CA) with mkcert

  ```sh
  mkcert -install
  ```

  This command creates and installs a local CA to your system, making any certificate generated by `mkcert` trusted.
  The CA certificate and its key are stored in an application data folder in the user home, which can be printed by: `mkcert -CAROOT`

  (3) Generate a certificate and private key for your local development domain

  ```sh
  mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
  ```

  - This command generates your certificate and key files `localhost.pem` and `localhost-key.pem`.
  - Including `::1` ensures that the certificate is also valid IPv6.

  (4) Clear browser cookies of localhost and restart the browser to test again
