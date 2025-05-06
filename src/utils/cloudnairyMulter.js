import multer from "multer";
export const fileValidation = {
    image: ["image/png", "image/jpeg", "image/gif"],
    file: ["application/pdf", "application/vnd.ms-excel", "application/msword"],
}
export function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({})
    // const storage = multer.memoryStorage({})
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("in-valied extinsion", false)
        }
    }
    const upload = multer({ dest: "/uploads", fileFilter, storage })
    // const upload = multer({ fileFilter, storage })
    return upload;
}


