-- Migration number: 0012 	 2024-08-10T16:45:54.822Z

DROP TABLE IF EXISTS url_cache;
CREATE TABLE url_cache (
    cacheId INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    artworkId INTEGER NOT NULL,
    expireTime DATETIME NOT NULL
);