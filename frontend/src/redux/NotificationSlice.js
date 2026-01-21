// import { createSlice } from "@reduxjs/toolkit";
// const initialState = { notifications: [] };
// const NotificationSlice = createSlice({
//   name: "notification",
//   initialState,
//   reducers: {
//     addNotification: (state, action) => {
//       const { id, message, type, duration = 3000 } = action.payload;
//       state.notifications.push({
//         id: id || Date.now(),
//         message,
//         type,
//         duration,
//       });
//     },
//     removeNotification: (state, action) => {
//       state.notifications = state.notifications.filter(
//         (notification) => notification.id !== action.payload,
//       );
//     },
//     clearAllNotifications: (state) => {
//       state.notifications = [];
//     },
//   },
// });
// export const { addNotification, removeNotification, clearAllNotifications } =
//   NotificationSlice.actions;
// export default NotificationSlice.reducer;






import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  notifications: [], // Toast notifications
  userNotifications: [], // User notifications from backend
  unreadCount: 0,
  pagination: {
    total: 0,
    page: 1,
    limit: 15,
  },
  trackingInfo: null, // Order tracking data
  loading: false,
  error: null,
};

// Async thunks
export const getUserNotifications = createAsyncThunk(
  "notification/getUserNotifications",
  async ({ page = 1, limit = 15 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark as read");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/api/notifications/read-all");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark all as read");
    }
  }
);

export const trackOrder = createAsyncThunk(
  "notification/trackOrder",
  async (orderNumber, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/orders/track/${orderNumber}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to track order");
    }
  }
);

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Toast notification actions
    addNotification: (state, action) => {
      const { id, message, type, duration = 3000 } = action.payload;
      state.notifications.push({
        id: id || Date.now(),
        message,
        type,
        duration,
      });
    },
    removeNotification: (state, action) => {
      // Remove from user notifications
      state.userNotifications = state.userNotifications.filter(
        (notification) => notification.id !== action.payload
      );
      // Remove from toast notifications
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    clearTrackingInfo: (state) => {
      state.trackingInfo = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user notifications
      .addCase(getUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.userNotifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
        state.pagination = {
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          limit: action.payload.limit || 15,
        };
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.userNotifications.find(
          (n) => n.id === action.payload.id
        );
        if (notification) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.userNotifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Track order
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.trackingInfo = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingInfo = action.payload;
        state.error = null;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.trackingInfo = null;
      });
  },
});

export const { addNotification, removeNotification, clearAllNotifications, clearTrackingInfo } =
  NotificationSlice.actions;

export default NotificationSlice.reducer;