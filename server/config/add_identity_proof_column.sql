-- Add identity_proof column to kivi_students table
-- This will store MULTIPLE identity proof documents (Aadhar, Birth Certificate, Passport) in JSON ARRAY format
-- Format: [{"type": "aadhar_card", "image": "base64_string", "uploadDate": "ISO_date"}, {...}]

ALTER TABLE kivi_students 
ADD COLUMN identity_proof JSON NULL 
COMMENT 'Array of identity proof documents with type and base64 image data';

-- Example data structure (ARRAY format - can store multiple documents):
-- [
--   {
--     "type": "aadhar_card",
--     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
--     "uploadDate": "2026-04-28T10:30:00.000Z"
--   },
--   {
--     "type": "birth_certificate",
--     "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
--     "uploadDate": "2026-04-28T10:35:00.000Z"
--   },
--   {
--     "type": "passport",
--     "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
--     "uploadDate": "2026-04-28T10:40:00.000Z"
--   }
-- ]

-- Benefits of ARRAY format:
-- ✅ Can upload all 3 documents (Aadhar, Birth Certificate, Passport)
-- ✅ Can upload only 1 or 2 if needed
-- ✅ Easy to add/remove specific documents
-- ✅ Each document has its own type, image, and upload date
