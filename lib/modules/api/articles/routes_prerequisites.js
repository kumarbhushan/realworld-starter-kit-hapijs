const replyHelper = require('../helpers')

const fetchArticle = server => {
  return {
    method: (request, h) => {
      if (!request.params.slug) {
        return h.continue
      }

      server.methods.services.articles.getBySlug(
        request.params.slug,
        (err, article) => {
          if (err) {
            return replyHelper.constructErrorResponse(err, h)
          }

          if (!article) {
            return h.response({
              errors: {
                404: ['Article not found']
              }
            }).type('application/json').code(404).takeover()
          }

          return article
        })
    },
    assign: 'article'
  }
}

const fetchComment = server => {
  return {
    method: (request, h) => {
      if (!request.params.commentId) {
        return h.continue
      }

      server.methods.services.comments.getById(
        request.params.commentId,
        (err, comment) => {
          if (err) {
            return replyHelper.constructErrorResponse(err, h)
          }

          if (!comment) {
            return h.response(null, {
              errors: {
                404: ['Comment not found']
              }
            }).type('application/json').code(404).takeover()
          }

          return comment
        })
    },
    assign: 'comment'
  }
}

const authorizeArticle = server => {
  return {
    method: (request, h) => {
      if (request.pre.article === 'undefined') {
        return h.continue
      }

      if (request.auth.credentials.user._id.toString() !== request.pre.article.author._id.toString()) {
        return h.response({
          errors: {
            403: [`You cannot perform this action !`]
          }
        }).type('application/json').code(403).takeover()
      }

      return true
    },
    assign: 'authorized'
  }
}

const authorizeComment = server => {
  return {
    method: (request, h) => {
      if (request.pre.comment === 'undefined') {
        return h.continue
      }

      if (request.auth.credentials.user._id.toString() !== request.pre.comment.author._id.toString()) {
        return h.response(null, {
          errors: {
            403: [`You cannot perform this action !`]
          }
        }).type('application/json').code(403).takeover()
      }

      return true
    },
    assign: 'authorized'
  }
}

module.exports = {
  fetchArticle,
  fetchComment,
  authorizeArticle,
  authorizeComment
}
