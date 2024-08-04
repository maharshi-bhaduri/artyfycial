-- Migration number: 0011 	 2024-08-04T10:47:46.507Z


-- Table: user
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    userName VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL,
    lastLoginDate DATE NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    about TEXT,
    socials VARCHAR(255),
    phoneNumber VARCHAR(20),
    location VARCHAR(255),
    joinDate DATE NOT NULL,
    isPublic BOOLEAN NOT NULL,
    artistFlag BOOLEAN NOT NULL,
    profilePicturePath VARCHAR(255),
    isActive BOOLEAN NOT NULL
);

-- Table: artwork
DROP TABLE IF EXISTS artwork;
CREATE TABLE artwork (
    artworkId INTEGER PRIMARY KEY AUTOINCREMENT,
    artistId INTEGER,
    title VARCHAR(255) NOT NULL,
    uploadDate DATE,
    description TEXT,
    isActive BOOLEAN NOT NULL,
    path VARCHAR(255),
    isPublic BOOLEAN NOT NULL,
    clickCount INTEGER
);

-- Table: exhibition
DROP TABLE IF EXISTS exhibition;

-- Indexes for performance
CREATE INDEX idx_user_userName ON user(userName);
CREATE INDEX idx_user_uid ON user(uid);
CREATE INDEX idx_artwork_artistId ON artwork(artistId);


-- Auctions
DROP TABLE IF EXISTS auction;
CREATE TABLE auction (
    auctionId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionName TEXT NOT NULL,
    auctionKey TEXT,
    auctionDescription TEXT,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    auctioneerId INTEGER NOT NULL,
    anonAuction BOOLEAN NOT NULL DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT 1,
    auctionPass VARCHAR(255)
);

DROP TABLE IF EXISTS lot;
CREATE TABLE lot (
    lotId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER,
    lotOrder INTEGER,
    artworkId INTEGER NOT NULL,
    maxBid DECIMAL(15, 2),
    startingBid DECIMAL(15, 2),
    bidIncrement DECIMAL(15, 2)
);

-- marketplace
DROP TABLE IF EXISTS marketplace_item;
CREATE TABLE marketplace_item (
    marketplaceItemId INTEGER PRIMARY KEY AUTOINCREMENT,
    artworkId INTEGER NOT NULL,
    valuation DECIMAL(15, 2),
    minIncrement DECIMAL(15, 2)
);

DROP TABLE IF EXISTS bid;
CREATE TABLE bid (
    bidId INTEGER PRIMARY KEY AUTOINCREMENT,
    parentRefId INTEGER NOT NULL,
    artworkId INTEGER NOT NULL,
    bidderId VARCHAR(255) NOT NULL,
    bidAmount DECIMAL(15, 2) NOT NULL,
    bidTime DATETIME NOT NULL
);