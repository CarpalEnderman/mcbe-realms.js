# mcbe-realms

A JS wrapper for the MCBE realms API.

Everything is decently documented so you can look around and do whatever you want with it.

**NOTE:** This is weakly tested, so there's no guarantees that _everything_ is working. This is because I'm only really using this for personal use, and I don't intend to make this more robust as of now.

[npm](https://www.npmjs.com/package/mcbe-realms) - [github](https://github.com/CarpalEnderman/mcbe-realms.js)

## Changelog

### 1.0.4

- Fixed a bug which would stop you from downloading a backup's world folder.
- Added readable errors for 503 Service Unavailable and 429 Too Many Requests HTTP errors.
- Added a new type of error: `DownloadError`.
- Added a possible download error in `Download.getRaw()` and `Download.getWorldFolder()` for when you try download a file/folder with the same name as another file/folder in the same directory. You can also pass in the parameter `overwriteExisting: true` to ignore this and remove the file/folder before downloading.

### 1.0.3

- Added typescript typings for the module, generated from the JSDoc comments within the code. These are located in `/typings`
- Renamed the `User` class to `Client` to make it more fitting.
