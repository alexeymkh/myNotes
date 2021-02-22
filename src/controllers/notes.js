const BaseController = require('./BaseController.js');
const Note = require('../models/Note');

class NotesCtrl extends BaseController {  
    async create(req, res, next) {
        try {
            const { text } = req.body;
            const note = await Note.create({ text });

            this.okResp(res, { success: true });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async list(req, res, next) {
        try {
            const { page, page_size } = req.query;
            
            const docs = await Note.find()
                .sort({ created_at: -1 })
                .skip(page_size * (page - 1))
                .limit(page_size);
                
            const total = await Note.countDocuments();
            const nextPageExists = total > (page_size * page);

            this.okResp(res, { 
                docs,
                total,
                nextPageExists,
            });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async read(req, res, next) {
        try {
            const { foundNote: note } = req;

            this.okResp(res, { note });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async update(req, res, next) {
        try {            
            const { foundNote: note } = req;
            const { text } = req.body;
            
            note.text = text;
            await note.save();

            this.okResp(res, { success: true });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const { mongoId } = req.params;
            await Note.deleteOne({ _id: mongoId });

            this.okResp(res, { success: true });
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

module.exports = new NotesCtrl();