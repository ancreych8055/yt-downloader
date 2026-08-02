1. Установите питон
Добавь питон в переменные среды
(C:\Users\user\AppData\Local\Python\bin)
2. Установите yt-dlp
pip install -U yt-dlp
(по умолчанию пип качает в папку питона, C:\Users\user\AppData\Local\Python\pythoncore-3.14-64\Scripts)
Проверьте, что установка прошла успешно, выполнив yt-dlp --version. Если увидите версию — всё в порядке.
3. Установите ffmpeg
winget install ffmpeg
Проверьте, что установка прошла успешно, выполнив ffmpeg -version
4. Установите deno
pip install deno
Проверьте, что установка прошла успешно, выполнив deno --version
5. Добавить ffmpeg, deno и yt-dlp в переменные среды
6. Изменить registry_bat и host.json и run_host.bat под себя, а в компаньене указать путь под себя
7. Запустить run_host.bat
8. В экстеншне браузера загрузить распакованное расширение
9. В браузере в плагине скопировать айдишник и закинуть в host.json в allowed_origins
10. Перезапустить браузер и плагин и все должно заработать
