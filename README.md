# Audio File Converter

Repo for https://worksoffline.io/audio-converter

## FFmpeg Update

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

## Credits

This project was only made possible by the work of wonderful people who publish open source libraries.

- https://github.com/ffmpegwasm/ffmpeg.wasm
- https://svelte.dev/
- https://github.com/ItalyPaleAle/svelte-spa-router
- https://vitejs.dev/
- https://vite-pwa-org.netlify.app/
- https://tailwindcss.com/
