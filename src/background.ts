"use strict";

import { app, BrowserWindow, ipcMain, protocol } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import * as path from "path";
import semver from "semver/preload";

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function initAutoUpdater(event: Electron.IpcMainEvent, data: unknown) {
  if (data) {
    autoUpdater.allowPrerelease = true;
  } else {
    // Defaults to true if application version contains prerelease components (e.g. 0.12.1-alpha.1)
    // autoUpdater.allowPrerelease = true
  }

  if (isDevelopment) {
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.updateConfigPath = path.join(__dirname, "dev-app-update.yml");
  }
  if (process.platform === "darwin") {
    autoUpdater.autoDownload = false;
  }
  autoUpdater.on("update-available", info => {
    event.sender.send("autoUpdateNotification", "update-available", info);
  });
  autoUpdater.on("update-downloaded", info => {
    event.sender.send("autoUpdateNotification", "update-downloaded", info);
  });
  autoUpdater.on("update-not-available", info => {
    event.sender.send("autoUpdateNotification", "update-not-available", info);
  });
  autoUpdater.on("checking-for-update", () => {
    event.sender.send("autoUpdateNotification", "checking-for-update");
  });
  autoUpdater.on("error", err => {
    event.sender.send("autoUpdateNotification", "realerror", err);
  });
}
// Open channel to listen for update actions.
ipcMain.on("autoUpdateAction", (event, arg, data) => {
  switch (arg) {
    case "initAutoUpdater":
      console.log("Initializing auto updater.");
      initAutoUpdater(event, data);
      event.sender.send("autoUpdateNotification", "ready");
      break;
    case "checkForUpdate":
      autoUpdater.checkForUpdates().catch(err => {
        event.sender.send("autoUpdateNotification", "realerror", err);
      });
      break;
    case "allowPrereleaseChange":
      if (!data) {
        const preRelComp = semver.prerelease(app.getVersion());
        if (preRelComp != null && preRelComp.length > 0) {
          autoUpdater.allowPrerelease = true;
        } else {
          autoUpdater.allowPrerelease = data;
        }
      } else {
        autoUpdater.allowPrerelease = data;
      }
      break;
    case "installUpdateNow":
      autoUpdater.quitAndInstall();
      break;
    default:
      console.log("Unknown argument", arg);
      break;
  }
});
// Redirect distribution index event from preloader to renderer.
ipcMain.on("distributionIndexDone", (event, res) => {
  event.sender.send("distributionIndexDone", res);
});

// Disable hardware acceleration.
// https://electronjs.org/docs/tutorial/offscreen-rendering
app.disableHardwareAcceleration();

// https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    await win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  await createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
