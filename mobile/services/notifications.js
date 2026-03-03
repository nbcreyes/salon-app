import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission not granted for push notifications");
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
};

export const sendBookingConfirmation = async (booking) => {
  if (typeof window !== "undefined" && !window.Notification) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Booking Confirmed",
        body: `Your ${booking.service?.name || "appointment"} on ${booking.date} at ${booking.timeSlot} is confirmed.`,
      },
      trigger: null,
    });
  } catch (err) {
    console.log("Notification not available on this platform");
  }
};

export const scheduleBookingReminder = async (booking) => {
  try {
    const bookingDate = new Date(`${booking.date}T${booking.timeSlot}:00`);
    const reminderTime = new Date(bookingDate.getTime() - 60 * 60 * 1000);

    if (reminderTime <= new Date()) {
      console.log("Booking is too soon to schedule a reminder");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Appointment",
        body: `You have a ${booking.service?.name || "appointment"} in 1 hour.`,
      },
      trigger: { date: reminderTime },
    });
  } catch (err) {
    console.log("Notification not available on this platform");
  }
};
