Jerry Luxury - website
======================
Open this folder in VS Code, then open index.html in a browser
(or use the "Live Server" extension: right-click index.html > Open with Live Server).

Structure
  index.html          page content
  css/style.css       main styling (colours are variables at the top, in :root)
  css/assistant.css   styling for the assistant + WhatsApp buttons
  js/main.js          menu, video, lightbox, testimonials, form
  js/assistant.js     the assistant (answers questions, hands off to WhatsApp)
  assets/images       logo.png, lookbook photos and video poster
  assets/video        hero video (hero.mp4)

Change the owner's WhatsApp number / details:
  Open js/assistant.js and edit the CONFIG block at the top.
  whatsapp must be in international format with no + or spaces
  (0701 054 4829 becomes 2347010544829).

Edit contact details shown on the page in index.html (search "Phone / WhatsApp").
Fonts load from Google Fonts, so an internet connection is needed for the custom fonts.
