function getCurrentWeekRange(): { startOfWeek: Date; endOfWeek: Date } {
    const now = new Date();
    const day = now.getDay(); // Chủ nhật = 0, Thứ hai = 1, ...
    const diffToMonday = day === 0 ? -6 : 1 - day; // Nếu CN thì lùi 6 ngày
    const diffToSunday = day === 0 ? 0 : 7 - day;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + diffToSunday);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

export function formatDate(
    date: string | Date | undefined,
    format: "short" | "long" | "full" = "short"
): string {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    switch (format) {
        case "short":
            return `${day}/${month}/${year}`;
        case "long":
            return `${day} ${monthNames[dateObj.getMonth()]} ${year}`;
        case "full":
            return `${dayNames[dateObj.getDay()]}, ${day} ${
                monthNames[dateObj.getMonth()]
            } ${year}`;
        default:
            return `${day}/${month}/${year}`;
    }
}

export function formatDateTime(
    date: string | Date | undefined,
    time?: string
): string {
    const formattedDate = formatDate(date);
    if (!time) return formattedDate;
    const formattedTime = formatTime(time);
    return `${formattedDate} ${formattedTime}`;
}

export function getRelativeTime(date: string | Date | undefined): string {
    if (!date) return "N/A";

    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "just now";
    if (diffMinutes < 60)
        return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return formatDate(dateObj);
}

export function formatTime(time: string | undefined): string {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}