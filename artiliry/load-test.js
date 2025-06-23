module.exports = {
  generatePayload: function (context, events, done) {
    const jobTypes = [
      "health-check",
      "email",
      "data-processing",
      "report-generation",
      "cleanup",
    ];

    const jobCode = jobTypes[Math.floor(Math.random() * jobTypes.length)];

    let payload;
    switch (jobCode) {
      case "health-check":
        payload = { url: "https://example.com/health", jobCode };
        break;
      case "email":
        payload = {
          to: "user@example.com",
          subject: "Test Email",
          body: "Hello from Artillery",
          jobCode,
        };
        break;
      case "data-processing":
        payload = { datasetId: Math.floor(Math.random() * 1000), jobCode };
        break;
      case "report-generation":
        payload = { reportType: "weekly", jobCode };
        break;
      case "cleanup":
        payload = { tempFolder: "/tmp/files", jobCode };
        break;
      default:
        payload = { jobCode };
    }

    context.vars.jobCode = jobCode;
    context.vars.payload = payload;
    return done();
  },
};
