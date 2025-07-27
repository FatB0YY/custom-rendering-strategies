# custom-ssg

Запуск:

1. npm run build:server
2. node prerender-server.js
3. node prerender.js

На выходе получаем готовые html-документы.

`prerender-server.js` - по сути делает все то же самое, что и в SSR: возвращает готовый-html.
`prerender.js` - проходит по всем роутам, которые есть в приложении и берет все продукты, которые доступны (решение в лоб).
