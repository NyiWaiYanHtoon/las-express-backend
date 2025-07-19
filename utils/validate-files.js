// Type guard helper to check if req.files is a fields object (not an array)
export function isFilesFieldsObject(files) {
    return !!files && !Array.isArray(files);
}
