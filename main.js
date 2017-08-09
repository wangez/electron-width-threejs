const electron = require('electron');

const {app, BrowserWindow} = electron;

const creatWindow = () => {
    mainWindow = new BrowserWindow({
        width: '100%',
        height: '100%'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

let mainWindow;



app.on('ready', creatWindow);

app.on('window-all-closed', e => {
    app.quit();
});

app.on('active', () => {
    if (mainWindow === undefined) {
        creatWindow();
    }
});