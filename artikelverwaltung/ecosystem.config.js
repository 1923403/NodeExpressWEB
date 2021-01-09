module.exports = {
  apps: [
    {
      script: "./bin/www",
      watch: true,
      ignore_watch: ["./data"],
      watch_options: {
        followSymlinks: false,
      },
      name: "Artikelverwaltung",
    },
  ],
};
