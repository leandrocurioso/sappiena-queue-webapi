const Controller = require("../../controller");
const Joi = require("joi");

const baseUri = "/v1/teach";
class ProjectTeachController extends Controller {

    constructor(configuration, router) {
        super(configuration, router);
    }

    //> POST(/)
    create(context) {
        return [
            (req, res, next) => context.validateRequest(
            {
                body: req.body
            },
            {
                body: Joi.object().keys(
                {
                    requesterUserId: Joi.number().integer().required(),
                    projectKeyhash: Joi.string().guid().required()
                }).required()
            }, next),
            async (req, res, next) =>
            {
                try {
                    await req.queues.teach.add({
                        bodyrequesterUserId: parseInt(req.body.requesterUserId, 10), 
                        projectKeyhash: req.body.projectKeyhash
                    }, {
                        removeOnComplete: true,
                        jobId: req.body.projectKeyhash,
                        attempts: 3
                    });
                    return context.respond(res, 202);
                } catch(err) {
                    return next(err);
                }
            }
        ];
    }

}

ProjectTeachController.baseUri = baseUri;
module.exports = ProjectTeachController;
