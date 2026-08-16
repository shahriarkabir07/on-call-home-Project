const {
    contextBridge,
    ipcRenderer
} = require('electron');


// =====================================================
// ELECTRON API
// =====================================================

contextBridge.exposeInMainWorld(
    'electronAPI',
    {

        // =============================================
        // AUTH
        // =============================================

        register: (userData) => {

            return ipcRenderer.invoke(
                'auth:register',
                userData
            );
        },


        login: (loginData) => {

            return ipcRenderer.invoke(
                'auth:login',
                loginData
            );
        },


        // =============================================
        // SERVICES
        // =============================================

        getCategories: () => {

            return ipcRenderer.invoke(
                'services:getCategories'
            );
        },


        getWorkersByCategory: (category) => {

            return ipcRenderer.invoke(
                'services:getWorkersByCategory',
                category
            );
        },


        // =============================================
        // BOOKINGS
        // =============================================

        createBooking: (bookingData) => {

            return ipcRenderer.invoke(
                'booking:create',
                bookingData
            );
        },


        getUserBookings: (userId) => {

            return ipcRenderer.invoke(
                'booking:getUserBookings',
                userId
            );
        },


        getWorkerBookings: (workerId) => {

            return ipcRenderer.invoke(
                'booking:getWorkerBookings',
                workerId
            );
        },


        updateBookingStatus: (data) => {

            return ipcRenderer.invoke(
                'booking:updateStatus',
                data
            );
        },


        getAllBookings: () => {

            return ipcRenderer.invoke(
                'booking:getAll'
            );
        },


        // =============================================
        // REVIEWS
        // =============================================

        addReview: (reviewData) => {

            return ipcRenderer.invoke(
                'review:add',
                reviewData
            );
        },


        getWorkerReviews: (workerId) => {

            return ipcRenderer.invoke(
                'review:getWorkerReviews',
                workerId
            );
        }

    }
);