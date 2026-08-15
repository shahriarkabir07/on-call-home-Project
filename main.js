const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const path = require('path');

const auth = require('./backend/auth');
const service = require('./backend/service');
const booking = require('./backend/booking');
const review = require('./backend/review');


// =====================================================
// CREATE MAIN WINDOW
// =====================================================
function createWindow() {

    const win = new BrowserWindow({

        width: 1280,
        height: 820,

        minWidth: 1000,
        minHeight: 700,

        webPreferences: {

            preload: path.join(
                __dirname,
                'preload.js'
            ),

            contextIsolation: true,

            nodeIntegration: false
        }
    });

    win.loadFile(
        path.join(
            __dirname,
            'frontend',
            'index.html'
        )
    );
}


// =====================================================
// APP READY
// =====================================================
app.whenReady().then(() => {

    createWindow();

    app.on('activate', () => {

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


// =====================================================
// CLOSE APP
// =====================================================
app.on('window-all-closed', () => {

    if (process.platform !== 'darwin') {
        app.quit();
    }
});


// =====================================================
// AUTH - REGISTER
// =====================================================
ipcMain.handle(
    'auth:register',
    async (event, data) => {

        return await auth.registerUser(

            data.fullName,
            data.email,
            data.password,
            data.phone,
            data.role,
            data.workerCategory,
            data.workerRate
        );
    }
);


// =====================================================
// AUTH - LOGIN
// =====================================================
ipcMain.handle(
    'auth:login',
    async (event, data) => {

        return await auth.loginUser(
            data.email,
            data.password
        );
    }
);


// =====================================================
// SERVICES - CATEGORIES
// =====================================================
ipcMain.handle(
    'services:getCategories',
    async () => {

        return await service.getCategories();
    }
);


// =====================================================
// SERVICES - WORKERS BY CATEGORY
// =====================================================
ipcMain.handle(
    'services:getWorkersByCategory',
    async (event, category) => {

        return await service.getWorkersByCategory(
            category
        );
    }
);


// =====================================================
// BOOKINGS - CREATE
// =====================================================
ipcMain.handle(
    'booking:create',
    async (event, data) => {

        return await booking.createBooking(

            data.userId,
            data.serviceId,
            data.customerAddress,
            data.workerId
        );
    }
);


// =====================================================
// BOOKINGS - CUSTOMER
// =====================================================
ipcMain.handle(
    'booking:getUserBookings',
    async (event, userId) => {

        return await booking.getUserBookings(
            userId
        );
    }
);


// =====================================================
// BOOKINGS - WORKER
// =====================================================
ipcMain.handle(
    'booking:getWorkerBookings',
    async (event, workerId) => {

        return await booking.getWorkerBookings(
            workerId
        );
    }
);


// =====================================================
// BOOKINGS - UPDATE STATUS
// =====================================================
ipcMain.handle(
    'booking:updateStatus',
    async (event, data) => {

        return await booking.updateBookingStatus(

            data.bookingId,
            data.status
        );
    }
);


// =====================================================
// BOOKINGS - ADMIN
// =====================================================
ipcMain.handle(
    'booking:getAll',
    async () => {

        return await booking.getAllBookings();
    }
);


// =====================================================
// REVIEWS - ADD
// =====================================================
ipcMain.handle(
    'review:add',
    async (event, data) => {

        return await review.addReview(

            data.bookingId,
            data.customerId,
            data.workerId,
            data.rating,
            data.reviewText
        );
    }
);


// =====================================================
// REVIEWS - WORKER REVIEWS
// =====================================================
ipcMain.handle(
    'review:getWorkerReviews',
    async (event, workerId) => {

        return await review.getWorkerReviews(
            workerId
        );
    }
);