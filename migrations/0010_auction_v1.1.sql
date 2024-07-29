-- Migration number: 0010 	 2024-07-25T15:46:07.834Z
DROP TABLE IF EXISTS marketplace_bid;

ALTER TABLE artwork drop COLUMN forSale;
ALTER TABLE artwork drop COLUMN valuation;
ALTER TABLE artwork drop COLUMN startingBid;
ALTER TABLE artwork drop COLUMN bidIncrement;

DROP TABLE IF EXISTS marketplace_item;
CREATE TABLE marketplace_item (
    marketplaceItemId INTEGER PRIMARY KEY AUTOINCREMENT,
    artworkId INTEGER NOT NULL,
    valuation DECIMAL(15, 2),
    minIncrement DECIMAL(15, 2),
    FOREIGN KEY (artworkId) REFERENCES artwork(artworkId)
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

