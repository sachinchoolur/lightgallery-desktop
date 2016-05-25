import { app, Menu, BrowserWindow } from 'electron';

var setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Development',
        submenu: [{
            label: 'check',
            accelerator: 'CmdOrCtrl+R',
            type: 'checkbox', 
            checked: true,
            click: function () {
                BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
            }
        },{
            label: 'Toggle DevTools',
            accelerator: 'Alt+CmdOrCtrl+I',
            click: function () {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        },{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function () {
                app.quit();
            }
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};

export default {
    setDevMenu: setDevMenu,
}
