import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

// GET /api/contacts/favorites
export const getFavorites = catchAsync(async (req: Request, res: Response) => {
  res.json({ message: "List favorite contacts" });
});

// POST /api/contacts/:id/favorite
export const markFavorite = catchAsync(async (req: Request, res: Response) => {
  res.json({ message: `Contact ${req.params.id} marked as favorite` });
});

// DELETE /api/contacts/:id/favorite
export const removeFavorite = catchAsync(
  async (req: Request, res: Response) => {
    res.json({ message: `Contact ${req.params.id} removed from favorites` });
  },
);

// PATCH /api/contacts/:id/favorite
export const toggleFavorite = catchAsync(
  async (req: Request, res: Response) => {
    res.json({ message: `Contact ${req.params.id} favorite status toggled` });
  },
);

// PUT /api/contacts/:id/note
export const updateNote = catchAsync(async (req: Request, res: Response) => {
  res.json({
    message: `Note updated for contact ${req.params.id}`,
    note: req.body.personal_note,
  });
});

// GET /api/contacts/:id
export const getContact = catchAsync(async (req: Request, res: Response) => {
  res.json({ message: `Get details for contact ${req.params.id}` });
});

// GET /api/contacts (Includes search and filter)
export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const { favorite, search, page } = req.query;
  res.json({ message: "List contacts", filters: { favorite, search, page } });
});

// GET /api/contacts/stats
export const getStats = catchAsync(async (req: Request, res: Response) => {
  res.json({
    total_contacts: 0,
    favorite_contacts: 0,
    contacts_with_notes: 0,
  });
});
