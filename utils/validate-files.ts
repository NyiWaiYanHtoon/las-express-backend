// Type guard helper to check if req.files is a fields object (not an array)
export function isFilesFieldsObject(
  files:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined
): files is { [fieldname: string]: Express.Multer.File[] } {
  return !!files && !Array.isArray(files);
}