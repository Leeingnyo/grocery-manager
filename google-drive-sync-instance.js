import {
  GoogleDriveSync,
} from './google-drive-sync/google-drive-sync.js';

export const googleDriveSyncInstance = new GoogleDriveSync({
  useOffline: true,
  saveRefreshToken: true,
  usePrivate: false,
  flatten: false,
  autoSync: false,
  ignoreConflict: true,
});

