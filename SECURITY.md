# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it
**privately** rather than opening a public issue.

**Email:** oemererguen@outlook.de

Please include:

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact

You will receive a response within 72 hours acknowledging your report. We will
work with you to understand the issue and coordinate a fix before any public
disclosure.

## Scope

This is a client-side application that runs entirely in the browser. There is no
backend server or database. However, we still take the following seriously:

- XSS vulnerabilities in rendered CV/cover letter content
- Malicious payloads in imported JSON resume files
- Dependencies with known vulnerabilities

## Supported Versions

Only the latest version deployed on GitHub Pages is actively maintained.

## Disclosure

We follow coordinated disclosure. Once a fix is available, we will credit the
reporter (unless they prefer to remain anonymous) and publish details in the
release notes.
