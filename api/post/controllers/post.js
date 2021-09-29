"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entities;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entities = await strapi.services.post.create(data, { files });
    } else {
      entities = await strapi.services.post.create(ctx.request.body);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.restaurant })
    );
  },
};
