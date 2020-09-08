import File from '../models/File';

class FileController {
    async store(req, res) {
        const { originalname: name, filename: path } = req.file;

        const file = new File({
            name,
            path,
        });
        file.save();

        return res.json({
            id: file.id,
            path: file.path,
            url: file.url,
        });
    }
}

export default new FileController();
