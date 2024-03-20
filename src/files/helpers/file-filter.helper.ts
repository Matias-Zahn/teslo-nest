export const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    callback,
) => {
    if (!file) return callback(new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validateExtension = ['jpg', 'png', 'jpeg', 'gift'];

    if (!validateExtension.includes(fileExtension))
        return callback(
            new Error(`The extension: ${fileExtension} is not accepted`),
            false,
        );

    callback(null, true);
};
