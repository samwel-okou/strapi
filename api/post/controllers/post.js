"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;

    // throw "error";

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);

      //backend validation
      if (!data || !data.description) {
        ctx.throw(400, "Please add some content !");
        return;
      }

      if (!files || !files.image) {
        ctx.throw(400, "Please add atleast a file !");
        return;
      }

      const { user } = ctx.state;

      entity = await strapi.services.post.create(
        { ...data, ...{ likes: 0, author: user } },
        { files }
      );
    } else {
      ctx.throw(400, "You must submit a multipart request !");
      //   entities = await strapi.services.post.create({
      //     ...ctx.request.body,
      //     likes: 0,
      //   });
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    let entity;
    if (ctx.is("multipart")) {
      ctx.throw(400, "Please only make JSON request with updated description ");
    } else {
      delete ctx.request.body.likes;
      entity = await strapi.services.post.update(
        { id, author: user.id },
        ctx.request.body
      );
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    const entity = await strapi.services.post.delete({ id, author: user.id });
    return sanitizeEntity(entity, { model: strapi.models.post });
  },
};
