import File from '../models/File';

class FileController {
    async store(req, res) {
        const fileArray = [];
        if (req.files) {
            req.files.forEach((file) => {
                const { originalname: name, filename: path } = file;

                const dbFile = new File({
                    name,
                    path,
                });
                dbFile.save();

                fileArray.push(dbFile.id);
            });
        }

        return res.json(fileArray);
    }
}

export default new FileController();
