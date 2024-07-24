-- Migration number: 0009 	 2024-07-24T12:48:46.255Z

DROP TABLE IF EXISTS lot;
CREATE TABLE lot (
    lotId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER,
    lotOrder INTEGER,
    artworkId INTEGER NOT NULL,
    maxBid DECIMAL(15, 2),
    startingBid DECIMAL(15, 2),
    bidIncrement DECIMAL(15, 2),
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
);

DROP TABLE IF EXISTS bid;
CREATE TABLE bid (
    bidId INTEGER PRIMARY KEY AUTOINCREMENT,
    auctionId INTEGER NOT NULL,
    lotId INTEGER NOT NULL,
    bidderId VARCHAR(255) NOT NULL,
    bidAmount DECIMAL(15, 2) NOT NULL,
    bidTime DATETIME NOT NULL,
    FOREIGN KEY (auctionId) REFERENCES auction(auctionId),
    FOREIGN KEY (lotId) REFERENCES lot(lotId)
);

DROP TABLE IF EXISTS marketplace_bid;
CREATE TABLE marketplace_bid (
    bidId INTEGER PRIMARY KEY AUTOINCREMENT,
    artworkId INTEGER NOT NULL,
    bidderId VARCHAR(255) NOT NULL,
    bidAmount DECIMAL(15, 2) NOT NULL,
    bidTime DATETIME NOT NULL,
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
);


ALTER TABLE artwork ADD COLUMN forSale BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE artwork ADD COLUMN valuation DECIMAL(15, 2);
ALTER TABLE artwork ADD COLUMN startingBid DECIMAL(15, 2);
ALTER TABLE artwork ADD COLUMN bidIncrement DECIMAL(15, 2);

