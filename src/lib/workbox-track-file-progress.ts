// https://micahjon.com/2022/track-download-progress-workbox/

import { type WorkboxPlugin } from "workbox-core";

export class TrackFileProgressPlugin implements WorkboxPlugin {
  /**
   * Called before a Response is used to update a cache
   * @return {Response|null} - Return null to avoid caching
   */
  cacheWillUpdate: WorkboxPlugin["cacheWillUpdate"] = async ({
    response,
    request,
    state,
  }) => {
    const shouldCacheResponse = (response: Response) => {
      if (response.status === 200) {
        // Ensure the file size is known (to derive content-range header)
        try {
          getFileSize(response);
        } catch (err) {
          return false;
        }
        return true;
      }

      if (response.status === 206) {
        try {
          // Did 206 response include entire file?
          const contentLength = getFileSize(response);
          return (
            `bytes 0-${contentLength - 1}/${contentLength}` ===
            response.headers.get("content-range")
          );
        } catch (err) {}
      }

      return false;
    };

    // Helper function for tracking download progress
    // Adapted from: https://github.com/AnthumChris/fetch-progress-indicators/blob/master/sw-basic/sw-simple.js#L41
    const trackDownloadProgress = (
      response: Response,
      reportProgress: Function
    ) => {
      // Start tracking
      reportProgress(0);

      let totalBytes: number;
      try {
        // Ensure that the browser supports ReadableStream and we know total file size
        if (!response.body) throw "response.body missing";
        totalBytes = getFileSize(response);
      } catch (error) {
        console.error("Failed to track download progress", error);
        return;
      }

      let loadedBytes = 0;
      const reader = response.body.getReader();

      new ReadableStream({
        async start(controller) {
          read();

          function read() {
            reader
              .read()
              .then(({ done, value }: { done: boolean; value: Uint8Array }) => {
                if (done) {
                  controller.close();
                  return;
                }

                controller.enqueue(value);
                loadedBytes += value.length;
                reportProgress(loadedBytes / totalBytes);
                read();
              })
              .catch((error: any) => {
                // Error only typically occurs if network fails mid-download
                console.error("error in read()", error);
                controller.error(error);
              });
          }
        },

        // Firefox excutes this on page stop, Chrome does not
        cancel(reason) {
          console.log("cancel()", reason);
        },
      });
    };

    /**
     * Get total file size in bytes
     */
    const getFileSize = (response: Response) => {
      // If content is encoded, then content-length will not be accurate
      // if (response.headers.get("content-encoding"))
      // throw "content-encoding header";

      // We use content-length header to get total file size
      const contentLength = response.headers.get("content-length");
      // if (contentLength === null) throw "content-length missing";

      //return -1 for files where filesize is not known
      return parseInt(contentLength) || 0;
    };

    // if (!shouldCacheResponse(response)) return null;

    const broadcast = new BroadcastChannel("cache-download-progress");
    const fileSize = getFileSize(response);

    // Helper function for sending progress to client
    // Added to state object so cacheDidUpdate method can access it
    state.reportProgress = (progressPercent: number) => {
      broadcast.postMessage({
        type: "DOWNLOAD_PROGRESS",
        url: request.url,
        progress: progressPercent,
        fileSize,
      });
    };

    // Clone response b/c stream can only be used once (either for tracking download
    // or for saving to cache, not both)
    const clonedResponse = await response.clone();
    trackDownloadProgress(clonedResponse, state.reportProgress);

    // Response is ready to cache
    if (response.status === 200 && response.headers.has("content-range")) {
      return response;
    }

    // Convert status from 206 -> 200 to make it cacheable (needed if response was
    // requested by fetch instead of by an Audio element)
    const status = 200;

    // Add content-range header if missing from 200 response (needed for iOS Safari)
    const headers = new Headers(response.headers);
    if (!response.headers.has("content-range")) {
      const contentLength = getFileSize(response);
      headers.set(
        "content-range",
        `bytes 0-${contentLength - 1}/${contentLength}`
      );
    }

    return new Response(response.body, { status, headers });
  };

  /**
   * Called after Response is successfully saved to cache
   */
  cacheDidUpdate: WorkboxPlugin["cacheDidUpdate"] = async ({ state }) => {
    // Optional: guarantee that file is marked as fully downloaded in the event
    // that progress tracking fails
    if (state.reportProgress) state.reportProgress(1);
  };
}
