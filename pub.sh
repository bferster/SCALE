echo "Publishing qDraw"
cat app.js \
doc.js \
content.js \
navigation.js \
> mw-all.js
babel mw-all.js >mw-all5.js
