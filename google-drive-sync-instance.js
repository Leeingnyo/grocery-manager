import {
  GoogleDriveSync,
} from './google-drive-sync/google-drive-sync.js';

export const googleDriveSync = new GoogleDriveSync({
  useOffline: true,
  saveRefreshToken: true,
  usePrivate: false,
  flatten: false,
  autoSync: false,
  ignoreConflict: true,
});

googleDriveSync.initGoogleLibrary();

