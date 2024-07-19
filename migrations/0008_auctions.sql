-- Migration number: 0008 	 2024-07-16T19:50:49.837Z

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
    auctionPass VARCHAR(255),
    FOREIGN KEY (auctioneerId) REFERENCES user(userId)
);

CREATE TABLE auction_invite (
    inviteId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    invitedArtistId INTEGER NOT NULL,
    invitedBy INTEGER NOT NULL,
    invitedAt DATETIME NOT NULL,
    inviteStatus VARCHAR(255) CHECK( inviteStatus IN ('pending', 'accepted', 'rejected', 'expired')) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (invitedArtistId) REFERENCES user(userId),
    FOREIGN KEY (invitedBy) REFERENCES user(userId)
);

CREATE TABLE auction_artwork_request (
    requestId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    artworkId INTEGER NOT NULL,
    requestedBy INTEGER NOT NULL,
    requestStatus VARCHAR(255) CHECK( requestStatus IN ('pending', 'accepted', 'rejected', 'expired')) NOT NULL DEFAULT 'pending',
    requestedAt DATETIME NOT NULL,
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId),
    FOREIGN KEY (requestedBy) REFERENCES user(userId)
);

CREATE TABLE lot (
    lotId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    lotNumber INTEGER NOT NULL,
    lotName VARCHAR(255),
    lotOwnerId INTEGER NOT NULL,
    artworkId INTEGER NOT NULL,
    maxBid DECIMAL(15, 2),
    startingBid DECIMAL(15, 2),
    bidIncrement DECIMAL(15, 2),
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId),
    FOREIGN KEY (lotOwnerId) REFERENCES user(userId)
);

CREATE TABLE bid (
    bidId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    artworkId INTEGER NOT NULL,
    bidderId VARCHAR(255) NOT NULL,
    bidAmount DECIMAL(15, 2) NOT NULL,
    bidTime DATETIME NOT NULL,
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
);
