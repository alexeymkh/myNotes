module.exports = class BaseController {
    constructor() {}

    okResp(res, data) {
        return res.status(200).json(data);
    }
}