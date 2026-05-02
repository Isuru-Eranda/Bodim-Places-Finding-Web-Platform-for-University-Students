import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
  try {
    const { title, price, location, facilities, images } = req.body;
    const listing = await Listing.create({
      title,
      price,
      location,
      facilities,
      images,
      ownerId: req.user._id,
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const {
      search,
      location,
      minPrice,
      maxPrice,
      facilities,
      isVerified,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Text search across title and location
    if (search) {
      const searchCondition = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
      // Combine search $or with location filter using $and to avoid field conflicts
      if (location) {
        query.$and = [
          searchCondition,
          { location: { $regex: location, $options: "i" } },
        ];
      } else {
        query.$or = searchCondition.$or;
      }
    } else if (location) {
      // Location filter only (no keyword search)
      query.location = { $regex: location, $options: "i" };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Facilities — must include ALL specified facilities
    if (facilities) {
      const facilityList = facilities.split(",").map((f) => f.trim()).filter(Boolean);
      if (facilityList.length > 0) query.facilities = { $all: facilityList };
    }

    // Verified filter
    if (isVerified === "true") {
      query.isVerified = true;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortOption = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("ownerId", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(query),
    ]);

    res.json({
      data: listings,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("ownerId", "name email");
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const isOwner = listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const isOwner = listing.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
