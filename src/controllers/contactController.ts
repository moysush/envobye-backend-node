// src/controllers/contactController.ts
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import Contact from "../models/Contact";

// simulate an authenticated user ID since we aren't building a full login system
const MOCK_USER_ID = "user_12345";

// GET /api/contacts/favorites
export const getFavorites = catchAsync(async (req: Request, res: Response) => {
  const favorites = await Contact.find({
    user_id: MOCK_USER_ID,
    is_favorite: true,
  });
  res.json({ data: favorites });
});

// POST /api/contacts/:id/favorite
export const markFavorite = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user_id: MOCK_USER_ID },
    { is_favorite: true },
    { new: true, runValidators: true },
  );

  if (!contact) throw new AppError("Contact not found", 404);
  res.json({ data: contact });
});

// DELETE /api/contacts/:id/favorite
export const removeFavorite = catchAsync(
  async (req: Request, res: Response) => {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user_id: MOCK_USER_ID },
      { is_favorite: false },
      { new: true, runValidators: true },
    );

    if (!contact) throw new AppError("Contact not found", 404);
    res.json({ data: contact });
  },
);

// PATCH /api/contacts/:id/favorite
export const toggleFavorite = catchAsync(
  async (req: Request, res: Response) => {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user_id: MOCK_USER_ID,
    });

    if (!contact) throw new AppError("Contact not found", 404);

    contact.is_favorite = !contact.is_favorite;
    await contact.save();

    res.json({ data: contact });
  },
);

// PUT /api/contacts/:id/note
export const updateNote = catchAsync(async (req: Request, res: Response) => {
  const { personal_note } = req.body;

  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user_id: MOCK_USER_ID },
    { personal_note },
    { new: true, runValidators: true },
  );

  if (!contact) throw new AppError("Contact not found", 404);
  res.json({ data: contact });
});

// GET /api/contacts/:id
export const getContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user_id: MOCK_USER_ID,
  });

  if (!contact) throw new AppError("Contact not found", 404);
  res.json({ data: contact });
});

// GET /api/contacts (Includes search, filter, and pagination)
export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const { favorite, search, page = 1, limit = 15 } = req.query;

  // build the query object dynamically
  const query: any = { user_id: MOCK_USER_ID };

  if (favorite === "1") {
    query.is_favorite = true;
  }

  // search by first name, last name, or email
  if (search) {
    const searchRegex = new RegExp(search as string, "i");
    query.$or = [
      { first_name: searchRegex },
      { last_name: searchRegex },
      { email: searchRegex },
    ];
  }

  // calculate pagination
  const skip = (Number(page) - 1) * Number(limit);

  // execute queries
  const contacts = await Contact.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Contact.countDocuments(query);

  res.json({
    data: contacts,
    meta: {
      current_page: Number(page),
      last_page: Math.ceil(total / Number(limit)),
      total_items: total,
    },
  });
});

// GET /api/contacts/stats
export const getStats = catchAsync(async (req: Request, res: Response) => {
  // MongoDB Aggregation Pipeline for maximum efficiency
  const stats = await Contact.aggregate([
    { $match: { user_id: MOCK_USER_ID } },
    {
      $group: {
        _id: null,
        total_contacts: { $sum: 1 },
        favorite_contacts: {
          $sum: { $cond: [{ $eq: ["$is_favorite", true] }, 1, 0] },
        },
        contacts_with_notes: {
          $sum: { $cond: [{ $ne: ["$personal_note", null] }, 1, 0] },
        },
      },
    },
  ]);

  const result = stats[0] || {
    total_contacts: 0,
    favorite_contacts: 0,
    contacts_with_notes: 0,
  };

  delete result._id;

  res.json(result);
});
