const {app, BrowserWindow, screen} = require('electron');

let wind;

function createWindow(){

    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    wind = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,  // For accessing Node.js APIs if needed
            contextIsolation: false,
        }
    });

    wind.loadURL('http://localhost:3000');

    wind.on('closed',()=>{
        wind = null;
    });
}

app.on('ready',()=>{
    createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', () => {
    if (wind === null) {
        createWindow();
    }
});