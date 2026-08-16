const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const path = require('path');

// =====================================================
// RAILWAY API
// =====================================================

const API_BASE_URL =
    'https://on-call-home-project-production.up.railway.app';


// =====================================================
// CURRENT WINDOW
// =====================================================

let mainWindow = null;


// =====================================================
// API HELPER
// =====================================================

async function apiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options
            }
        );

        const data = await response.json();

        if (!response.ok) {

            return {
                success: false,
                message:
                    data.message ||
                    `API request failed (${response.status})`
            };
        }

        return data;

    } catch (error) {

        console.error(
            'API Request Error:',
            error
        );

        return {
            success: false,
            message:
                'Unable to connect to OnCall Home server.'
        };
    }
}


// =====================================================
// CREATE WINDOW
// =====================================================

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 1280,
        height: 820,

        minWidth: 1000,
        minHeight: 700,

        show: false,
        focusable: true,

        webPreferences: {

            preload: path.join(
                __dirname,
                'preload.js'
            ),

            contextIsolation: true,

            nodeIntegration: false
        }
    });


    // =================================================
    // LOAD LOGIN PAGE
    // =================================================

    mainWindow.loadFile(
        path.join(
            __dirname,
            'frontend',
            'index.html'
        )
    );


    // =================================================
    // WHEN PAGE IS READY
    // =================================================

    mainWindow.webContents.on(
        'did-finish-load',
        () => {

            setTimeout(() => {

                if (
                    mainWindow &&
                    !mainWindow.isDestroyed()
                ) {

                    mainWindow.show();

                    mainWindow.focus();

                    mainWindow.webContents.focus();
                }

            }, 100);
        }
    );


    // =================================================
    // WINDOW CLOSED
    // =================================================

    mainWindow.on(
        'closed',
        () => {

            mainWindow = null;
        }
    );


    return mainWindow;
}


// =====================================================
// LOGOUT
// =====================================================

ipcMain.handle(
    'app:logout',
    async (event) => {

        try {

            const currentWindow =
                BrowserWindow.fromWebContents(
                    event.sender
                );


            // Create a fresh login window
            const newWindow = createWindow();


            // Close the old dashboard window
            if (
                currentWindow &&
                !currentWindow.isDestroyed()
            ) {

                currentWindow.close();
            }


            return {
                success: true
            };

        } catch (error) {

            console.error(
                'LOGOUT ERROR:',
                error
            );

            return {
                success: false
            };
        }
    }
);


// =====================================================
// APP READY
// =====================================================

app.whenReady().then(() => {

    createWindow();

    app.on(
        'activate',
        () => {

            if (
                BrowserWindow.getAllWindows().length === 0
            ) {

                createWindow();
            }
        }
    );
});


// =====================================================
// CLOSE APP
// =====================================================

app.on(
    'window-all-closed',
    () => {

        if (
            process.platform !== 'darwin'
        ) {

            app.quit();
        }
    }
);


// =====================================================
// AUTH - REGISTER
// =====================================================

ipcMain.handle(
    'auth:register',
    async (event, data) => {

        return await apiRequest(
            '/api/auth/register',
            {
                method: 'POST',

                body: JSON.stringify({

                    fullName:
                        data.fullName,

                    email:
                        data.email,

                    password:
                        data.password,

                    phone:
                        data.phone,

                    role:
                        data.role,

                    workerCategory:
                        data.workerCategory,

                    workerRate:
                        data.workerRate
                })
            }
        );
    }
);


// =====================================================
// AUTH - LOGIN
// =====================================================

ipcMain.handle(
    'auth:login',
    async (event, data) => {

        return await apiRequest(
            '/api/auth/login',
            {
                method: 'POST',

                body: JSON.stringify({

                    email:
                        data.email,

                    password:
                        data.password
                })
            }
        );
    }
);


// =====================================================
// SERVICES - CATEGORIES
// =====================================================

ipcMain.handle(
    'services:getCategories',
    async () => {

        return await apiRequest(
            '/api/services/categories'
        );
    }
);


// =====================================================
// SERVICES - WORKERS
// =====================================================

ipcMain.handle(
    'services:getWorkersByCategory',
    async (event, category) => {

        return await apiRequest(
            `/api/services/workers?category=${encodeURIComponent(
                category
            )}`
        );
    }
);


// =====================================================
// BOOKINGS - CREATE
// =====================================================

ipcMain.handle(
    'booking:create',
    async (event, data) => {

        return await apiRequest(
            '/api/bookings',
            {
                method: 'POST',

                body: JSON.stringify({

                    userId:
                        data.userId,

                    serviceId:
                        data.serviceId,

                    customerAddress:
                        data.customerAddress,

                    workerId:
                        data.workerId
                })
            }
        );
    }
);


// =====================================================
// BOOKINGS - CUSTOMER
// =====================================================

ipcMain.handle(
    'booking:getUserBookings',
    async (event, userId) => {

        return await apiRequest(
            `/api/bookings/user/${userId}`
        );
    }
);


// =====================================================
// BOOKINGS - WORKER
// =====================================================

ipcMain.handle(
    'booking:getWorkerBookings',
    async (event, workerId) => {

        return await apiRequest(
            `/api/bookings/worker/${workerId}`
        );
    }
);


// =====================================================
// BOOKINGS - UPDATE STATUS
// =====================================================

ipcMain.handle(
    'booking:updateStatus',
    async (event, data) => {

        return await apiRequest(
            `/api/bookings/${data.bookingId}/status`,
            {
                method: 'PATCH',

                body: JSON.stringify({

                    status:
                        data.status
                })
            }
        );
    }
);


// =====================================================
// BOOKINGS - ADMIN
// =====================================================

ipcMain.handle(
    'booking:getAll',
    async () => {

        return await apiRequest(
            '/api/bookings/admin'
        );
    }
);


// =====================================================
// REVIEWS - ADD
// =====================================================

ipcMain.handle(
    'review:add',
    async (event, data) => {

        return await apiRequest(
            '/api/reviews',
            {
                method: 'POST',

                body: JSON.stringify({

                    bookingId:
                        data.bookingId,

                    customerId:
                        data.customerId,

                    workerId:
                        data.workerId,

                    rating:
                        data.rating,

                    reviewText:
                        data.reviewText
                })
            }
        );
    }
);


// =====================================================
// REVIEWS - WORKER REVIEWS
// =====================================================

ipcMain.handle(
    'review:getWorkerReviews',
    async (event, workerId) => {

        return await apiRequest(
            `/api/reviews/worker/${workerId}`
        );
    }
);