-- Migration number: 0012 	 2024-08-10T16:45:54.822Z

DROP TABLE IF EXISTS image_url_store;
CREATE TABLE image_url_store (
    artworkId INTEGER PRIMARY KEY,
    url TEXT NOT NULL,
    metadata TEXT,
    expireTime DATETIME NOT NULL
);

-- not applied yet