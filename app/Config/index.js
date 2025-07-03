module.exports = {
    // Define application configuration
    appRoot: {
      env: process.env.NODE_ENV || "development",
      isProd: process.env.NODE_ENV === "production",
      host: process.env.HOST || "localhost",
      port: process.env.PORT || 3005,
      appName: process.env.APP_NAME || "newProjectSetup",
      getUserFolderName: process.env.USER_FOLDER_NAME || "user",
      getAdminFolderName: process.env.ADMIN_FOLDER_NAME || "admin",
      getEventFolderName: process.env.EVENT_FOLDER_NAME || "event",
      getTicketFolderName: process.env.TICKET_FOLDER_NAME || "ticket",
      getOrganizerFolderName: process.env.ORGANIZER_FOLDER_NAME || "organizer",
      getWebFolderName: process.env.WEB_FOLDER_NAME || "web",
    },
  };
  
  