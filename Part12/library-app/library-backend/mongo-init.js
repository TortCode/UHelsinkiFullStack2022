db.createUser({
  user: 'teerth',
  pwd: 'ezpassword',
  roles: [
    {
      role: 'dbOwner',
      db: 'librarydb',
    },
  ],
});