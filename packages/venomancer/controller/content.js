'use strict'

const handle = async (ctx, content, opts) => {
    ctx.type = 'text/html'
    ctx.body = await ctx.headlessChrome.content(content, opts)
}

exports.get = async ctx => {
    const { content, ...opts } = ctx.query
    await handle(ctx, content, opts)
}

exports.post = async ctx => {
    const { content, ...opts } = ctx.request.body
    await handle(ctx, content, opts)
}