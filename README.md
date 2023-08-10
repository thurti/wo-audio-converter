# Audio File Converter

Repo for https://worksoffline.io/audio-converter

## Service Worker Update

FFmpeg gets cached on its own. To update ffmpeg copy new files to `public/lib/ffmpeg` and set new version number in `.env`. This would udpate the cached version.

## Browser & Server Requirements

Browser must support Shared Array Buffer.
Cross Origin Isolation Headers: https://developer.chrome.com/blog/enabling-shared-array-buffer/#cross-origin-isolation

## FFMPEG References

| format  | options                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------ |
| wav     | https://trac.ffmpeg.org/wiki/audio%20types                                                       |
| mp3     | https://trac.ffmpeg.org/wiki/Encode/MP3                                                          |
|         | https://en.wikipedia.org/wiki/MP3#Bit_rate                                                       |
| ogg     |  https://wiki.hydrogenaud.io/index.php?title=Recommended_Ogg_Vorbis#Recommended_Encoder_Settings |
| mp4/aac | https://trac.ffmpeg.org/wiki/Encode/AAC                                                          |
| flac    | https://www.ffmpeg.org/ffmpeg-codecs.html#flac-2                                                 |

## ToDo, Ideas

- add pwabuilder installer prompt for easy install
- maybe custom service worker to add notification with action (download all) and on click focus application
- add context menu -> convert to mp3 -> open file dialog and pre select settings
- add context on drag?
- how to update on load
  - on app init check if online, make overlay and then check for update, if needsupdate do reload
- add a "panic" button to completly remove the service worker and reload the page in case nothing works anymore -> maybe make updater its own svelte "app"
- add basic plainwright tests
- add social graph sharing stuff
- install goaccess
- show expert stuff panel if last used was custom command
- fix settings on startup bug
