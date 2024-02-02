# Drjim

Bare minimum for firebase email/password auth without Node.

## Local development

In first terminal start firebase emulator with

     firebase emulators:start

In a second terminal start the static web server with

    servedir -p 8080 public

View this demo at http://localhost:8080 and the firebase emulator admin UI
at http://localhost:4000/auth.

## Deploy

Deploy to [firebase project] with ID `drjim-eaf50` with

    firebase deploy

[firebase project]: https://console.firebase.google.com/u/0/project/drjim-eaf50/overview

View it live at https://drjim-eaf50.web.app/ .
